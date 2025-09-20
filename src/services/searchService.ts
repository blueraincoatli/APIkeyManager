import { ApiKey } from "../types/apiKey";
import { invoke } from "@tauri-apps/api/core";
import { logSecureError, getUserFriendlyErrorMessage, OperationContext } from "./secureLogging";

// 搜索服务
export const searchService = {
  // 搜索API Key
  async searchKeys(keyword: string): Promise<{ data: ApiKey[]; error?: string }> {
    try {
      // 验证搜索关键词
      if (typeof keyword !== 'string') {
        return { data: [], error: "搜索关键词必须是字符串" };
      }
      
      console.log("SearchService: Attempting to search with keyword:", keyword);

      // 直接调用Tauri后端命令，不进行环境检测
      const result = await invoke("search_api_keys", { keyword });
      console.log("SearchService: Tauri search successful, results:", result);
      return { data: result as ApiKey[], error: undefined };
    } catch (error) {
      console.error("SearchService: Tauri search failed:", error);
      logSecureError(OperationContext.API_KEY_SEARCH, error);

      // 作为回退，返回空数组而不是模拟数据
      return { data: [], error: getUserFriendlyErrorMessage(OperationContext.API_KEY_SEARCH) };

      /*
      // 如果需要模拟数据作为回退，取消注释以下代码
      const now = Date.now();
      const demoData: ApiKey[] = [
        // OpenAI Keys
        { id: 'openai_1', name: 'OpenAI Production Key', keyValue: 'sk-xxxxx-demo1', platform: 'openai', description: 'Production API key for OpenAI', createdAt: now - 86400000 * 30, updatedAt: now - 86400000 * 5, tags: ['ai', 'nlp', 'production'] },
        // ... other demo data
      ];
      const q = (keyword || '').trim().toLowerCase();
      if (!q) return { data: demoData, error: undefined };
      const filtered = demoData.filter(k => {
        const hay = `${k.name} ${k.platform || ''} ${k.description || ''} ${(k as any).tags?.join(' ') || ''}`.toLowerCase();
        return hay.includes(q);
      });
      return { data: filtered, error: undefined };
      */
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
