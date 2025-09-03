import { ApiKey, Group, UsageHistory } from "../types/apiKey";
import { invoke } from "@tauri-apps/api/core";
import { Validator } from "./validation";

// API Key相关服务
export const apiKeyService = {
  // 添加新的API Key
  async addApiKey(apiKey: Omit<ApiKey, "id" | "createdAt" | "updatedAt">): Promise<{ success: boolean; error?: string }> {
    try {
      // 验证输入
      const validation = Validator.validateApiKey(apiKey);
      if (!validation.isValid) {
        return { success: false, error: validation.errors.join("; ") };
      }
      
      const newApiKey: ApiKey = {
        ...apiKey,
        id: generateId(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      
      // 调用Tauri后端命令
      const result = await invoke("add_api_key", { apiKey: newApiKey });
      return { success: result as boolean, error: result ? undefined : "添加API Key失败" };
    } catch (error) {
      console.error("添加API Key失败:", error);
      return { success: false, error: error instanceof Error ? error.message : "未知错误" };
    }
  },

  // 编辑现有API Key
  async editApiKey(apiKey: ApiKey): Promise<{ success: boolean; error?: string }> {
    try {
      // 验证输入
      const validation = Validator.validateApiKey(apiKey);
      if (!validation.isValid) {
        return { success: false, error: validation.errors.join("; ") };
      }
      
      const updatedApiKey = {
        ...apiKey,
        updatedAt: Date.now(),
      };
      
      // 调用Tauri后端命令
      const result = await invoke("edit_api_key", { apiKey: updatedApiKey });
      return { success: result as boolean, error: result ? undefined : "编辑API Key失败" };
    } catch (error) {
      console.error("编辑API Key失败:", error);
      return { success: false, error: error instanceof Error ? error.message : "未知错误" };
    }
  },

  // 删除API Key
  async deleteApiKey(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      // 简单验证ID
      if (!id || typeof id !== 'string' || id.trim().length === 0) {
        return { success: false, error: "无效的API Key ID" };
      }
      
      // 调用Tauri后端命令
      const result = await invoke("delete_api_key", { keyId: id });
      return { success: result as boolean, error: result ? undefined : "删除API Key失败" };
    } catch (error) {
      console.error("删除API Key失败:", error);
      return { success: false, error: error instanceof Error ? error.message : "未知错误" };
    }
  },

  // 获取API Key列表
  async listApiKeys(): Promise<{ data: ApiKey[]; error?: string }> {
    try {
      // 调用Tauri后端命令
      const result = await invoke("list_api_keys");
      return { data: result as ApiKey[], error: undefined };
    } catch (error) {
      console.error("获取API Key列表失败:", error);
      return { data: [], error: error instanceof Error ? error.message : "未知错误" };
    }
  },

  // 搜索API Key
  async searchKeys(keyword: string): Promise<{ data: ApiKey[]; error?: string }> {
    try {
      // 验证搜索关键词
      if (typeof keyword !== 'string') {
        return { data: [], error: "搜索关键词必须是字符串" };
      }
      
      // 调用Tauri后端命令
      const result = await invoke("search_api_keys", { keyword });
      return { data: result as ApiKey[], error: undefined };
    } catch (error) {
      console.error("搜索API Key失败:", error);
      return { data: [], error: error instanceof Error ? error.message : "未知错误" };
    }
  },

  // 复制API Key到剪贴板
  async copyToClipboard(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      // 验证ID
      if (!id || typeof id !== 'string' || id.trim().length === 0) {
        return { success: false, error: "无效的API Key ID" };
      }
      
      // 调用Tauri后端命令
      const result = await invoke("copy_to_clipboard", { keyId: id });
      return { success: result as boolean, error: result ? undefined : "复制API Key到剪贴板失败" };
    } catch (error) {
      console.error("复制API Key到剪贴板失败:", error);
      return { success: false, error: error instanceof Error ? error.message : "未知错误" };
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
      console.error("获取分组列表失败:", error);
      return { data: [], error: error instanceof Error ? error.message : "未知错误" };
    }
  },

  // 添加新分组
  async addGroup(group: Omit<Group, "id" | "createdAt" | "updatedAt">): Promise<{ success: boolean; error?: string }> {
    try {
      // 验证输入
      const validation = Validator.validateGroup(group);
      if (!validation.isValid) {
        return { success: false, error: validation.errors.join("; ") };
      }
      
      const newGroup: Group = {
        ...group,
        id: generateId(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      
      // 调用Tauri后端命令
      const result = await invoke("add_group", { group: newGroup });
      return { success: result as boolean, error: result ? undefined : "添加分组失败" };
    } catch (error) {
      console.error("添加分组失败:", error);
      return { success: false, error: error instanceof Error ? error.message : "未知错误" };
    }
  },
};

// 使用历史相关服务
export const usageHistoryService = {
  // 记录使用历史
  async recordUsage(keyId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // 验证keyId
      if (!keyId || typeof keyId !== 'string' || keyId.trim().length === 0) {
        return { success: false, error: "无效的API Key ID" };
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
      console.error("记录使用历史失败:", error);
      return { success: false, error: error instanceof Error ? error.message : "未知错误" };
    }
  },

  // 获取使用历史
  async getUsageHistory(keyId: string): Promise<{ data: UsageHistory[]; error?: string }> {
    try {
      // 验证keyId
      if (!keyId || typeof keyId !== 'string' || keyId.trim().length === 0) {
        return { data: [], error: "无效的API Key ID" };
      }
      
      // 调用Tauri后端命令
      const result = await invoke("get_usage_history", { keyId });
      return { data: result as UsageHistory[], error: undefined };
    } catch (error) {
      console.error("获取使用历史失败:", error);
      return { data: [], error: error instanceof Error ? error.message : "未知错误" };
    }
  },
};

// 生成唯一ID的辅助函数（使用更安全的方法）
function generateId(): string {
  return crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).substr(2);
}