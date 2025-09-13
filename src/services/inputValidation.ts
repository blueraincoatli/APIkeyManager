/**
 * 增强的输入验证和清理服务
 * 防止XSS、注入攻击和其他安全漏洞
 */

// API密钥输入接口
export interface ApiKeyInput {
  name?: string;
  description?: string;
  platform?: string;
  keyValue?: string;
  groupId?: string;
}

// 分组输入接口
export interface GroupInput {
  name?: string;
  description?: string;
}

// 验证结果接口
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitized?: any;
}

// 危险字符模式
const DANGEROUS_PATTERNS = {
  XSS: /<script|javascript:|data:|vbscript:|on\w+\s*=/i,
  SQL_INJECTION: /(\b(select|insert|update|delete|drop|union|exec)\b)|(\b(or|and)\s+\d+\s*=\s*\d+)/i,
  COMMAND_INJECTION: /[;&|`$(){}[\]]/i,
  PATH_TRAVERSAL: /\.\.[/\\]/i
};

// API密钥格式模式
const API_KEY_PATTERNS = {
  // 常见API密钥格式（可根据需要扩展）
  ALPHANUMERIC: /^[a-zA-Z0-9\-_\.=+\/]+$/,
  HEX_KEY: /^[a-fA-F0-9\-]+$/,
  BASE64: /^[A-Za-z0-9\-_]+=*$/,
  UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
};

/**
 * 清理字符串输入
 */
export function sanitizeString(input: string, options: {
  allowHtml?: boolean;
  maxLength?: number;
  trim?: boolean;
} = {}): string {
  const {
    allowHtml = false,
    maxLength,
    trim = true
  } = options;

  let sanitized = input;

  // 基本清理
  if (!allowHtml) {
    sanitized = sanitized
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // 移除控制字符
  sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, '');

  // 去除首尾空格
  if (trim) {
    sanitized = sanitized.trim();
  }

  // 长度限制
  if (maxLength && sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  return sanitized;
}

/**
 * 验证API密钥格式
 */
export function validateApiKeyFormat(keyValue: string): boolean {
  if (!keyValue || typeof keyValue !== 'string') {
    return false;
  }

  // 检查最小长度
  if (keyValue.length < 8) {
    return false;
  }

  // 检查危险字符
  for (const pattern of Object.values(DANGEROUS_PATTERNS)) {
    if (pattern.test(keyValue)) {
      return false;
    }
  }

  // 检查是否符合常见的API密钥格式
  const validFormats = Object.values(API_KEY_PATTERNS);
  return validFormats.some(pattern => pattern.test(keyValue)) ||
         /^[\w\-\.=+\/]+$/.test(keyValue); // 通用格式
}

/**
 * 验证和清理API密钥输入
 */
export function validateAndSanitizeApiKey(input: ApiKeyInput): ValidationResult {
  const errors: string[] = [];
  const sanitized: ApiKeyInput = {};

  // 名称验证和清理
  if (input.name !== undefined) {
    if (!input.name || typeof input.name !== 'string' || input.name.trim().length === 0) {
      errors.push("API Key名称不能为空");
    } else {
      const sanitizedName = sanitizeString(input.name, {
        maxLength: 100,
        trim: true
      });

      if (sanitizedName.length === 0) {
        errors.push("API Key名称包含无效字符");
      } else {
        sanitized.name = sanitizedName;
      }
    }
  }

  // 描述验证和清理
  if (input.description !== undefined) {
    if (input.description && typeof input.description === 'string') {
      const sanitizedDescription = sanitizeString(input.description, {
        maxLength: 500,
        trim: true
      });
      sanitized.description = sanitizedDescription;
    }
  }

  // 平台验证和清理
  if (input.platform !== undefined) {
    if (input.platform && typeof input.platform === 'string') {
      const sanitizedPlatform = sanitizeString(input.platform, {
        maxLength: 50,
        trim: true
      });

      if (sanitizedPlatform.length > 0) {
        sanitized.platform = sanitizedPlatform;
      }
    }
  }

  // API密钥值验证和清理
  if (input.keyValue !== undefined) {
    if (!input.keyValue || typeof input.keyValue !== 'string' || input.keyValue.trim().length === 0) {
      errors.push("API Key值不能为空");
    } else {
      const trimmedKey = input.keyValue.trim();

      if (trimmedKey.length > 1000) {
        errors.push("API Key值不能超过1000个字符");
      } else if (!validateApiKeyFormat(trimmedKey)) {
        errors.push("API Key格式无效，请检查是否包含非法字符");
      } else {
        sanitized.keyValue = trimmedKey;
      }
    }
  }

  // 分组ID验证
  if (input.groupId !== undefined) {
    if (input.groupId && typeof input.groupId === 'string') {
      // 验证分组ID格式（UUID格式）
      const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (input.groupId !== 'default' && !uuidPattern.test(input.groupId)) {
        errors.push("无效的分组ID");
      } else {
        sanitized.groupId = input.groupId;
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized: Object.keys(sanitized).length > 0 ? sanitized : undefined
  };
}

/**
 * 验证和清理分组输入
 */
export function validateAndSanitizeGroup(input: GroupInput): ValidationResult {
  const errors: string[] = [];
  const sanitized: GroupInput = {};

  // 名称验证和清理
  if (input.name !== undefined) {
    if (!input.name || typeof input.name !== 'string' || input.name.trim().length === 0) {
      errors.push("分组名称不能为空");
    } else {
      const sanitizedName = sanitizeString(input.name, {
        maxLength: 50,
        trim: true
      });

      if (sanitizedName.length === 0) {
        errors.push("分组名称包含无效字符");
      } else {
        sanitized.name = sanitizedName;
      }
    }
  }

  // 描述验证和清理
  if (input.description !== undefined) {
    if (input.description && typeof input.description === 'string') {
      const sanitizedDescription = sanitizeString(input.description, {
        maxLength: 200,
        trim: true
      });
      sanitized.description = sanitizedDescription;
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized: Object.keys(sanitized).length > 0 ? sanitized : undefined
  };
}

/**
 * 清理搜索关键词
 */
export function sanitizeSearchKeyword(keyword: string): string {
  if (!keyword || typeof keyword !== 'string') {
    return '';
  }

  return sanitizeString(keyword, {
    maxLength: 200,
    trim: true
  });
}

/**
 * 验证ID格式
 */
export function validateId(id: string): { isValid: boolean; error?: string } {
  if (!id || typeof id !== 'string' || id.trim().length === 0) {
    return { isValid: false, error: "ID不能为空" };
  }

  const trimmedId = id.trim();

  // 检查UUID格式或简单ID格式
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const simpleIdPattern = /^[a-zA-Z0-9\-_]+$/;

  if (!uuidPattern.test(trimmedId) && !simpleIdPattern.test(trimmedId)) {
    return { isValid: false, error: "ID格式无效" };
  }

  return { isValid: true };
}