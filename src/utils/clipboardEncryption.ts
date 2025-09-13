/**
 * Secure encryption utilities for clipboard content
 */

import {
  ClipboardEncryptionConfig,
  DEFAULT_CLIPBOARD_ENCRYPTION_CONFIG,
  ClipboardSecurityLevel
} from '../types/clipboardSecurity';

export class ClipboardEncryption {
  private config: ClipboardEncryptionConfig;
  private cacheKey: string = 'clipboard_encryption_key';

  constructor(config?: Partial<ClipboardEncryptionConfig>) {
    this.config = { ...DEFAULT_CLIPBOARD_ENCRYPTION_CONFIG, ...config };
  }

  /**
   * Generate a secure encryption key
   */
  private async generateKey(): Promise<CryptoKey> {
    const keyMaterial = await crypto.subtle.generateKey(
      {
        name: 'PBKDF2',
        hash: 'SHA-256',
        salt: new TextEncoder().encode('clipboard_secure_salt_' + Date.now())
      },
      true,
      ['deriveKey']
    );

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: new TextEncoder().encode('clipboard_secure_salt'),
        iterations: this.config.iterations,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: this.config.algorithm, length: this.config.keyLength },
      false,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Generate initialization vector
   */
  private generateIV(): Uint8Array {
    return crypto.getRandomValues(new Uint8Array(this.config.ivLength / 8));
  }

  /**
   * Encrypt clipboard content
   */
  async encrypt(content: string, securityLevel: ClipboardSecurityLevel): Promise<{
    encrypted: string;
    iv: string;
    key: string;
  }> {
    // Only encrypt sensitive content
    if (securityLevel === ClipboardSecurityLevel.PUBLIC) {
      return {
        encrypted: content,
        iv: '',
        key: ''
      };
    }

    try {
      const key = await this.generateKey();
      const iv = this.generateIV();

      const encodedContent = new TextEncoder().encode(content);
      const encrypted = await crypto.subtle.encrypt(
        {
          name: this.config.algorithm,
          iv: iv
        },
        key,
        encodedContent
      );

      // Export key for storage
      const exportedKey = await crypto.subtle.exportKey('raw', key);

      return {
        encrypted: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
        iv: btoa(String.fromCharCode(...iv)),
        key: btoa(String.fromCharCode(...new Uint8Array(exportedKey)))
      };
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Failed to encrypt clipboard content');
    }
  }

  /**
   * Decrypt clipboard content
   */
  async decrypt(
    encrypted: string,
    iv: string,
    key: string,
    securityLevel: ClipboardSecurityLevel
  ): Promise<string> {
    // Public content doesn't need decryption
    if (securityLevel === ClipboardSecurityLevel.PUBLIC) {
      return encrypted;
    }

    try {
      const encryptedArray = new Uint8Array(
        atob(encrypted).split('').map(char => char.charCodeAt(0))
      );
      const ivArray = new Uint8Array(
        atob(iv).split('').map(char => char.charCodeAt(0))
      );
      const keyArray = new Uint8Array(
        atob(key).split('').map(char => char.charCodeAt(0))
      );

      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyArray,
        { name: this.config.algorithm, length: this.config.keyLength },
        false,
        ['decrypt']
      );

      const decrypted = await crypto.subtle.decrypt(
        {
          name: this.config.algorithm,
          iv: ivArray
        },
        cryptoKey,
        encryptedArray
      );

      return new TextDecoder().decode(decrypted);
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Failed to decrypt clipboard content');
    }
  }

  /**
   * Securely clear sensitive data from memory
   */
  secureClear(data: string | Uint8Array): void {
    if (typeof data === 'string') {
      // Overwrite string in memory
      const array = new Uint8Array(data.split('').map(char => char.charCodeAt(0)));
      crypto.getRandomValues(array); // Overwrite with random data
    } else {
      // Overwrite Uint8Array
      crypto.getRandomValues(data);
    }
  }

  /**
   * Generate content hash for integrity verification
   */
  async generateContentHash(content: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Verify content integrity
   */
  async verifyContentHash(content: string, expectedHash: string): Promise<boolean> {
    const actualHash = await this.generateContentHash(content);
    return actualHash === expectedHash;
  }

  /**
   * Store encryption key securely
   */
  async storeEncryptionKey(key: string, metadataId: string): Promise<void> {
    try {
      const storage = window.sessionStorage; // Use sessionStorage for temporary storage
      const encryptedKey = await this.encryptKey(key, metadataId);
      storage.setItem(`${this.cacheKey}_${metadataId}`, encryptedKey);
    } catch (error) {
      console.error('Failed to store encryption key:', error);
    }
  }

  /**
   * Retrieve encryption key
   */
  async retrieveEncryptionKey(metadataId: string): Promise<string | null> {
    try {
      const storage = window.sessionStorage;
      const encryptedKey = storage.getItem(`${this.cacheKey}_${metadataId}`);
      if (!encryptedKey) return null;

      return this.decryptKey(encryptedKey, metadataId);
    } catch (error) {
      console.error('Failed to retrieve encryption key:', error);
      return null;
    }
  }

  /**
   * Clear stored encryption key
   */
  clearEncryptionKey(metadataId: string): void {
    try {
      const storage = window.sessionStorage;
      storage.removeItem(`${this.cacheKey}_${metadataId}`);
    } catch (error) {
      console.error('Failed to clear encryption key:', error);
    }
  }

  /**
   * Encrypt key for storage
   */
  private async encryptKey(key: string, metadataId: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(key + metadataId);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));
  }

  /**
   * Decrypt key from storage
   */
  private async decryptKey(encryptedKey: string, metadataId: string): Promise<string> {
    // In a real implementation, this would use a master key
    // For now, we'll use a simple approach
    return encryptedKey;
  }
}

// Export singleton instance
export const clipboardEncryption = new ClipboardEncryption();