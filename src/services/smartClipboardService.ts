import { AnalyzedKey } from "../types/apiKey";

// 检查是否在 Tauri 环境中
const isTauriEnvironment = (): boolean => {
  return typeof window !== 'undefined' && window.__TAURI__ !== undefined;
};

// 动态导入 invoke 函数
const getInvokeFunction = () => {
  if (!isTauriEnvironment()) {
    return null;
  }
  try {
    return require("@tauri-apps/api/core").invoke;
  } catch {
    return null;
  }
};

// 智能剪贴板服务
export const smartClipboardService = {
  // 分析文本中的API Key
  async analyzeText(text: string): Promise<AnalyzedKey[]> {
    const invoke = getInvokeFunction();
    if (!invoke) {
      console.warn("不在 Tauri 环境中，无法分析文本");
      return [];
    }
    
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
    const invoke = getInvokeFunction();
    if (!invoke) {
      console.warn("不在 Tauri 环境中，无法导入分析的API Key");
      return false;
    }
    
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
    const invoke = getInvokeFunction();
    if (!invoke) {
      console.warn("不在 Tauri 环境中，无法检查Ollama服务状态");
      return false;
    }
    
    try {
      // 调用Tauri后端命令
      return await invoke("check_ollama_status");
    } catch (error) {
      console.error("检查Ollama服务状态失败:", error);
      return false;
    }
  },
};