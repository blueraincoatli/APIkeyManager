import { ApiKey, Group, UsageHistory } from "../types/apiKey";
import { invoke } from "@tauri-apps/api/core";

// API Key相关服务
export const apiKeyService = {
  // 添加新的API Key
  async addApiKey(apiKey: Omit<ApiKey, "id" | "createdAt" | "updatedAt">): Promise<boolean> {
    try {
      const newApiKey: ApiKey = {
        ...apiKey,
        id: generateId(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      
      // 调用Tauri后端命令
      return await invoke("add_api_key", { apiKey: newApiKey });
    } catch (error) {
      console.error("添加API Key失败:", error);
      return false;
    }
  },

  // 编辑现有API Key
  async editApiKey(apiKey: ApiKey): Promise<boolean> {
    try {
      const updatedApiKey = {
        ...apiKey,
        updatedAt: Date.now(),
      };
      
      // 调用Tauri后端命令
      return await invoke("edit_api_key", { apiKey: updatedApiKey });
    } catch (error) {
      console.error("编辑API Key失败:", error);
      return false;
    }
  },

  // 删除API Key
  async deleteApiKey(id: string): Promise<boolean> {
    try {
      // 调用Tauri后端命令
      return await invoke("delete_api_key", { keyId: id });
    } catch (error) {
      console.error("删除API Key失败:", error);
      return false;
    }
  },

  // 获取API Key列表
  async listApiKeys(): Promise<ApiKey[]> {
    try {
      // 调用Tauri后端命令
      return await invoke("list_api_keys");
    } catch (error) {
      console.error("获取API Key列表失败:", error);
      return [];
    }
  },

  // 搜索API Key
  async searchKeys(keyword: string): Promise<ApiKey[]> {
    try {
      // 调用Tauri后端命令
      return await invoke("search_api_keys", { keyword });
    } catch (error) {
      console.error("搜索API Key失败:", error);
      return [];
    }
  },

  // 复制API Key到剪贴板
  async copyToClipboard(id: string): Promise<boolean> {
    try {
      // 调用Tauri后端命令
      return await invoke("copy_to_clipboard", { keyId: id });
    } catch (error) {
      console.error("复制API Key到剪贴板失败:", error);
      return false;
    }
  },
};

// 分组相关服务
export const groupService = {
  // 获取分组列表
  async listGroups(): Promise<Group[]> {
    try {
      // 调用Tauri后端命令
      return await invoke("list_groups");
    } catch (error) {
      console.error("获取分组列表失败:", error);
      return [];
    }
  },

  // 添加新分组
  async addGroup(group: Omit<Group, "id" | "createdAt" | "updatedAt">): Promise<boolean> {
    try {
      const newGroup: Group = {
        ...group,
        id: generateId(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      
      // 调用Tauri后端命令
      return await invoke("add_group", { group: newGroup });
    } catch (error) {
      console.error("添加分组失败:", error);
      return false;
    }
  },
};

// 使用历史相关服务
export const usageHistoryService = {
  // 记录使用历史
  async recordUsage(keyId: string): Promise<boolean> {
    try {
      const history: UsageHistory = {
        id: generateId(),
        keyId,
        usedAt: Date.now(),
      };
      
      // 调用Tauri后端命令
      return await invoke("record_usage", { history });
    } catch (error) {
      console.error("记录使用历史失败:", error);
      return false;
    }
  },

  // 获取使用历史
  async getUsageHistory(keyId: string): Promise<UsageHistory[]> {
    try {
      // 调用Tauri后端命令
      return await invoke("get_usage_history", { keyId });
    } catch (error) {
      console.error("获取使用历史失败:", error);
      return [];
    }
  },
};

// 生成唯一ID的辅助函数
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}