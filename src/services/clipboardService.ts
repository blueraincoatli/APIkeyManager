import { invoke } from "@tauri-apps/api/core";
import { logSecureError, logSecureInfo, logSecureWarning, OperationContext } from "./secureLogging";
import {
  ClipboardSecurityConfig,
  DEFAULT_CLIPBOARD_SECURITY_CONFIG,
  ClipboardOperation,
  ClipboardSecurityLevel,
  ClipboardContentMetadata,
  ClipboardAuthorizationContext
} from "../types/clipboardSecurity";
import { clipboardEncryption } from "../utils/clipboardEncryption";
import { clipboardValidator } from "../utils/clipboardValidation";
import { clipboardAuditService } from "./clipboardAuditService";

// Secure clipboard service class with comprehensive security features
class SecureClipboardService {
  private activeOperations: Map<string, number> = new Map();
  private clipboardMetadata: Map<string, ClipboardContentMetadata> = new Map();
  private config: ClipboardSecurityConfig = DEFAULT_CLIPBOARD_SECURITY_CONFIG;

  // Initialize service with custom configuration
  initialize(config?: Partial<ClipboardSecurityConfig>): void {
    this.config = { ...DEFAULT_CLIPBOARD_SECURITY_CONFIG, ...config };
    this.cleanupExpiredOperations();
  }

  // Get clipboard content with security validation
  async getClipboardContent(
    authorization?: ClipboardAuthorizationContext,
    metadataId?: string
  ): Promise<string> {
    const startTime = Date.now();
    let result = "";
    let securityLevel = ClipboardSecurityLevel.PUBLIC;

    try {
      // Check authorization
      if (this.config.requireAuthorization && authorization) {
        if (!this.validateAuthorization(authorization, ['clipboard:read'])) {
          logSecureWarning(OperationContext.API_KEY_COPY, "Unauthorized clipboard read attempt");
          await clipboardAuditService.logOperation(
            ClipboardOperation.READ,
            false,
            securityLevel,
            authorization,
            {
              source: 'getClipboardContent',
              errors: ['Unauthorized access attempt']
            }
          );
          return "";
        }
      }

      // Retrieve metadata if provided
      let metadata: ClipboardContentMetadata | undefined;
      if (metadataId) {
        metadata = this.clipboardMetadata.get(metadataId);
        if (metadata && !clipboardValidator.validateExpiration(metadata.expiresAt)) {
          logSecureWarning(OperationContext.API_KEY_COPY, "Attempted to access expired clipboard content");
          this.clipboardMetadata.delete(metadataId);
          return "";
        }
      }

      // Get raw content from clipboard
      const rawContent = (await invoke("get_clipboard_content")) as unknown as string;

      // Decrypt if necessary
      if (metadata?.isEncrypted) {
        const encryptionKey = await clipboardEncryption.retrieveEncryptionKey(metadataId || "");
        if (encryptionKey) {
          result = await clipboardEncryption.decrypt(
            rawContent as string,
            metadata.iv || "",
            encryptionKey,
            metadata.securityLevel
          );
          securityLevel = metadata.securityLevel;

          // Clear the encryption key after use
          clipboardEncryption.clearEncryptionKey(metadataId || "");
        } else {
          logSecureError(OperationContext.API_KEY_COPY, new Error("Failed to retrieve encryption key"), {
            operation: 'get_clipboard_encrypted'
          });
          return "";
        }
      } else {
        result = rawContent;
        securityLevel = metadata?.securityLevel || clipboardValidator.detectSecurityLevel(result);
      }

      // Validate content
      const validation = await clipboardValidator.validatePasteContent(result);
      if (!validation.isValid) {
        logSecureWarning(OperationContext.API_KEY_COPY, `Clipboard content validation failed: ${validation.errors.join(', ')}`);
        await clipboardAuditService.logOperation(
          ClipboardOperation.READ,
          false,
          securityLevel,
          authorization,
          {
            source: 'getClipboardContent',
            contentLength: result.length,
            errors: validation.errors
          }
        );
        return "";
      }

      // Log successful read
      success = true;
      await clipboardAuditService.logOperation(
        ClipboardOperation.READ,
        true,
        securityLevel,
        authorization,
        {
          source: 'getClipboardContent',
          contentLength: result.length,
          duration: Date.now() - startTime
        }
      );

      return result;
    } catch (error) {
      logSecureError(OperationContext.API_KEY_COPY, error, {
        operation: 'get_clipboard',
        metadataId,
        duration: String(Date.now() - startTime)
      });

      await clipboardAuditService.logOperation(
        ClipboardOperation.READ,
        false,
        securityLevel,
        authorization,
        {
          source: 'getClipboardContent',
          errors: [error instanceof Error ? error.message : 'Unknown error'],
          duration: Date.now() - startTime
        }
      );

      return "";
    }
  }
  async copyToClipboard(
    content: string,
    securityLevel: ClipboardSecurityLevel = ClipboardSecurityLevel.SENSITIVE,
    authorization?: ClipboardAuthorizationContext,
    options?: {
      timeout?: number;
      validationRules?: string[];
      customMetadata?: Record<string, unknown>;
    }
  ): Promise<{ success: boolean; metadataId?: string; error?: string }> {
    const startTime = Date.now();
    const metadataId = this.generateMetadataId();
    let encryptedContent = content;
    let encryptionResult = { encrypted: content, iv: "", key: "" };

    try {
      // Validate content length
      if (content.length > this.config.maxContentLength) {
        const error = `Content too long: Maximum ${this.config.maxContentLength} characters allowed`;
        logSecureWarning(OperationContext.API_KEY_COPY, error);
        return { success: false, error };
      }

      // Check authorization
      if (this.config.requireAuthorization && authorization) {
        if (!this.validateAuthorization(authorization, ['clipboard:write'])) {
          logSecureWarning(OperationContext.API_KEY_COPY, "Unauthorized clipboard write attempt");
          await clipboardAuditService.logOperation(
            ClipboardOperation.COPY,
            false,
            securityLevel,
            authorization,
            {
              source: 'copyToClipboard',
              errors: ['Unauthorized access attempt']
            }
          );
          return { success: false, error: "Unauthorized access" };
        }
      }

      // Validate content
      if (this.config.enablePasteValidation) {
        const validation = await clipboardValidator.validatePasteContent(
          content,
          options?.validationRules
        );
        if (!validation.isValid) {
          logSecureWarning(OperationContext.API_KEY_COPY, `Content validation failed: ${validation.errors.join(', ')}`);
          await clipboardAuditService.logOperation(
            ClipboardOperation.COPY,
            false,
            securityLevel,
            authorization,
            {
              source: 'copyToClipboard',
              contentLength: content.length,
              errors: validation.errors
            }
          );
          return { success: false, error: "Content validation failed" };
        }
      }

      // Encrypt sensitive content
      if (this.config.enableEncryption && securityLevel !== ClipboardSecurityLevel.PUBLIC) {
        encryptionResult = await clipboardEncryption.encrypt(content, securityLevel);
        encryptedContent = encryptionResult.encrypted;

        // Store encryption key temporarily
        if (encryptionResult.key) {
          await clipboardEncryption.storeEncryptionKey(encryptionResult.key, metadataId);
        }
      }

      // Copy to clipboard
      const copyResult = await invoke("copy_to_clipboard", {
        content: encryptedContent
      });

      if (!copyResult) {
        throw new Error("Failed to copy to clipboard");
      }

      // Create metadata
      const metadata: ClipboardContentMetadata = {
        id: metadataId,
        operation: ClipboardOperation.COPY,
        securityLevel,
        timestamp: startTime,
        expiresAt: startTime + (options?.timeout || this.config.clearTimeoutMs),
        contentType: this.detectContentType(content),
        source: authorization?.userId || 'unknown',
        userId: authorization?.userId,
        isEncrypted: this.config.enableEncryption && securityLevel !== ClipboardSecurityLevel.PUBLIC,
        iv: encryptionResult.iv,
        validationRules: options?.validationRules,
        ...options?.customMetadata
      };

      // Store metadata
      this.clipboardMetadata.set(metadataId, metadata);

      // Schedule automatic clearing
      const timeout = options?.timeout || this.config.clearTimeoutMs;
      if (timeout > 0) {
        const clearTimeout = setTimeout(async () => {
          await this.clearClipboard(metadataId);
        }, timeout);
        this.activeOperations.set(metadataId, clearTimeout);
      }

      success = true;

      // Log successful copy
      if (this.config.enableAuditLogging) {
        await clipboardAuditService.logOperation(
          ClipboardOperation.COPY,
          true,
          securityLevel,
          authorization,
          {
            source: 'copyToClipboard',
            contentLength: content.length,
            contentType: metadata.contentType,
            duration: Date.now() - startTime
          }
        );
      }

      logSecureInfo(OperationContext.API_KEY_COPY, `Content copied to clipboard (Security Level: ${securityLevel})`);

      return { success: true, metadataId };
    } catch (error) {
      logSecureError(OperationContext.API_KEY_COPY, error, {
        operation: 'copy_to_clipboard',
        metadataId,
        securityLevel,
        duration: String(Date.now() - startTime)
      });

      if (this.config.enableAuditLogging) {
        await clipboardAuditService.logOperation(
          ClipboardOperation.COPY,
          false,
          securityLevel,
          authorization,
          {
            source: 'copyToClipboard',
            contentLength: content.length,
            errors: [error instanceof Error ? error.message : 'Unknown error'],
            duration: Date.now() - startTime
          }
        );
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
  async clearClipboard(metadataId?: string): Promise<boolean> {
    const startTime = Date.now();
    let securityLevel = ClipboardSecurityLevel.PUBLIC;

    try {
      if (metadataId) {
        const metadata = this.clipboardMetadata.get(metadataId);
        if (metadata) {
          securityLevel = metadata.securityLevel;
          this.clipboardMetadata.delete(metadataId);
        }

        // Clear timeout
        const timeout = this.activeOperations.get(metadataId);
        if (timeout) {
          clearTimeout(timeout);
          this.activeOperations.delete(metadataId);
        }
      }

      // Clear clipboard by copying empty string
      await invoke("copy_to_clipboard", { content: "" });

      // Clear any remaining encryption keys
      if (metadataId) {
        clipboardEncryption.clearEncryptionKey(metadataId);
      }

      success = true;

      if (this.config.enableAuditLogging) {
        await clipboardAuditService.logOperation(
          ClipboardOperation.CLEAR,
          true,
          securityLevel,
          undefined,
          {
            source: 'clearClipboard',
            duration: Date.now() - startTime
          }
        );
      }

      return true;
    } catch (error) {
      logSecureError(OperationContext.API_KEY_COPY, error, {
        operation: 'clear_clipboard',
        metadataId,
        duration: String(Date.now() - startTime)
      });

      if (this.config.enableAuditLogging) {
        await clipboardAuditService.logOperation(
          ClipboardOperation.CLEAR,
          false,
          securityLevel,
          undefined,
          {
            source: 'clearClipboard',
            errors: [error instanceof Error ? error.message : 'Unknown error'],
            duration: Date.now() - startTime
          }
        );
      }

      return false;
    }
  }
  getClipboardMetadata(metadataId: string): ClipboardContentMetadata | undefined {
    const metadata = this.clipboardMetadata.get(metadataId);
    if (metadata && !clipboardValidator.validateExpiration(metadata.expiresAt)) {
      this.clipboardMetadata.delete(metadataId);
      return undefined;
    }
    return metadata;
  }
  isClipboardValid(metadataId: string): boolean {
    const metadata = this.clipboardMetadata.get(metadataId);
    return metadata ? clipboardValidator.validateExpiration(metadata.expiresAt) : false;
  }
  getActiveOperations(): Array<{ metadataId: string; expiresAt: number; securityLevel: ClipboardSecurityLevel }> {
    const operations: Array<{ metadataId: string; expiresAt: number; securityLevel: ClipboardSecurityLevel }> = [];

    for (const [metadataId, metadata] of this.clipboardMetadata) {
      if (clipboardValidator.validateExpiration(metadata.expiresAt)) {
        operations.push({
          metadataId,
          expiresAt: metadata.expiresAt,
          securityLevel: metadata.securityLevel
        });
      } else {
        // Clean up expired entries
        this.clipboardMetadata.delete(metadataId);
        const timeout = this.activeOperations.get(metadataId);
        if (timeout) {
          clearTimeout(timeout);
          this.activeOperations.delete(metadataId);
        }
      }
    }

    return operations;
  }
  private cleanupExpiredOperations(): void {
    const now = Date.now();

    for (const [metadataId, metadata] of this.clipboardMetadata) {
      if (now > metadata.expiresAt) {
        this.clipboardMetadata.delete(metadataId);
        const timeout = this.activeOperations.get(metadataId);
        if (timeout) {
          clearTimeout(timeout);
          this.activeOperations.delete(metadataId);
        }
      }
    }
  }
  private generateMetadataId(): string {
    return `clip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  private validateAuthorization(authorization: ClipboardAuthorizationContext, requiredPermissions: string[]): boolean {
    return requiredPermissions.some(perm => authorization.permissions.includes(perm));
  }
  private detectContentType(content: string): string {
    if (content.startsWith('http://') || content.startsWith('https://')) {
      return 'url';
    }
    if (content.includes('@')) {
      return 'email';
    }
    if (/^\d+$/.test(content)) {
      return 'number';
    }
    if (content.includes('\n')) {
      return 'multiline';
    }
    return 'text';
  }

  // Extend clipboard expiration
  async extendExpiration(metadataId: string, additionalMs: number): Promise<boolean> {
    const metadata = this.clipboardMetadata.get(metadataId);
    if (!metadata) {
      return false;
    }

    // Clear existing timeout
    const timeout = this.activeOperations.get(metadataId);
    if (timeout) {
      clearTimeout(timeout);
      this.activeOperations.delete(metadataId);
    }

    // Update expiration
    metadata.expiresAt += additionalMs;
    this.clipboardMetadata.set(metadataId, metadata);

    // Set new timeout
    const newTimeout = setTimeout(async () => {
      await this.clearClipboard(metadataId);
    }, metadata.expiresAt - Date.now());
    this.activeOperations.set(metadataId, newTimeout);

    return true;
  }
}

// Create and export singleton instance
export const clipboardService = new SecureClipboardService();

// Initialize service with default configuration
clipboardService.initialize();
