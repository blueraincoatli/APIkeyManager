/**
 * Clipboard security configuration management service
 */

import {
  ClipboardSecurityConfig,
  DEFAULT_CLIPBOARD_SECURITY_CONFIG
} from '../types/clipboardSecurity';

export class ClipboardSecurityConfigManager {
  private static instance: ClipboardSecurityConfigManager;
  private config: ClipboardSecurityConfig;
  private readonly storageKey = 'clipboard_security_config';

  private constructor() {
    this.config = this.loadConfig();
  }

  static getInstance(): ClipboardSecurityConfigManager {
    if (!ClipboardSecurityConfigManager.instance) {
      ClipboardSecurityConfigManager.instance = new ClipboardSecurityConfigManager();
    }
    return ClipboardSecurityConfigManager.instance;
  }

  /**
   * Get current security configuration
   */
  getConfig(): ClipboardSecurityConfig {
    return { ...this.config };
  }

  /**
   * Update security configuration
   */
  updateConfig(updates: Partial<ClipboardSecurityConfig>): void {
    this.config = { ...this.config, ...updates };
    this.saveConfig();
    this.applyConfig();
  }

  /**
   * Reset to default configuration
   */
  resetToDefaults(): void {
    this.config = { ...DEFAULT_CLIPBOARD_SECURITY_CONFIG };
    this.saveConfig();
    this.applyConfig();
  }

  /**
   * Load configuration from persistent storage
   */
  private loadConfig(): ClipboardSecurityConfig {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Validate configuration structure
        return this.validateConfig(parsed);
      }
    } catch (error) {
      console.error('Failed to load clipboard security config:', error);
    }

    return { ...DEFAULT_CLIPBOARD_SECURITY_CONFIG };
  }

  /**
   * Save configuration to persistent storage
   */
  private saveConfig(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.config));
    } catch (error) {
      console.error('Failed to save clipboard security config:', error);
    }
  }

  /**
   * Apply configuration to clipboard service
   */
  private applyConfig(): void {
    // This will be called when the config changes
    // The clipboard service should listen for config changes
    window.dispatchEvent(new CustomEvent('clipboardSecurityConfigChanged', {
      detail: this.config
    }));
  }

  /**
   * Validate configuration structure
   */
  private validateConfig(config: any): ClipboardSecurityConfig {
    const validated = { ...DEFAULT_CLIPBOARD_SECURITY_CONFIG };

    // Validate each property
    if (typeof config.clearTimeoutMs === 'number' && config.clearTimeoutMs > 0) {
      validated.clearTimeoutMs = Math.min(config.clearTimeoutMs, 300000); // Max 5 minutes
    }

    if (typeof config.maxContentLength === 'number' && config.maxContentLength > 0) {
      validated.maxContentLength = Math.min(config.maxContentLength, 100000); // Max 100KB
    }

    if (typeof config.enableEncryption === 'boolean') {
      validated.enableEncryption = config.enableEncryption;
    }

    if (typeof config.enableAuditLogging === 'boolean') {
      validated.enableAuditLogging = config.enableAuditLogging;
    }

    if (typeof config.enablePasteValidation === 'boolean') {
      validated.enablePasteValidation = config.enablePasteValidation;
    }

    if (typeof config.requireAuthorization === 'boolean') {
      validated.requireAuthorization = config.requireAuthorization;
    }

    if (typeof config.defaultExpirationMs === 'number' && config.defaultExpirationMs > 0) {
      validated.defaultExpirationMs = Math.min(config.defaultExpirationMs, 600000); // Max 10 minutes
    }

    return validated;
  }

  /**
   * Get security presets
   */
  getSecurityPresets(): Record<string, Partial<ClipboardSecurityConfig>> {
    return {
      high_security: {
        clearTimeoutMs: 10000, // 10 seconds
        enableEncryption: true,
        enableAuditLogging: true,
        enablePasteValidation: true,
        requireAuthorization: true,
        defaultExpirationMs: 30000 // 30 seconds
      },
      balanced: {
        clearTimeoutMs: 30000, // 30 seconds
        enableEncryption: true,
        enableAuditLogging: true,
        enablePasteValidation: true,
        requireAuthorization: true,
        defaultExpirationMs: 60000 // 1 minute
      },
      convenience: {
        clearTimeoutMs: 60000, // 1 minute
        enableEncryption: false,
        enableAuditLogging: true,
        enablePasteValidation: false,
        requireAuthorization: false,
        defaultExpirationMs: 120000 // 2 minutes
      },
      custom: {}
    };
  }

  /**
   * Apply security preset
   */
  applySecurityPreset(presetName: string): boolean {
    const presets = this.getSecurityPresets();
    const preset = presets[presetName];

    if (preset && presetName !== 'custom') {
      this.updateConfig(preset);
      return true;
    }

    return false;
  }

  /**
   * Export configuration
   */
  exportConfig(): string {
    return JSON.stringify(this.config, null, 2);
  }

  /**
   * Import configuration
   */
  importConfig(configJson: string): boolean {
    try {
      const imported = JSON.parse(configJson);
      const validated = this.validateConfig(imported);
      this.config = validated;
      this.saveConfig();
      this.applyConfig();
      return true;
    } catch (error) {
      console.error('Failed to import clipboard security config:', error);
      return false;
    }
  }

  /**
   * Get security recommendations based on current config
   */
  getSecurityRecommendations(): Array<{
    level: 'warning' | 'info' | 'critical';
    message: string;
    setting: keyof ClipboardSecurityConfig;
    recommendedValue: any;
  }> {
    const recommendations: Array<{
      level: 'warning' | 'info' | 'critical';
      message: string;
      setting: keyof ClipboardSecurityConfig;
      recommendedValue: any;
    }> = [];

    // Check timeout settings
    if (this.config.clearTimeoutMs > 60000) {
      recommendations.push({
        level: 'warning',
        message: 'Clipboard content remains for more than 1 minute. Consider reducing for better security.',
        setting: 'clearTimeoutMs',
        recommendedValue: 30000
      });
    }

    // Check encryption
    if (!this.config.enableEncryption) {
      recommendations.push({
        level: 'critical',
        message: 'Encryption is disabled. Sensitive clipboard content may be exposed.',
        setting: 'enableEncryption',
        recommendedValue: true
      });
    }

    // Check authorization
    if (!this.config.requireAuthorization) {
      recommendations.push({
        level: 'warning',
        message: 'Authorization checks are disabled. Consider enabling for better access control.',
        setting: 'requireAuthorization',
        recommendedValue: true
      });
    }

    // Check content length
    if (this.config.maxContentLength > 50000) {
      recommendations.push({
        level: 'info',
        message: 'Large content size allowed. Consider limiting to prevent excessive memory usage.',
        setting: 'maxContentLength',
        recommendedValue: 10000
      });
    }

    return recommendations;
  }

  /**
   * Calculate security score based on current configuration
   */
  calculateSecurityScore(): number {
    let score = 0;

    // Encryption enabled
    if (this.config.enableEncryption) score += 30;

    // Authorization required
    if (this.config.requireAuthorization) score += 20;

    // Audit logging enabled
    if (this.config.enableAuditLogging) score += 15;

    // Paste validation enabled
    if (this.config.enablePasteValidation) score += 15;

    // Timeout settings
    if (this.config.clearTimeoutMs <= 30000) score += 10;
    else if (this.config.clearTimeoutMs <= 60000) score += 5;

    // Content length limit
    if (this.config.maxContentLength <= 10000) score += 10;

    return Math.min(score, 100);
  }
}

// Export singleton instance
export const clipboardSecurityConfig = ClipboardSecurityConfigManager.getInstance();