import { invoke } from "@tauri-apps/api/core";

// 剪贴板服务
export const clipboardService = {
  // 获取剪贴板内容
  async getClipboardContent(): Promise<string> {
    try {
      // 调用Tauri后端命令
      return await invoke("get_clipboard_content");
    } catch (error) {
      console.error("获取剪贴板内容失败:", error);
      return "";
    }
  },

  // 复制内容到剪贴板
  async copyToClipboard(content: string): Promise<boolean> {
    try {
      // 调用Tauri后端命令
      return await invoke("copy_to_clipboard", { content });
    } catch (error) {
      console.error("复制内容到剪贴板失败:", error);
      return false;
    }
  },
};