/**
 * Application constants
 * Centralized configuration for hardcoded values
 */

// UI Constants
export const UI_CONSTANTS = {
  // Animation timings
  ANIMATION_DURATION: {
    SHORT: 200, // ms
    MEDIUM: 300, // ms
    LONG: 500, // ms
    EXIT: 300, // ms
    THEME_TRANSITION: 200, // ms
  },

  // Toast notifications
  TOAST: {
    DEFAULT_DURATION: 4000, // ms
    ERROR_DURATION: 6000, // ms
    WARNING_DURATION: 5000, // ms
    INFO_DURATION: 4000, // ms
    POSITION: "top-right" as const,
    LIMIT: 5,
  },

  // Layout dimensions
  LAYOUT: {
    HEADER_HEIGHT: 64, // px
    ITEM_HEIGHT: 64, // px
    CONTAINER_HEIGHT: 600, // px
    OVERSCAN: 5,
    MAX_TOAST_LIMIT: 5,
  },

  // Sizes and limits
  LIMITS: {
    MAX_CONTENT_LENGTH: 100000, // 100KB
    MAX_LOG_ENTRIES: 1000,
    MAX_CLIPBOARD_DURATION: 600000, // 10 minutes
    MAX_TOAST_DURATION: 600000, // 10 minutes
    MAX_SEARCH_RESULTS: 50,
  },

  // Time intervals
  INTERVALS: {
    SECOND: 1000, // ms
    MINUTE: 60000, // ms
    HOUR: 3600000, // ms
    DAY: 86400000, // ms
    TOAST_UPDATE: 1000, // ms
    SECURITY_CHECK: 30000, // ms
    AUDIT_CLEANUP_DAYS: 30, // days
  },
} as const;

// Security Constants
export const SECURITY_CONSTANTS = {
  // Encryption
  ENCRYPTION: {
    KEY_LENGTH: 256, // bits
    ALGORITHM: "AES-256-GCM" as const,
    ITERATIONS: 3,
  },

  // Clipboard security
  CLIPBOARD: {
    DEFAULT_TIMEOUT: 30000, // ms
    MIN_TIMEOUT: 5000, // ms
    MAX_TIMEOUT: 600000, // ms
    MAX_CONTENT_LENGTH: 5000, // characters
    MAX_AUTO_CLEAR_MINUTES: 5, // minutes
  },

  // Security levels
  SECURITY_LEVELS: {
    HIGH: {
      TIMEOUT: 10000, // 10 seconds
      AUTO_CLEAR_MINUTES: 1,
    },
    BALANCED: {
      TIMEOUT: 30000, // 30 seconds
      AUTO_CLEAR_MINUTES: 2,
    },
    CONVENIENCE: {
      TIMEOUT: 60000, // 60 seconds
      AUTO_CLEAR_MINUTES: 5,
    },
  },

  // Validation limits
  VALIDATION: {
    MAX_NAME_LENGTH: 100,
    MAX_DESCRIPTION_LENGTH: 500,
    MAX_PLATFORM_LENGTH: 50,
    MIN_PASSWORD_LENGTH: 8,
    MAX_SEARCH_LENGTH: 200,
  },
} as const;

// API Constants
export const API_CONSTANTS = {
  // Service endpoints
  ENDPOINTS: {
    OLLAMA: "http://localhost:11434",
    CLIPBOARD_ANALYZE: "/analyze",
  },

  // Response codes
  STATUS_CODES: {
    SUCCESS: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
  },

  // Timeouts
  TIMEOUTS: {
    DEFAULT: 5000, // ms
    OLLAMA_CHECK: 3000, // ms
    ANALYSIS: 15000, // ms
    CLIPBOARD_OPERATION: 10000, // ms
  },
} as const;

// Performance Constants
export const PERFORMANCE_CONSTANTS = {
  // Targets
  TARGETS: {
    LOAD_TIME: 2000, // ms
    SEARCH_RESPONSE: 100, // ms
    TOOLBAR_RESPONSE: 50, // ms
    MENU_RESPONSE: 100, // ms
    ANALYSIS_TIME: 5000, // ms
  },

  // Resource limits
  LIMITS: {
    MAX_MEMORY_USAGE: 50, // MB
    MAX_STORAGE_SIZE: 10, // MB
    MAX_CONCURRENT_OPERATIONS: 7,
  },

  // Batch sizes
  BATCH: {
    SEARCH_RESULTS: 50,
    LOG_ENTRIES: 1000,
    API_KEYS: 100,
  },
} as const;

// Feature Flags
export const FEATURE_FLAGS = {
  ENABLE_AUDIT_LOGGING: true,
  ENABLE_CLIPBOARD_SECURITY: true,
  ENABLE_AUTO_CLEAR: true,
  ENABLE_PERFORMANCE_MONITORING: true,
  ENABLE_THEMES: true,
} as const;

// Default configurations
export const DEFAULT_CONFIG = {
  CLIPBOARD: {
    SECURITY_LEVEL: "balanced" as const,
    AUTO_CLEAR: true,
    TIMEOUT: 30000, // ms
    MAX_CONTENT_LENGTH: 5000,
  },
  THEME: {
    DEFAULT: "system" as const,
    TRANSITION_DURATION: 200,
  },
  PERFORMANCE: {
    ENABLE_VIRTUAL_SCROLLING: true,
    ENABLE_LAZY_LOADING: true,
    ENABLE_CACHING: true,
  },
} as const;

// Error messages
export const ERROR_MESSAGES = {
  GENERAL: {
    UNKNOWN: "发生未知错误",
    NETWORK: "网络连接失败",
    TIMEOUT: "请求超时",
    VALIDATION: "输入验证失败",
  },
  API_KEY: {
    NOT_FOUND: "API Key不存在",
    INVALID: "API Key格式无效",
    DUPLICATE: "API Key已存在",
    SAVE_FAILED: "保存API Key失败",
    DELETE_FAILED: "删除API Key失败",
  },
  CLIPBOARD: {
    COPY_FAILED: "复制失败",
    PASTE_FAILED: "粘贴失败",
    CLEAR_FAILED: "清空失败",
    ACCESS_DENIED: "剪贴板访问被拒绝",
    CONTENT_TOO_LARGE: "内容过大",
  },
  AUTH: {
    INVALID_PASSWORD: "密码无效",
    PASSWORD_TOO_SHORT: "密码长度不足",
    AUTH_FAILED: "认证失败",
  },
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  GENERAL: {
    SUCCESS: "操作成功",
    SAVED: "保存成功",
    DELETED: "删除成功",
    UPDATED: "更新成功",
  },
  API_KEY: {
    COPIED: "已复制到剪贴板",
    ADDED: "添加成功",
    EDITED: "编辑成功",
    DELETED: "删除成功",
  },
  CLIPBOARD: {
    IMPORTED: "导入成功",
    ANALYZED: "分析完成",
    CLEARED: "清空成功",
  },
} as const;

// Regular expressions
export const PATTERNS = {
  API_KEY: {
    GENERIC: /^[a-zA-Z0-9_\-\.]{20,}$/i,
    OPENAI: /^sk-[a-zA-Z0-9]{48}$/i,
    ANTHROPIC: /^sk-ant-[a-zA-Z0-9]{95}$/i,
    GOOGLE: /^AIzaSy[A-Za-z0-9_\-]{35}$/i,
    DEEPSEEK: /^sk-[a-zA-Z0-9]{48}$/i,
    GEMINI: /^[a-zA-Z0-9_\-\.]{20,}$/i,
  },
  VALIDATION: {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    URL: /^https?:\/\/.+/,
    NAME: /^[a-zA-Z0-9\s\-_\.]{1,100}$/,
  },
} as const;
