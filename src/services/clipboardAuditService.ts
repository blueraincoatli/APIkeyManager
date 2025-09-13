/**
 * Clipboard audit logging service for security monitoring
 */

import {
  ClipboardAuditLog,
  ClipboardOperation,
  ClipboardSecurityLevel,
  ClipboardAuthorizationContext
} from '../types/clipboardSecurity';

export class ClipboardAuditService {
  private logs: ClipboardAuditLog[] = [];
  private maxLogEntries: number = 1000;
  private storageKey: string = 'clipboard_audit_logs';

  constructor() {
    this.loadLogs();
  }

  /**
   * Log a clipboard operation
   */
  async logOperation(
    operation: ClipboardOperation,
    success: boolean,
    securityLevel: ClipboardSecurityLevel,
    authorization?: ClipboardAuthorizationContext,
    metadata?: {
      contentLength?: number;
      contentType?: string;
      errors?: string[];
      source?: string;
      duration?: number;
      [key: string]: unknown;
    }
  ): Promise<void> {
    const logEntry: ClipboardAuditLog = {
      id: this.generateLogId(),
      operation,
      timestamp: Date.now(),
      userId: authorization?.userId,
      sessionId: authorization?.sessionId,
      source: metadata?.source || 'unknown',
      success,
      securityLevel,
      contentLength: metadata?.contentLength,
      contentType: metadata?.contentType,
      errors: metadata?.errors,
      metadata: {
        ipAddress: authorization?.ipAddress,
        userAgent: authorization?.userAgent,
        duration: metadata?.duration,
        ...metadata
      }
    };

    this.logs.push(logEntry);

    // Maintain log size limit
    if (this.logs.length > this.maxLogEntries) {
      this.logs = this.logs.slice(-this.maxLogEntries);
    }

    // Persist logs
    this.saveLogs();

    // Log to console for development (only non-sensitive data)
    if (import.meta.env.DEV) {
      console.log(`[Clipboard Audit] ${operation}: ${success ? 'SUCCESS' : 'FAILED'}`, {
        id: logEntry.id,
        securityLevel,
        timestamp: new Date(logEntry.timestamp).toISOString(),
        contentLength: logEntry.contentLength,
        userId: logEntry.userId ? '[REDACTED]' : undefined
      });
    }

    // Send to monitoring service if configured
    if (success && this.shouldSendToMonitoring(logEntry)) {
      await this.sendToMonitoring(logEntry);
    }
  }

  /**
   * Get audit logs with filtering options
   */
  getLogs(filters?: {
    operation?: ClipboardOperation;
    success?: boolean;
    securityLevel?: ClipboardSecurityLevel;
    userId?: string;
    startDate?: number;
    endDate?: number;
    limit?: number;
  }): ClipboardAuditLog[] {
    let filteredLogs = [...this.logs];

    if (filters) {
      if (filters.operation) {
        filteredLogs = filteredLogs.filter(log => log.operation === filters.operation);
      }
      if (filters.success !== undefined) {
        filteredLogs = filteredLogs.filter(log => log.success === filters.success);
      }
      if (filters.securityLevel) {
        filteredLogs = filteredLogs.filter(log => log.securityLevel === filters.securityLevel);
      }
      if (filters.userId) {
        filteredLogs = filteredLogs.filter(log => log.userId === filters.userId);
      }
      if (filters.startDate) {
        filteredLogs = filteredLogs.filter(log => log.timestamp >= filters.startDate!);
      }
      if (filters.endDate) {
        filteredLogs = filteredLogs.filter(log => log.timestamp <= filters.endDate!);
      }
    }

    // Sort by timestamp (newest first)
    filteredLogs.sort((a, b) => b.timestamp - a.timestamp);

    // Apply limit
    if (filters?.limit) {
      filteredLogs = filteredLogs.slice(0, filters.limit);
    }

    return filteredLogs;
  }

  /**
   * Get security statistics
   */
  getSecurityStats(timeRange?: { start: number; end: number }): {
    totalOperations: number;
    successRate: number;
    operationsByType: Record<ClipboardOperation, number>;
    securityLevelDistribution: Record<ClipboardSecurityLevel, number>;
    errorRate: number;
    averageResponseTime: number;
    suspiciousActivities: ClipboardAuditLog[];
  } {
    let logs = this.logs;

    if (timeRange) {
      logs = logs.filter(log =>
        log.timestamp >= timeRange.start && log.timestamp <= timeRange.end
      );
    }

    const totalOperations = logs.length;
    const successfulOperations = logs.filter(log => log.success).length;
    const successRate = totalOperations > 0 ? (successfulOperations / totalOperations) * 100 : 0;

    // Operations by type
    const operationsByType = Object.values(ClipboardOperation).reduce((acc, op) => {
      acc[op] = logs.filter(log => log.operation === op).length;
      return acc;
    }, {} as Record<ClipboardOperation, number>);

    // Security level distribution
    const securityLevelDistribution = Object.values(ClipboardSecurityLevel).reduce((acc, level) => {
      acc[level] = logs.filter(log => log.securityLevel === level).length;
      return acc;
    }, {} as Record<ClipboardSecurityLevel, number>);

    // Error rate
    const errorRate = totalOperations > 0 ?
      ((totalOperations - successfulOperations) / totalOperations) * 100 : 0;

    // Average response time
    const responseTimes = logs
      .filter(log => log.metadata?.duration !== undefined)
      .map(log => log.metadata?.duration as number);
    const averageResponseTime = responseTimes.length > 0 ?
      responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length : 0;

    // Detect suspicious activities
    const suspiciousActivities = this.detectSuspiciousActivities(logs);

    return {
      totalOperations,
      successRate,
      operationsByType,
      securityLevelDistribution,
      errorRate,
      averageResponseTime,
      suspiciousActivities
    };
  }

  /**
   * Detect suspicious activities from audit logs
   */
  private detectSuspiciousActivities(logs: ClipboardAuditLog[]): ClipboardAuditLog[] {
    const suspicious: ClipboardAuditLog[] = [];

    // Failed operations in quick succession
    const recentFailures = logs
      .filter(log => !log.success && Date.now() - log.timestamp < 60000); // Last minute
    if (recentFailures.length > 5) {
      suspicious.push(...recentFailures.slice(-5));
    }

    // High frequency operations
    const minuteAgo = Date.now() - 60000;
    const recentOperations = logs.filter(log => log.timestamp > minuteAgo);
    if (recentOperations.length > 50) {
      suspicious.push(...recentOperations.slice(-10));
    }

    // Operations with critical security level from unknown sources
    const criticalOps = logs.filter(log =>
      log.securityLevel === ClipboardSecurityLevel.CRITICAL &&
      log.source === 'unknown'
    );
    suspicious.push(...criticalOps);

    return suspicious;
  }

  /**
   * Export audit logs for analysis
   */
  exportLogs(format: 'json' | 'csv' = 'json'): string {
    if (format === 'json') {
      return JSON.stringify(this.logs, null, 2);
    }

    // CSV format
    const headers = [
      'ID', 'Operation', 'Timestamp', 'Success', 'Security Level',
      'User ID', 'Session ID', 'Source', 'Content Length', 'Content Type',
      'Errors'
    ];

    const rows = this.logs.map(log => [
      log.id,
      log.operation,
      new Date(log.timestamp).toISOString(),
      log.success.toString(),
      log.securityLevel,
      log.userId || '',
      log.sessionId || '',
      log.source,
      log.contentLength?.toString() || '',
      log.contentType || '',
      log.errors?.join(';') || ''
    ]);

    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }

  /**
   * Clear old audit logs
   */
  clearOldLogs(olderThanDays: number = 30): void {
    const cutoffTime = Date.now() - (olderThanDays * 24 * 60 * 60 * 1000);
    this.logs = this.logs.filter(log => log.timestamp > cutoffTime);
    this.saveLogs();
  }

  /**
   * Load logs from persistent storage
   */
  private loadLogs(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.logs = Array.isArray(parsed) ? parsed : [];
      }
    } catch (error) {
      console.error('Failed to load audit logs:', error);
      this.logs = [];
    }
  }

  /**
   * Save logs to persistent storage
   */
  private saveLogs(): void {
    try {
      // Only store last 1000 logs to prevent storage issues
      const logsToSave = this.logs.slice(-1000);
      localStorage.setItem(this.storageKey, JSON.stringify(logsToSave));
    } catch (error) {
      console.error('Failed to save audit logs:', error);
    }
  }

  /**
   * Generate unique log ID
   */
  private generateLogId(): string {
    return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Determine if log should be sent to monitoring service
   */
  private shouldSendToMonitoring(log: ClipboardAuditLog): boolean {
    // Send critical operations and failures
    return (
      log.securityLevel === ClipboardSecurityLevel.CRITICAL ||
      log.success === false ||
      (log.errors && log.errors.length > 0)
    );
  }

  /**
   * Send log to monitoring service
   */
  private async sendToMonitoring(log: ClipboardAuditLog): Promise<void> {
    // In a real implementation, this would send to a monitoring service
    // For now, we'll just log it
    if (import.meta.env.DEV) {
      console.log('[Monitoring] Clipboard operation:', {
        operation: log.operation,
        success: log.success,
        securityLevel: log.securityLevel,
        timestamp: new Date(log.timestamp).toISOString()
      });
    }
  }

  /**
   * Get real-time clipboard activity metrics
   */
  getActivityMetrics(timeWindow: number = 60000): {
    operationsPerMinute: number;
    errorRate: number;
    mostActiveUser?: string;
    topOperationTypes: Array<{ operation: ClipboardOperation; count: number }>;
  } {
    const now = Date.now();
    const recentLogs = this.logs.filter(log => now - log.timestamp <= timeWindow);

    const operationsPerMinute = (recentLogs.length / timeWindow) * 60000;
    const errors = recentLogs.filter(log => !log.success);
    const errorRate = recentLogs.length > 0 ? (errors.length / recentLogs.length) * 100 : 0;

    // Most active user
    const userActivity = recentLogs.reduce((acc, log) => {
      if (log.userId) {
        acc[log.userId] = (acc[log.userId] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const mostActiveUser = Object.entries(userActivity)
      .sort(([, a], [, b]) => b - a)[0]?.[0];

    // Top operation types
    const operationCounts = recentLogs.reduce((acc, log) => {
      acc[log.operation] = (acc[log.operation] || 0) + 1;
      return acc;
    }, {} as Record<ClipboardOperation, number>);

    const topOperationTypes = Object.entries(operationCounts)
      .map(([operation, count]) => ({ operation: operation as ClipboardOperation, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      operationsPerMinute,
      errorRate,
      mostActiveUser,
      topOperationTypes
    };
  }
}

// Export singleton instance
export const clipboardAuditService = new ClipboardAuditService();