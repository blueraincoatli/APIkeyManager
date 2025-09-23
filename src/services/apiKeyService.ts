import {
  ApiKey,
  Group,
  UsageHistory,
  BatchApiKey,
  BatchImportResult,
} from "../types/apiKey";
import { invoke } from "@tauri-apps/api/core";
import {
  validateAndSanitizeApiKey,
  validateAndSanitizeGroup,
  validateId,
  type ApiKeyInput,
  type GroupInput,
} from "./inputValidation";
import { OperationContext } from "./secureLogging";
import {
  ServiceResult,
  ErrorCode,
  createSuccessResult,
  createErrorResult,
  wrapServiceOperation,
} from "./errors";

/**
 * Executes an operation with standardized error handling and logging
 * @param operation - The async operation to execute
 * @param context - The operation context for error mapping
 * @param errorContext - Additional context for error logging
 * @returns Promise<ServiceResult<T>> - Result containing either success data or error information
 */
async function executeOperation<T>(
  operation: () => Promise<T>,
  context: OperationContext,
  _errorContext?: Record<string, unknown>,
): Promise<ServiceResult<T>> {
  return wrapServiceOperation(async () => {
    const result = await operation();
    return result;
  }, mapContextToErrorCode(context));
}

/**
 * Validates and handles ID input with proper error handling
 * @param id - The ID string to validate
 * @returns ServiceResult<string> - Validated ID or error information
 */
function validateAndHandleId(id: string): ServiceResult<string> {
  const validation = validateId(id);
  if (!validation.isValid) {
    return createErrorResult(
      ErrorCode.INVALID_INPUT,
      validation.error || "Invalid ID",
    );
  }
  return createSuccessResult(id);
}

// 上下文到错误代码的映射
/**
 * Maps operation context to appropriate error codes
 * @param context - The operation context to map
 * @returns ErrorCode - Corresponding error code for the context
 */
function mapContextToErrorCode(context: OperationContext): ErrorCode {
  const errorMap: Record<OperationContext, ErrorCode> = {
    [OperationContext.API_KEY_ADD]: ErrorCode.API_KEY_INVALID,
    [OperationContext.API_KEY_EDIT]: ErrorCode.API_KEY_INVALID,
    [OperationContext.API_KEY_DELETE]: ErrorCode.API_KEY_NOT_FOUND,
    [OperationContext.API_KEY_SEARCH]: ErrorCode.SEARCH_ERROR,
    [OperationContext.API_KEY_COPY]: ErrorCode.API_KEY_NOT_FOUND,
    [OperationContext.GROUP_ADD]: ErrorCode.VALIDATION_FAILED,
    [OperationContext.USAGE_RECORD]: ErrorCode.API_KEY_NOT_FOUND,
    [OperationContext.MASTER_PASSWORD_SET]: ErrorCode.SECURITY_ERROR,
    [OperationContext.MASTER_PASSWORD_VERIFY]: ErrorCode.SECURITY_ERROR,
    [OperationContext.KEY_ENCRYPTION]: ErrorCode.ENCRYPTION_ERROR,
    [OperationContext.KEY_DECRYPTION]: ErrorCode.DECRYPTION_ERROR,
    [OperationContext.CLIPBOARD_ANALYZE]: ErrorCode.CLIPBOARD_ERROR,
    [OperationContext.OLLAMA_CHECK]: ErrorCode.NETWORK_ERROR,
    [OperationContext.THEME_ANALYSIS]: ErrorCode.UNKNOWN_ERROR,
  };

  return errorMap[context] || ErrorCode.UNKNOWN_ERROR;
}

// API Key相关服务
export const apiKeyService = {
  /**
   * Adds a new API key to the system with validation and encryption
   * @param apiKey - API key data without system-generated fields
   * @returns Promise<ServiceResult<ApiKey>> - Result containing the created API key or error information
   */
  async addApiKey(
    apiKey: Omit<ApiKey, "id" | "createdAt" | "updatedAt">,
  ): Promise<ServiceResult<ApiKey>> {
    // 验证和清理输入
    const validation = validateAndSanitizeApiKey(apiKey);
    if (!validation.isValid) {
      return createErrorResult(
        ErrorCode.VALIDATION_FAILED,
        validation.errors.join("; "),
      );
    }

    // 使用清理后的数据
    const sanitizedApiKey = validation.sanitized || apiKey;

    const newApiKey: ApiKey = {
      id: generateId(),
      name: (sanitizedApiKey as ApiKeyInput).name || "",
      keyValue: (sanitizedApiKey as ApiKeyInput).keyValue || "",
      platform: (sanitizedApiKey as ApiKeyInput).platform,
      description: (sanitizedApiKey as ApiKeyInput).description,
      groupId: (sanitizedApiKey as ApiKeyInput).groupId,
      tags: apiKey.tags,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    return executeOperation(
      () => invoke("add_api_key", { apiKey: newApiKey }) as Promise<boolean>,
      OperationContext.API_KEY_ADD,
    ).then((result) => {
      if (result.success && result.data) {
        return createSuccessResult(newApiKey);
      } else {
        return createErrorResult(ErrorCode.API_KEY_INVALID, "添加API Key失败");
      }
    });
  },

  // 编辑现有API Key
  /**
   * Updates an existing API key with validation and security checks
   * @param apiKey - Complete API key object including id and system fields
   * @returns Promise<ServiceResult<ApiKey>> - Result containing the updated API key or error information
   */
  async editApiKey(apiKey: ApiKey): Promise<ServiceResult<ApiKey>> {
    // 验证和清理输入
    const validation = validateAndSanitizeApiKey(apiKey);
    if (!validation.isValid) {
      return createErrorResult(
        ErrorCode.VALIDATION_FAILED,
        validation.errors.join("; "),
      );
    }

    // 使用清理后的数据，但保持原有ID和创建时间
    const sanitizedApiKey = validation.sanitized || apiKey;

    const updatedApiKey: ApiKey = {
      id: apiKey.id, // 保持原有ID
      name: (sanitizedApiKey as ApiKeyInput).name || "",
      keyValue: (sanitizedApiKey as ApiKeyInput).keyValue || "",
      platform: (sanitizedApiKey as ApiKeyInput).platform,
      description: (sanitizedApiKey as ApiKeyInput).description,
      groupId: (sanitizedApiKey as ApiKeyInput).groupId,
      tags: apiKey.tags,
      createdAt: apiKey.createdAt, // 保持原有创建时间
      updatedAt: Date.now(),
    };

    return executeOperation(
      () =>
        invoke("edit_api_key", { apiKey: updatedApiKey }) as Promise<boolean>,
      OperationContext.API_KEY_EDIT,
    ).then((result) => {
      if (result.success && result.data) {
        return createSuccessResult(updatedApiKey);
      } else {
        return createErrorResult(ErrorCode.API_KEY_INVALID, "编辑API Key失败");
      }
    });
  },

  // 删除API Key
  /**
   * Deletes an API key by ID with security validation
   * @param id - The unique identifier of the API key to delete
   * @returns Promise<ServiceResult<boolean>> - Result indicating success/failure of deletion
   */
  async deleteApiKey(id: string): Promise<ServiceResult<boolean>> {
    // 验证ID
    const idValidation = validateAndHandleId(id);
    if (!idValidation.success) {
      return createErrorResult(
        ErrorCode.INVALID_INPUT,
        idValidation.error?.message || "Invalid ID",
      );
    }

    return executeOperation(
      () => invoke("delete_api_key", { keyId: id }) as Promise<boolean>,
      OperationContext.API_KEY_DELETE,
    ).then((result) => {
      if (result.success && result.data) {
        return createSuccessResult(true);
      } else {
        return createErrorResult(
          ErrorCode.API_KEY_NOT_FOUND,
          "删除API Key失败",
        );
      }
    });
  },

  // 获取API Key列表
  /**
   * Retrieves all API keys from the system
   * @returns Promise<ServiceResult<ApiKey[]>> - Result containing array of all API keys or error information
   */
  async listApiKeys(): Promise<ServiceResult<ApiKey[]>> {
    return executeOperation(
      () => invoke("list_api_keys") as Promise<ApiKey[]>,
      OperationContext.API_KEY_SEARCH,
      { operation: "list_keys" },
    );
  },

  // 搜索API Key
  /**
   * Searches API keys by keyword across name, platform, and description
   * @param keyword - Search term to match against API key fields
   * @returns Promise<ServiceResult<ApiKey[]>> - Result containing matching API keys or error information
   */
  async searchKeys(keyword: string): Promise<ServiceResult<ApiKey[]>> {
    // 验证和清理搜索关键词
    if (typeof keyword !== "string") {
      return createErrorResult(
        ErrorCode.INVALID_INPUT,
        "搜索关键词必须是字符串",
      );
    }

    // 清理搜索关键词防止注入攻击
    const sanitizedKeyword = keyword.trim();
    if (sanitizedKeyword.length === 0) {
      return createErrorResult(
        ErrorCode.SEARCH_INVALID_QUERY,
        "搜索关键词不能为空",
      );
    }

    if (sanitizedKeyword.length > 200) {
      return createErrorResult(
        ErrorCode.SEARCH_INVALID_QUERY,
        "搜索关键词不能超过200个字符",
      );
    }

    return executeOperation(
      () =>
        invoke("search_api_keys", { keyword: sanitizedKeyword }) as Promise<
          ApiKey[]
        >,
      OperationContext.API_KEY_SEARCH,
      { operation: "search_keys" },
    );
  },

  // 获取所有platform
  /**
   * Retrieves all unique platform names from the system
   * @returns Promise<ServiceResult<string[]>> - Result containing array of all platform names or error information
   */
  async getAllPlatforms(): Promise<ServiceResult<string[]>> {
    return executeOperation(
      () => invoke("get_all_platforms") as Promise<string[]>,
      OperationContext.API_KEY_SEARCH,
      { operation: "get_platforms" },
    );
  },

  // 复制API Key到剪贴板
  /**
   * Copies an API key to system clipboard with security validation
   * @param id - The unique identifier of the API key to copy
   * @returns Promise<ServiceResult<boolean>> - Result indicating success/failure of copy operation
   */
  async copyToClipboard(id: string): Promise<ServiceResult<boolean>> {
    // 验证ID
    const idValidation = validateAndHandleId(id);
    if (!idValidation.success) {
      return createErrorResult(
        ErrorCode.INVALID_INPUT,
        idValidation.error?.message || "Invalid ID",
      );
    }

    return executeOperation(
      () => invoke("copy_to_clipboard", { keyId: id }) as Promise<boolean>,
      OperationContext.API_KEY_COPY,
    ).then((result) => {
      if (result.success && result.data) {
        return createSuccessResult(true);
      } else {
        return createErrorResult(
          ErrorCode.CLIPBOARD_ERROR,
          "复制API Key到剪贴板失败",
        );
      }
    });
  },
};

// 分组相关服务
export const groupService = {
  // 获取分组列表
  /**
   * Retrieves all API key groups from the system
   * @returns Promise<ServiceResult<Group[]>> - Result containing array of all groups or error information
   */
  async listGroups(): Promise<ServiceResult<Group[]>> {
    return executeOperation(
      () => invoke("list_groups") as Promise<Group[]>,
      OperationContext.API_KEY_SEARCH,
      { operation: "list_groups" },
    );
  },

  // 添加新分组
  /**
   * Adds a new group for organizing API keys
   * @param group - Group data without system-generated fields
   * @returns Promise<ServiceResult<Group>> - Result containing the created group or error information
   */
  async addGroup(
    group: Omit<Group, "id" | "createdAt" | "updatedAt">,
  ): Promise<ServiceResult<Group>> {
    // 验证和清理输入
    const validation = validateAndSanitizeGroup(group);
    if (!validation.isValid) {
      return createErrorResult(
        ErrorCode.VALIDATION_FAILED,
        validation.errors.join("; "),
      );
    }

    // 使用清理后的数据
    const sanitizedGroup = validation.sanitized || group;

    const newGroup: Group = {
      id: generateId(),
      name: (sanitizedGroup as GroupInput).name || group.name || "",
      description:
        (sanitizedGroup as GroupInput).description || group.description,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    return executeOperation(
      () => invoke("add_group", { group: newGroup }) as Promise<boolean>,
      OperationContext.GROUP_ADD,
    ).then((result) => {
      if (result.success && result.data) {
        return createSuccessResult(newGroup);
      } else {
        return createErrorResult(ErrorCode.VALIDATION_FAILED, "添加分组失败");
      }
    });
  },
};

// 使用历史相关服务
export const usageHistoryService = {
  // 记录使用历史
  /**
   * Records usage history for an API key
   * @param keyId - The unique identifier of the API key being used
   * @returns Promise<ServiceResult<UsageHistory>> - Result containing the usage record or error information
   */
  async recordUsage(keyId: string): Promise<ServiceResult<UsageHistory>> {
    // 验证keyId
    const keyIdValidation = validateAndHandleId(keyId);
    if (!keyIdValidation.success) {
      return createErrorResult(
        ErrorCode.INVALID_INPUT,
        keyIdValidation.error?.message || "Invalid ID",
      );
    }

    const history: UsageHistory = {
      id: generateId(),
      keyId,
      usedAt: Date.now(),
    };

    return executeOperation(
      () => invoke("record_usage", { history }) as Promise<boolean>,
      OperationContext.USAGE_RECORD,
    ).then((result) => {
      if (result.success && result.data) {
        return createSuccessResult(history);
      } else {
        return createErrorResult(
          ErrorCode.API_KEY_NOT_FOUND,
          "记录使用历史失败",
        ) as ServiceResult<UsageHistory>;
      }
    });
  },

  // 获取使用历史
  /**
   * Retrieves usage history for a specific API key
   * @param keyId - The unique identifier of the API key
   * @returns Promise<ServiceResult<UsageHistory[]>> - Result containing array of usage records or error information
   */
  async getUsageHistory(keyId: string): Promise<ServiceResult<UsageHistory[]>> {
    // 验证keyId
    const keyIdValidation = validateAndHandleId(keyId);
    if (!keyIdValidation.success) {
      return createErrorResult(
        ErrorCode.INVALID_INPUT,
        keyIdValidation.error?.message || "Invalid ID",
      ) as ServiceResult<UsageHistory[]>;
    }

    return executeOperation(
      () => invoke("get_usage_history", { keyId }) as Promise<UsageHistory[]>,
      OperationContext.USAGE_RECORD,
      { operation: "get_history" },
    );
  },
};

// 生成唯一ID的辅助函数（使用更安全的方法）
function generateId(): string {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// 批量导入相关服务
export const batchImportService = {
  /**
   * 批量导入API Keys
   * @param keys - 要导入的API Key数组
   * @returns Promise<ServiceResult<BatchImportResult>> - 包含导入结果或错误信息的结果
   */
  async importApiKeysBatch(
    keys: BatchApiKey[],
  ): Promise<ServiceResult<BatchImportResult>> {
    // 验证输入
    if (!Array.isArray(keys) || keys.length === 0) {
      return createErrorResult(ErrorCode.INVALID_INPUT, "导入数据不能为空");
    }

    // 验证每个API Key
    const validationErrors: string[] = [];
    const validatedKeys: BatchApiKey[] = [];

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const validation = validateAndSanitizeApiKey({
        name: key.name,
        keyValue: key.keyValue,
        platform: key.platform,
        description: key.description,
      });

      if (!validation.isValid) {
        validationErrors.push(
          `第${i + 1}条记录: ${validation.errors.join("; ")}`,
        );
      } else {
        validatedKeys.push({
          name: (validation.sanitized as ApiKeyInput)?.name || key.name,
          keyValue:
            (validation.sanitized as ApiKeyInput)?.keyValue || key.keyValue,
          platform:
            (validation.sanitized as ApiKeyInput)?.platform || key.platform,
          description:
            (validation.sanitized as ApiKeyInput)?.description ||
            key.description,
        });
      }
    }

    if (validationErrors.length > 0) {
      return createErrorResult(
        ErrorCode.VALIDATION_FAILED,
        `数据验证失败: ${validationErrors.join(" | ")}`,
      );
    }

    return executeOperation(
      () =>
        invoke("import_api_keys_batch", {
          keys: validatedKeys,
        }) as Promise<BatchImportResult>,
      OperationContext.API_KEY_ADD,
      { operation: "batch_import", count: validatedKeys.length },
    );
  },
};
