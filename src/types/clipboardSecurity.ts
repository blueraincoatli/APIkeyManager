/**
 * Secure Clipboard Types and Configuration
 * Implements security requirements for clipboard operations
 */

// Security configuration for clipboard operations
export interface ClipboardSecurityConfig {
  // Automatic clipboard clearing timeout in milliseconds
  clearTimeoutMs: number;
  // Maximum clipboard content length in characters
  maxContentLength: number;
  // Whether to encrypt sensitive clipboard content
  enableEncryption: boolean;
  // Whether to log clipboard operations
  enableAuditLogging: boolean;
  // Whether to validate clipboard content on paste
  enablePasteValidation: boolean;
  // Authorization required for clipboard access
  requireAuthorization: boolean;
  // Default clipboard content expiration in milliseconds
  defaultExpirationMs: number;
}

// Default security configuration
export const DEFAULT_CLIPBOARD_SECURITY_CONFIG: ClipboardSecurityConfig = {
  clearTimeoutMs: 30000, // 30 seconds
  maxContentLength: 10000, // 10KB
  enableEncryption: true,
  enableAuditLogging: true,
  enablePasteValidation: true,
  requireAuthorization: true,
  defaultExpirationMs: 60000 // 1 minute
};

// Types of clipboard operations
export enum ClipboardOperation {
  COPY = 'copy',
  PASTE = 'paste',
  CLEAR = 'clear',
  READ = 'read'
}

// Clipboard content security level
export enum ClipboardSecurityLevel {
  PUBLIC = 'public',      // Non-sensitive data
  SENSITIVE = 'sensitive', // User data that needs protection
  CONFIDENTIAL = 'confidential', // API keys, passwords
  CRITICAL = 'critical'    // Highly sensitive secrets
}

// Clipboard content metadata
export interface ClipboardContentMetadata {
  id: string;
  operation: ClipboardOperation;
  securityLevel: ClipboardSecurityLevel;
  timestamp: number;
  expiresAt: number;
  contentType?: string;
  source?: string;
  userId?: string;
  isEncrypted: boolean;
  contentHash?: string;
  validationRules?: string[];
  iv?: string; // 可选：加密向量（部分实现会用到）
}

// Authorization context for clipboard access
export interface ClipboardAuthorizationContext {
  userId?: string;
  sessionId?: string;
  permissions: string[];
  ipAddress?: string;
  userAgent?: string;
  timestamp: number;
}

// Validation result for clipboard content
export interface ClipboardValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  sanitizedContent?: string;
  securityLevel?: ClipboardSecurityLevel;
}

// Audit log entry for clipboard operations
export interface ClipboardAuditLog {
  id: string;
  operation: ClipboardOperation;
  timestamp: number;
  userId?: string;
  sessionId?: string;
  source: string;
  success: boolean;
  securityLevel: ClipboardSecurityLevel;
  contentLength?: number;
  contentType?: string;
  errors?: string[];
  metadata?: Record<string, unknown>;
}

// Clipboard content wrapper with security metadata
export interface SecureClipboardContent {
  content: string;
  metadata: ClipboardContentMetadata;
  authorization?: ClipboardAuthorizationContext;
}

// Encryption configuration
export interface ClipboardEncryptionConfig {
  algorithm: string;
  keyLength: number;
  ivLength: number;
  iterations: number;
}

export const DEFAULT_CLIPBOARD_ENCRYPTION_CONFIG: ClipboardEncryptionConfig = {
  algorithm: 'AES-GCM',
  keyLength: 256,
  ivLength: 96,
  iterations: 100000
};
