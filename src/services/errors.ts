// 自定义错误类型
export class ApiKeyServiceError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'ApiKeyServiceError';
  }
}

export class NetworkError extends ApiKeyServiceError {
  constructor(message: string) {
    super(message, 'NETWORK_ERROR');
    this.name = 'NetworkError';
  }
}

export class ValidationError extends ApiKeyServiceError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}