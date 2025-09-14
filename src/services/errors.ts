/**
 * 统一错误处理和响应格式
 * 提供标准化的错误类型、代码和响应格式
 */

// 错误代码枚举
export enum ErrorCode {
  // 通用错误 (1000-1999)
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',

  // 网络错误 (2000-2999)
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  CONNECTION_ERROR = 'CONNECTION_ERROR',

  // API密钥服务错误 (3000-3999)
  API_KEY_NOT_FOUND = 'API_KEY_NOT_FOUND',
  API_KEY_EXISTS = 'API_KEY_EXISTS',
  API_KEY_INVALID = 'API_KEY_INVALID',
  API_KEY_ENCRYPTION_FAILED = 'API_KEY_ENCRYPTION_FAILED',
  API_KEY_DECRYPTION_FAILED = 'API_KEY_DECRYPTION_FAILED',

  // 安全服务错误 (4000-4999)
  SECURITY_ERROR = 'SECURITY_ERROR',
  ENCRYPTION_ERROR = 'ENCRYPTION_ERROR',
  DECRYPTION_ERROR = 'DECRYPTION_ERROR',
  MASTER_PASSWORD_INVALID = 'MASTER_PASSWORD_INVALID',
  MASTER_PASSWORD_NOT_SET = 'MASTER_PASSWORD_NOT_SET',

  // 剪贴板服务错误 (5000-5999)
  CLIPBOARD_ERROR = 'CLIPBOARD_ERROR',
  CLIPBOARD_PERMISSION_DENIED = 'CLIPBOARD_PERMISSION_DENIED',
  CLIPBOARD_CONTENT_TOO_LARGE = 'CLIPBOARD_CONTENT_TOO_LARGE',

  // 搜索服务错误 (6000-6999)
  SEARCH_ERROR = 'SEARCH_ERROR',
  SEARCH_INVALID_QUERY = 'SEARCH_INVALID_QUERY',

  // 数据库错误 (7000-7999)
  DATABASE_ERROR = 'DATABASE_ERROR',
  DATABASE_CONNECTION_FAILED = 'DATABASE_CONNECTION_FAILED',
  DATABASE_QUERY_FAILED = 'DATABASE_QUERY_FAILED'
}

// 服务结果接口
export interface ServiceResult<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: ErrorCode;
    message: string;
    details?: Record<string, unknown>;
  };
  metadata?: {
    timestamp: string;
    requestId?: string;
    version: string;
  };
}

// 分页结果接口
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// 自定义错误类型
export class ApiKeyServiceError extends Error {
  constructor(
    message: string,
    public code: ErrorCode = ErrorCode.UNKNOWN_ERROR,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiKeyServiceError';
  }
}

export class NetworkError extends ApiKeyServiceError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, ErrorCode.NETWORK_ERROR, details);
    this.name = 'NetworkError';
  }
}

export class ValidationError extends ApiKeyServiceError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, ErrorCode.VALIDATION_FAILED, details);
    this.name = 'ValidationError';
  }
}

export class SecurityError extends ApiKeyServiceError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, ErrorCode.SECURITY_ERROR, details);
    this.name = 'SecurityError';
  }
}

export class DatabaseError extends ApiKeyServiceError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, ErrorCode.DATABASE_ERROR, details);
    this.name = 'DatabaseError';
  }
}

// 成功结果创建函数
export function createSuccessResult<T>(
  data: T,
  metadata?: ServiceResult<T>['metadata']
): ServiceResult<T> {
  return {
    success: true,
    data,
    metadata: {
      timestamp: new Date().toISOString(),
      version: '1.0',
      ...metadata
    }
  };
}

// 错误结果创建函数
export function createErrorResult<T = never>(
  code: ErrorCode,
  message: string,
  details?: Record<string, unknown>,
  metadata?: ServiceResult<T>['metadata']
): ServiceResult<T> {
  return {
    success: false,
    error: {
      code,
      message,
      details
    },
    metadata: {
      timestamp: new Date().toISOString(),
      version: '1.0',
      ...metadata
    }
  };
}

// 异常转换为结果
export function errorToResult<T = never>(
  error: unknown,
  defaultCode: ErrorCode = ErrorCode.UNKNOWN_ERROR
): ServiceResult<T> {
  if (error instanceof ApiKeyServiceError) {
    return createErrorResult(error.code, error.message, error.details);
  }

  if (error instanceof Error) {
    return createErrorResult(defaultCode, error.message, {
      stack: error.stack,
      name: error.name
    });
  }

  return createErrorResult(defaultCode, String(error));
}

// 异步错误处理包装器
export async function wrapServiceOperation<T>(
  operation: () => Promise<T>,
  errorCode: ErrorCode = ErrorCode.UNKNOWN_ERROR
): Promise<ServiceResult<T>> {
  try {
    const result = await operation();
    return createSuccessResult(result);
  } catch (error) {
    return errorToResult<T>(error, errorCode);
  }
}

// 同步错误处理包装器
export function wrapSyncServiceOperation<T>(
  operation: () => T,
  errorCode: ErrorCode = ErrorCode.UNKNOWN_ERROR
): ServiceResult<T> {
  try {
    const result = operation();
    return createSuccessResult(result);
  } catch (error) {
    return errorToResult<T>(error, errorCode);
  }
}