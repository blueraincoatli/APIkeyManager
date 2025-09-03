import { ApiKey } from "../types/apiKey";
import { invoke } from "@tauri-apps/api/core";

// 搜索服务
export const searchService = {
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

  // 显示搜索工具条
  showSearchToolbar(): void {
    // 这里将触发显示搜索工具条的事件
    // 实际实现将在后续步骤中完成
    // 移除了调试日志
  },

  // 隐藏搜索工具条
  hideSearchToolbar(): void {
    // 这里将触发隐藏搜索工具条的事件
    // 实际实现将在后续步骤中完成
    // 移除了调试日志
  },
};