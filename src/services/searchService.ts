import { ApiKey } from "../types/apiKey";
import { invoke } from "@tauri-apps/api/core";

// 搜索服务
export const searchService = {
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

  // 显示搜索工具条
  showSearchToolbar(): void {
    // 这里将触发显示搜索工具条的事件
    // 实际实现将在后续步骤中完成
    console.log("显示搜索工具条");
  },

  // 隐藏搜索工具条
  hideSearchToolbar(): void {
    // 这里将触发隐藏搜索工具条的事件
    // 实际实现将在后续步骤中完成
    console.log("隐藏搜索工具条");
  },
};