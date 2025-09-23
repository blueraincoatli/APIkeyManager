/**
 * 安全日志服务
 * 防止敏感数据泄露到控制台日志
 */

// 错误类型枚举
export enum ErrorType {
  SECURITY_ERROR = "SecurityError",
  VALIDATION_ERROR = "ValidationError",
  NETWORK_ERROR = "NetworkError",
  ENCRYPTION_ERROR = "EncryptionError",
  DATABASE_ERROR = "DatabaseError",
  UNKNOWN_ERROR = "UnknownError",
}

// 操作上下文枚举
export enum OperationContext {
  MASTER_PASSWORD_SET = "master_password_set",
  MASTER_PASSWORD_VERIFY = "master_password_verify",
  KEY_ENCRYPTION = "key_encryption",
  KEY_DECRYPTION = "key_decryption",
  API_KEY_ADD = "api_key_add",
  API_KEY_EDIT = "api_key_edit",
  API_KEY_DELETE = "api_key_delete",
  API_KEY_SEARCH = "api_key_search",
  API_KEY_COPY = "api_key_copy",
  GROUP_ADD = "group_add",
  USAGE_RECORD = "usage_record",
  CLIPBOARD_ANALYZE = "clipboard_analyze",
  OLLAMA_CHECK = "ollama_check",
  THEME_ANALYSIS = "theme_analysis",
}

/**
 * 安全的错误日志记录
 * 不记录敏感数据，只记录错误类型和上下文
 */
export function logSecureError(
  context: OperationContext,
  error: any,
  additionalInfo?: Record<string, string>,
): void {
  // 只记录错误类型，不记录具体的错误内容
  const errorType = error?.name || ErrorType.UNKNOWN_ERROR;
  const errorMessage = error?.message ? "Message available" : "No message";

  console.error(`[${context}] Operation failed: ${errorType}`, {
    type: errorType,
    hasMessage: errorMessage,
    timestamp: new Date().toISOString(),
    ...(additionalInfo || {}),
  });

  // 这里可以扩展为发送到错误监控系统
  // reportToMonitoringSystem(context, errorType, additionalInfo);
}

/**
 * 安全的信息日志记录
 */
export function logSecureInfo(
  context: OperationContext,
  message: string,
  data?: Record<string, string>,
): void {
  console.info(`[${context}] ${message}`, {
    timestamp: new Date().toISOString(),
    ...(data || {}),
  });
}

/**
 * 安全的警告日志记录
 */
export function logSecureWarning(
  context: OperationContext,
  message: string,
  data?: Record<string, string>,
): void {
  console.warn(`[${context}] ${message}`, {
    timestamp: new Date().toISOString(),
    ...(data || {}),
  });
}

/**
 * 获取用户友好的错误消息
 * 不暴露内部实现细节
 */
export function getUserFriendlyErrorMessage(context: OperationContext): string {
  const errorMessages: Record<OperationContext, string> = {
    [OperationContext.MASTER_PASSWORD_SET]: "设置主密码失败，请稍后重试",
    [OperationContext.MASTER_PASSWORD_VERIFY]:
      "密码验证失败，请检查密码是否正确",
    [OperationContext.KEY_ENCRYPTION]: "加密操作失败，请稍后重试",
    [OperationContext.KEY_DECRYPTION]: "解密操作失败，请检查主密码",
    [OperationContext.API_KEY_ADD]: "添加API Key失败，请检查输入信息",
    [OperationContext.API_KEY_EDIT]: "编辑API Key失败，请稍后重试",
    [OperationContext.API_KEY_DELETE]: "删除API Key失败，请稍后重试",
    [OperationContext.API_KEY_SEARCH]: "搜索失败，请稍后重试",
    [OperationContext.API_KEY_COPY]: "复制失败，请稍后重试",
    [OperationContext.GROUP_ADD]: "添加分组失败，请稍后重试",
    [OperationContext.USAGE_RECORD]: "记录使用历史失败",
    [OperationContext.CLIPBOARD_ANALYZE]: "分析剪贴板内容失败",
    [OperationContext.OLLAMA_CHECK]: "检查服务状态失败",
    [OperationContext.THEME_ANALYSIS]: "主题分析失败，将使用默认主题",
  };

  return errorMessages[context] || "操作失败，请稍后重试";
}
