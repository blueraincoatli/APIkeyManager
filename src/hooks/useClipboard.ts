import { useState, useEffect, useCallback } from 'react';
import { clipboardService } from '../services/clipboardService';
import { clipboardAuditService } from '../services/clipboardAuditService';
import {
  ClipboardSecurityLevel,
  ClipboardAuthorizationContext,
  ClipboardContentMetadata,
  ClipboardAuditLog
} from '../types/clipboardSecurity';
import { SECURITY_CONSTANTS, UI_CONSTANTS } from '../constants';

// Audit log filters interface
interface AuditLogFilters {
  operation?: string;
  success?: boolean;
  securityLevel?: ClipboardSecurityLevel;
  userId?: string;
  startDate?: number;
  endDate?: number;
  limit?: number;
}

// Security stats interface
interface SecurityStats {
  totalOperations: number;
  successRate: number;
  securityViolations: number;
  averageResponseTime: number;
  topOperations: Array<{
    operation: string;
    count: number;
  }>;
}

interface UseClipboardOptions {
  securityLevel?: ClipboardSecurityLevel;
  timeout?: number;
  enableAuditLogging?: boolean;
  authorization?: ClipboardAuthorizationContext;
  validationRules?: string[];
}

interface UseClipboardReturn {
  // Copy operations
  copyToClipboard: (text: string, options?: UseClipboardOptions) => Promise<{
    success: boolean;
    metadataId?: string;
    error?: string;
  }>;

  // Paste operations
  getClipboardContent: (metadataId?: string) => Promise<string>;

  // Clipboard management
  clearClipboard: (metadataId?: string) => Promise<boolean>;
  extendExpiration: (metadataId: string, additionalMs: number) => Promise<boolean>;

  // State
  isCopying: boolean;
  isPasting: boolean;
  copyError: string | null;
  pasteError: string | null;
  lastCopiedMetadata: ClipboardContentMetadata | null;

  // Active operations
  activeOperations: Array<{
    metadataId: string;
    expiresAt: number;
    securityLevel: ClipboardSecurityLevel;
  }>;

  // Security info
  isClipboardValid: (metadataId: string) => boolean;
  getClipboardMetadata: (metadataId: string) => ClipboardContentMetadata | undefined;
}

/**
 * Enhanced clipboard hook with security features
 */
export const useClipboard = (defaultOptions: UseClipboardOptions = {}): UseClipboardReturn => {
  const [isCopying, setIsCopying] = useState(false);
  const [isPasting, setIsPasting] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);
  const [pasteError, setPasteError] = useState<string | null>(null);
  const [lastCopiedMetadata, setLastCopiedMetadata] = useState<ClipboardContentMetadata | null>(null);
  const [activeOperations, setActiveOperations] = useState<Array<{
    metadataId: string;
    expiresAt: number;
    securityLevel: ClipboardSecurityLevel;
  }>>([]);

  // Update active operations periodically
  useEffect(() => {
    const updateActiveOperations = () => {
      const ops = clipboardService.getActiveOperations();
      setActiveOperations(ops);
    };

    updateActiveOperations();
    const interval = setInterval(updateActiveOperations, UI_CONSTANTS.INTERVALS.SECOND);

    return () => clearInterval(interval);
  }, []);

  // Copy text to clipboard with security features
  const copyToClipboard = useCallback(async (
    text: string,
    options: UseClipboardOptions = {}
  ) => {
    const mergedOptions = { ...defaultOptions, ...options };
    setIsCopying(true);
    setCopyError(null);

    try {
      const result = await clipboardService.copyToClipboard(
        text,
        mergedOptions.securityLevel || ClipboardSecurityLevel.SENSITIVE,
        mergedOptions.authorization,
        {
          timeout: mergedOptions.timeout,
          validationRules: mergedOptions.validationRules
        }
      );

      if (result.success && result.metadataId) {
        const metadata = clipboardService.getClipboardMetadata(result.metadataId);
        if (metadata) {
          setLastCopiedMetadata(metadata);
        }
      } else if (result.error) {
        setCopyError(result.error);
      }

      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '复制过程中发生错误';
      setCopyError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsCopying(false);
    }
  }, [defaultOptions]);

  // Get clipboard content securely
  const getClipboardContent = useCallback(async (metadataId?: string) => {
    setIsPasting(true);
    setPasteError(null);

    try {
      const content = await clipboardService.getClipboardContent(
        defaultOptions.authorization,
        metadataId
      );

      if (!content && metadataId) {
        setPasteError('无法获取剪贴板内容');
      }

      return content;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '粘贴过程中发生错误';
      setPasteError(errorMsg);
      return '';
    } finally {
      setIsPasting(false);
    }
  }, [defaultOptions.authorization]);

  // Clear clipboard content
  const clearClipboard = useCallback(async (metadataId?: string) => {
    try {
      return await clipboardService.clearClipboard(metadataId);
    } catch (err) {
      console.error('Failed to clear clipboard:', err);
      return false;
    }
  }, []);

  // Extend clipboard expiration
  const extendExpiration = useCallback(async (metadataId: string, additionalMs: number) => {
    try {
      return await clipboardService.extendExpiration(metadataId, additionalMs);
    } catch (err) {
      console.error('Failed to extend expiration:', err);
      return false;
    }
  }, []);

  // Check if clipboard is valid
  const isClipboardValid = useCallback((metadataId: string) => {
    return clipboardService.isClipboardValid(metadataId);
  }, []);

  // Get clipboard metadata
  const getClipboardMetadata = useCallback((metadataId: string) => {
    return clipboardService.getClipboardMetadata(metadataId);
  }, []);

  return {
    // Copy operations
    copyToClipboard,

    // Paste operations
    getClipboardContent,

    // Clipboard management
    clearClipboard,
    extendExpiration,

    // State
    isCopying,
    isPasting,
    copyError,
    pasteError,
    lastCopiedMetadata,

    // Active operations
    activeOperations,

    // Security info
    isClipboardValid,
    getClipboardMetadata
  };
};

/**
 * Hook for clipboard audit logs
 */
export const useClipboardAudit = () => {
  const [logs, setLogs] = useState<ClipboardAuditLog[]>([]);
  const [stats, setStats] = useState<SecurityStats | null>(null);

  const refreshLogs = useCallback((filters?: AuditLogFilters) => {
    const auditLogs = clipboardAuditService.getLogs(filters);
    setLogs(auditLogs);
  }, []);

  const refreshStats = useCallback((timeRange?: { start: number; end: number }) => {
    const newStats = clipboardAuditService.getSecurityStats(timeRange);
    setStats(newStats);
  }, []);

  const exportLogs = useCallback((format: 'json' | 'csv' = 'json') => {
    return clipboardAuditService.exportLogs(format);
  }, []);

  const clearOldLogs = useCallback((olderThanDays: number = UI_CONSTANTS.INTERVALS.AUDIT_CLEANUP_DAYS) => {
    clipboardAuditService.clearOldLogs(olderThanDays);
    refreshLogs();
  }, [refreshLogs]);

  useEffect(() => {
    refreshLogs();
    refreshStats();
  }, [refreshLogs, refreshStats]);

  return {
    logs,
    stats,
    refreshLogs,
    refreshStats,
    exportLogs,
    clearOldLogs
  };
};

/**
 * Hook for clipboard security monitoring
 */
export const useClipboardSecurity = () => {
  const [riskScore, setRiskScore] = useState(0);
  const [suspiciousActivities, setSuspiciousActivities] = useState<ClipboardAuditLog[]>([]);

  // Activity metrics interface
  interface ActivityMetrics {
    totalOperations: number;
    successRate: number;
    errorRate: number;
    operationsPerMinute: number;
  }

  const [metrics, setMetrics] = useState<ActivityMetrics | null>(null);

  const refreshSecurityInfo = useCallback(() => {
    // Get activity metrics
    const activityMetrics = clipboardAuditService.getActivityMetrics();
    setMetrics(activityMetrics);

    // Get suspicious activities
    const stats = clipboardAuditService.getSecurityStats();
    setSuspiciousActivities(stats.suspiciousActivities || []);

    // Calculate risk score based on activity
    let score = 0;
    if (activityMetrics.errorRate > 10) score += 20;
    if (activityMetrics.operationsPerMinute > 100) score += 30;
    if (stats.errorRate > 5) score += 15;
    if (suspiciousActivities.length > 0) score += 35;

    setRiskScore(Math.min(score, 100));
  }, []);

  useEffect(() => {
    refreshSecurityInfo();
    const interval = setInterval(refreshSecurityInfo, UI_CONSTANTS.INTERVALS.SECURITY_CHECK); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [refreshSecurityInfo]);

  return {
    riskScore,
    suspiciousActivities,
    metrics,
    refreshSecurityInfo
  };
};