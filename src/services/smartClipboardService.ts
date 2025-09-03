import { AnalyzedKey } from "../types/apiKey";
import { invoke } from "@tauri-apps/api/core";

// 智能剪贴板服务
export const smartClipboardService = {
  // 分析文本中的API Key
  async analyzeText(text: string): Promise<AnalyzedKey[]> {
    try {
      // 调用Tauri后端命令
      return await invoke("analyze_clipboard_text", { text });
    } catch (error) {
      console.error("分析文本失败:", error);
      return [];
    }
  },

  // 导入分析的API Key
  async importAnalyzedKeys(keys: AnalyzedKey[]): Promise<boolean> {
    try {
      // 调用Tauri后端命令
      return await invoke("import_analyzed_keys", { keys });
    } catch (error) {
      console.error("导入分析的API Key失败:", error);
      return false;
    }
  },

  // 检查Ollama服务状态
  async checkOllamaStatus(): Promise<boolean> {
    try {
      // 调用Tauri后端命令
      return await invoke("check_ollama_status");
    } catch (error) {
      console.error("检查Ollama服务状态失败:", error);
      return false;
    }
  },
};