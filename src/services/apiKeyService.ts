import { ApiKey, Group, UsageHistory } from "../types/apiKey";
import { invoke } from "@tauri-apps/api/core";
import { validateAndSanitizeApiKey, validateAndSanitizeGroup, validateId } from "./inputValidation";
import { logSecureError, getUserFriendlyErrorMessage, OperationContext } from "./secureLogging";

// API Key相关服务
export const apiKeyService = {
  // 添加新的API Key
  async addApiKey(apiKey: Omit<ApiKey, "id" | "createdAt" | "updatedAt">): Promise<{ success: boolean; error?: string }> {
    try {
      // 验证和清理输入
      const validation = validateAndSanitizeApiKey(apiKey);
      if (!validation.isValid) {
        return { success: false, error: validation.errors.join("; ") };
      }

      // 使用清理后的数据
      const sanitizedApiKey = validation.sanitized || apiKey;

      const newApiKey: ApiKey = {
        ...sanitizedApiKey,
        id: generateId(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      // 调用Tauri后端命令
      const result = await invoke("add_api_key", { apiKey: newApiKey });
      return { success: result as boolean, error: result ? undefined : "添加API Key失败" };
    } catch (error) {
      logSecureError(OperationContext.API_KEY_ADD, error);
      return { success: false, error: getUserFriendlyErrorMessage(OperationContext.API_KEY_ADD) };
    }
  },

  // 编辑现有API Key
  async editApiKey(apiKey: ApiKey): Promise<{ success: boolean; error?: string }> {
    try {
      // 验证和清理输入
      const validation = validateAndSanitizeApiKey(apiKey);
      if (!validation.isValid) {
        return { success: false, error: validation.errors.join("; ") };
      }

      // 使用清理后的数据，但保持原有ID和创建时间
      const sanitizedApiKey = validation.sanitized || apiKey;

      const updatedApiKey = {
        ...sanitizedApiKey,
        id: apiKey.id, // 保持原有ID
        createdAt: apiKey.createdAt, // 保持原有创建时间
        updatedAt: Date.now(),
      };

      // 调用Tauri后端命令
      const result = await invoke("edit_api_key", { apiKey: updatedApiKey });
      return { success: result as boolean, error: result ? undefined : "编辑API Key失败" };
    } catch (error) {
      logSecureError(OperationContext.API_KEY_EDIT, error);
      return { success: false, error: getUserFriendlyErrorMessage(OperationContext.API_KEY_EDIT) };
    }
  },

  // 删除API Key
  async deleteApiKey(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      // 验证ID
      const idValidation = validateId(id);
      if (!idValidation.isValid) {
        return { success: false, error: idValidation.error };
      }

      // 调用Tauri后端命令
      const result = await invoke("delete_api_key", { keyId: id });
      return { success: result as boolean, error: result ? undefined : "删除API Key失败" };
    } catch (error) {
      logSecureError(OperationContext.API_KEY_DELETE, error);
      return { success: false, error: getUserFriendlyErrorMessage(OperationContext.API_KEY_DELETE) };
    }
  },

  // 获取API Key列表
  async listApiKeys(): Promise<{ data: ApiKey[]; error?: string }> {
    try {
      // 调用Tauri后端命令
      const result = await invoke("list_api_keys");
      return { data: result as ApiKey[], error: undefined };
    } catch (error) {
      logSecureError(OperationContext.API_KEY_SEARCH, error, { operation: 'list_keys' });
      return { data: [], error: getUserFriendlyErrorMessage(OperationContext.API_KEY_SEARCH) };
    }
  },

  // 搜索API Key
  async searchKeys(keyword: string): Promise<{ data: ApiKey[]; error?: string }> {
    try {
      // 验证和清理搜索关键词
      if (typeof keyword !== 'string') {
        return { data: [], error: "搜索关键词必须是字符串" };
      }

      // 清理搜索关键词防止注入攻击
      const sanitizedKeyword = keyword.trim();
      if (sanitizedKeyword.length === 0) {
        return { data: [], error: "搜索关键词不能为空" };
      }

      if (sanitizedKeyword.length > 200) {
        return { data: [], error: "搜索关键词不能超过200个字符" };
      }

      // 调用Tauri后端命令（使用清理后的关键词）
      const result = await invoke("search_api_keys", { keyword: sanitizedKeyword });
      return { data: result as ApiKey[], error: undefined };
    } catch (error) {
      logSecureError(OperationContext.API_KEY_SEARCH, error, { operation: 'search_keys' });
      return { data: [], error: getUserFriendlyErrorMessage(OperationContext.API_KEY_SEARCH) };
    }
  },

  // 复制API Key到剪贴板
  async copyToClipboard(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      // 验证ID
      const idValidation = validateId(id);
      if (!idValidation.isValid) {
        return { success: false, error: idValidation.error };
      }

      // 调用Tauri后端命令
      const result = await invoke("copy_to_clipboard", { keyId: id });
      return { success: result as boolean, error: result ? undefined : "复制API Key到剪贴板失败" };
    } catch (error) {
      logSecureError(OperationContext.API_KEY_COPY, error);
      return { success: false, error: getUserFriendlyErrorMessage(OperationContext.API_KEY_COPY) };
    }
  },
};

// 分组相关服务
export const groupService = {
  // 获取分组列表
  async listGroups(): Promise<{ data: Group[]; error?: string }> {
    try {
      // 调用Tauri后端命令
      const result = await invoke("list_groups");
      return { data: result as Group[], error: undefined };
    } catch (error) {
      logSecureError(OperationContext.API_KEY_SEARCH, error, { operation: 'list_groups' });
      return { data: [], error: getUserFriendlyErrorMessage(OperationContext.API_KEY_SEARCH) };
    }
  },

  // 添加新分组
  async addGroup(group: Omit<Group, "id" | "createdAt" | "updatedAt">): Promise<{ success: boolean; error?: string }> {
    try {
      // 验证和清理输入
      const validation = validateAndSanitizeGroup(group);
      if (!validation.isValid) {
        return { success: false, error: validation.errors.join("; ") };
      }

      // 使用清理后的数据
      const sanitizedGroup = validation.sanitized || group;

      const newGroup: Group = {
        ...sanitizedGroup,
        id: generateId(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      // 调用Tauri后端命令
      const result = await invoke("add_group", { group: newGroup });
      return { success: result as boolean, error: result ? undefined : "添加分组失败" };
    } catch (error) {
      logSecureError(OperationContext.GROUP_ADD, error);
      return { success: false, error: getUserFriendlyErrorMessage(OperationContext.GROUP_ADD) };
    }
  },
};

// 使用历史相关服务
export const usageHistoryService = {
  // 记录使用历史
  async recordUsage(keyId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // 验证keyId
      const keyIdValidation = validateId(keyId);
      if (!keyIdValidation.isValid) {
        return { success: false, error: keyIdValidation.error };
      }

      const history: UsageHistory = {
        id: generateId(),
        keyId,
        usedAt: Date.now(),
      };

      // 调用Tauri后端命令
      const result = await invoke("record_usage", { history });
      return { success: result as boolean, error: result ? undefined : "记录使用历史失败" };
    } catch (error) {
      logSecureError(OperationContext.USAGE_RECORD, error);
      return { success: false, error: getUserFriendlyErrorMessage(OperationContext.USAGE_RECORD) };
    }
  },

  // 获取使用历史
  async getUsageHistory(keyId: string): Promise<{ data: UsageHistory[]; error?: string }> {
    try {
      // 验证keyId
      const keyIdValidation = validateId(keyId);
      if (!keyIdValidation.isValid) {
        return { data: [], error: keyIdValidation.error };
      }

      // 调用Tauri后端命令
      const result = await invoke("get_usage_history", { keyId });
      return { data: result as UsageHistory[], error: undefined };
    } catch (error) {
      logSecureError(OperationContext.USAGE_RECORD, error, { operation: 'get_history' });
      return { data: [], error: getUserFriendlyErrorMessage(OperationContext.USAGE_RECORD) };
    }
  },
};

// 生成唯一ID的辅助函数（使用更安全的方法）
function generateId(): string {
  return crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).substr(2);
}