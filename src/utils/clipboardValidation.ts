/**
 * Clipboard content validation utilities
 */

import {
  ClipboardValidationResult,
  ClipboardSecurityLevel,
  DEFAULT_CLIPBOARD_SECURITY_CONFIG
} from '../types/clipboardSecurity';

export class ClipboardValidator {
  /**
   * Validate clipboard content before paste operations
   */
  async validatePasteContent(
    content: string,
    validationRules: string[] = []
  ): Promise<ClipboardValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Basic validation
    if (!content || typeof content !== 'string') {
      errors.push('Invalid clipboard content: Content must be a non-empty string');
      return {
        isValid: false,
        errors,
        warnings
      };
    }

    // Length validation
    if (content.length > DEFAULT_CLIPBOARD_SECURITY_CONFIG.maxContentLength) {
      errors.push(`Content too long: Maximum ${DEFAULT_CLIPBOARD_SECURITY_CONFIG.maxContentLength} characters allowed`);
    }

    // Security level detection
    const securityLevel = this.detectSecurityLevel(content);

    // Content pattern validation
    const patternValidation = this.validateContentPatterns(content);
    errors.push(...patternValidation.errors);
    warnings.push(...patternValidation.warnings);

    // Custom validation rules
    if (validationRules.length > 0) {
      const customValidation = this.applyCustomRules(content, validationRules);
      errors.push(...customValidation.errors);
      warnings.push(...customValidation.warnings);
    }

    // Sanitization
    const sanitizedContent = this.sanitizeContent(content);

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      sanitizedContent,
      securityLevel
    };
  }

  /**
   * Detect security level of clipboard content
   */
  detectSecurityLevel(content: string): ClipboardSecurityLevel {

    // Check for critical patterns (API keys, passwords, tokens)
    const criticalPatterns = [
      /api[_\s-]?key/i,
      /secret[_\s-]?key/i,
      /access[_\s-]?token/i,
      /refresh[_\s-]?token/i,
      /bearer[_\s-]+[a-zA-Z0-9\-_]{20,}/i,
      /sk_[a-zA-Z0-9]{20,}/i, // Stripe keys
      /pk_[a-zA-Z0-9]{20,}/i, // Stripe publishable keys
      /ghp_[a-zA-Z0-9]{20,}/i, // GitHub personal access tokens
      /github_pat_[a-zA-Z0-9_]{20,}/i, // GitHub fine-grained PATs
      /AIza[0-9A-Za-z\-_]{35}/i, // Google API keys
      /xox[bap]-[0-9]{12}-[0-9]{12}-[0-9a-zA-Z]{24}/i, // Slack tokens
      /password\s*[:=]/i,
      /pwd\s*[:=]/i
    ];

    for (const pattern of criticalPatterns) {
      if (pattern.test(content)) {
        return ClipboardSecurityLevel.CRITICAL;
      }
    }

    // Check for confidential patterns
    const confidentialPatterns = [
      /[a-zA-Z0-9]{32,}/i, // Long random strings
      /eyJ[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]*/i, // JWT tokens
      /-----BEGIN\s+(PRIVATE|ENCRYPTED)\s+KEY-----/i,
      /-----BEGIN\s+CERTIFICATE-----/i,
      /mysql:\/\/.+/i,
      /postgresql:\/\/.+/i,
      /mongodb:\/\/.+/i,
      /redis:\/\/.+/i
    ];

    for (const pattern of confidentialPatterns) {
      if (pattern.test(content)) {
        return ClipboardSecurityLevel.CONFIDENTIAL;
      }
    }

    // Check for sensitive patterns
    const sensitivePatterns = [
      /email\s*[:=]\s*[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i,
      /phone\s*[:=]\s*[\d\s\-\+\(\)]{10,}/i,
      /credit\s*card\s*[:=]\s*[\d\s-]{14,19}/i,
      /ssn\s*[:=]\s*\d{3}[-\s]?\d{2}[-\s]?\d{4}/i
    ];

    for (const pattern of sensitivePatterns) {
      if (pattern.test(content)) {
        return ClipboardSecurityLevel.SENSITIVE;
      }
    }

    return ClipboardSecurityLevel.PUBLIC;
  }

  /**
   * Validate content against security patterns
   */
  private validateContentPatterns(content: string): { errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check for executable code
    if (/<script[^>]*>.*?<\/script>/i.test(content)) {
      errors.push('Potential script injection detected');
    }

    // Check for SQL injection patterns
    const sqlPatterns = [
      /(\s|^)(DROP|DELETE|UPDATE|INSERT|ALTER)\s+(TABLE|DATABASE|FROM|INTO)/i,
      /(\s|^)(UNION\s+SELECT|SELECT\s+\*)/i,
      /(\s|^)(OR\s+1\s*=\s*1|AND\s+1\s*=\s*1)/i
    ];

    for (const pattern of sqlPatterns) {
      if (pattern.test(content)) {
        warnings.push('Potential SQL injection pattern detected');
      }
    }

    // Check for command injection
    const cmdPatterns = [
      /[;&|`$(){}[\]]/,
      /(\s|^)(rm\s+-rf|del\s+\/f|format\s+[a-z]:)/i
    ];

    for (const pattern of cmdPatterns) {
      if (pattern.test(content)) {
        warnings.push('Potential command injection pattern detected');
      }
    }

    // Check for phishing URLs
    const urlPatterns = [
      /https?:\/\/(?:bit\.ly|tinyurl\.com|goo\.gl|t\.co)\//i,
      /https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/i
    ];

    for (const pattern of urlPatterns) {
      if (pattern.test(content)) {
        warnings.push('Potential suspicious URL detected');
      }
    }

    return { errors, warnings };
  }

  /**
   * Apply custom validation rules
   */
  private applyCustomRules(content: string, rules: string[]): { errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    for (const rule of rules) {
      try {
        // Example rule formats:
        // "max_length:1000" - Maximum length
        // "required_fields:name,email" - Required fields
        // "allowed_types:text,plain" - Allowed content types
        // "blacklist:password,secret" - Blacklisted terms

        if (rule.startsWith('max_length:')) {
          const maxLength = parseInt(rule.split(':')[1]);
          if (content.length > maxLength) {
            errors.push(`Content exceeds maximum allowed length of ${maxLength} characters`);
          }
        } else if (rule.startsWith('required_fields:')) {
          const fields = rule.split(':')[1].split(',');
          for (const field of fields) {
            if (!content.toLowerCase().includes(field.toLowerCase())) {
              errors.push(`Required field '${field}' not found in content`);
            }
          }
        } else if (rule.startsWith('blacklist:')) {
          const terms = rule.split(':')[1].split(',');
          for (const term of terms) {
            if (content.toLowerCase().includes(term.toLowerCase())) {
              warnings.push(`Blacklisted term '${term}' found in content`);
            }
          }
        }
      } catch (error) {
        warnings.push(`Invalid validation rule: ${rule}`);
      }
    }

    return { errors, warnings };
  }

  /**
   * Sanitize clipboard content
   */
  private sanitizeContent(content: string): string {
    let sanitized = content;

    // Remove potentially dangerous HTML
    sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    // Remove HTML comments
    sanitized = sanitized.replace(/<!--[\s\S]*?-->/g, '');

    // Normalize whitespace
    sanitized = sanitized.replace(/\s+/g, ' ').trim();

    return sanitized;
  }

  /**
   * Validate clipboard operation authorization
   */
  validateAuthorization(
    operation: 'copy' | 'paste' | 'read',
    userPermissions: string[],
    securityLevel: ClipboardSecurityLevel
  ): boolean {
    // Define required permissions for each operation
    const requiredPermissions = {
      copy: ['clipboard:write'],
      paste: ['clipboard:read'],
      read: ['clipboard:read']
    };

    // Check basic permission
    if (!userPermissions.some(perm => requiredPermissions[operation].includes(perm))) {
      return false;
    }

    // Additional checks based on security level
    if (securityLevel === ClipboardSecurityLevel.CRITICAL) {
      return userPermissions.includes('clipboard:critical');
    }

    if (securityLevel === ClipboardSecurityLevel.CONFIDENTIAL) {
      return userPermissions.includes('clipboard:confidential');
    }

    return true;
  }

  /**
   * Validate clipboard content expiration
   */
  validateExpiration(expiresAt: number): boolean {
    return Date.now() < expiresAt;
  }

  /**
   * Calculate content risk score
   */
  calculateRiskScore(content: string): number {
    let score = 0;
    const securityLevel = this.detectSecurityLevel(content);

    // Base score from security level
    switch (securityLevel) {
      case ClipboardSecurityLevel.CRITICAL:
        score += 100;
        break;
      case ClipboardSecurityLevel.CONFIDENTIAL:
        score += 70;
        break;
      case ClipboardSecurityLevel.SENSITIVE:
        score += 40;
        break;
      default:
        score += 0;
    }

    // Length penalty
    if (content.length > 1000) score += 10;
    if (content.length > 5000) score += 20;

    // Pattern penalties
    if (/[0-9]{10,}/.test(content)) score += 15; // Long numbers
    if (/[A-Z0-9]{20,}/.test(content)) score += 25; // Long alphanumeric strings

    return Math.min(score, 100); // Cap at 100
  }
}

// Export singleton instance
export const clipboardValidator = new ClipboardValidator();