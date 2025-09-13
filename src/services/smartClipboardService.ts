import { AnalyzedKey } from "../types/apiKey";
import { logSecureError, logSecureWarning, OperationContext } from "./secureLogging";

// 检查是否在 Tauri 环境中
const isTauriEnvironment = (): boolean => {
  return typeof window !== 'undefined' && window.__TAURI__ !== undefined;
};

// 动态导入 invoke 函数
const getInvokeFunction = async () => {
  if (!isTauriEnvironment()) {
    return null;
  }
  try {
    const { invoke } = await import("@tauri-apps/api/core");
    return invoke;
  } catch {
    return null;
  }
};

// 智能剪贴板服务
export const smartClipboardService = {
  // 分析文本中的API Key
  async analyzeText(text: string): Promise<AnalyzedKey[]> {
    const invoke = await getInvokeFunction();
    if (!invoke) {
      logSecureWarning(OperationContext.CLIPBOARD_ANALYZE, "不在 Tauri 环境中，无法分析文本");
      return [];
    }

    try {
      // 调用Tauri后端命令
      return await invoke("analyze_clipboard_text", { text });
    } catch (error) {
      logSecureError(OperationContext.CLIPBOARD_ANALYZE, error);
      return [];
    }
  },

  // 导入分析的API Key
  async importAnalyzedKeys(keys: AnalyzedKey[]): Promise<boolean> {
    const invoke = await getInvokeFunction();
    if (!invoke) {
      logSecureWarning(OperationContext.CLIPBOARD_ANALYZE, "不在 Tauri 环境中，无法导入分析的API Key");
      return false;
    }

    try {
      // 调用Tauri后端命令
      return await invoke("import_analyzed_keys", { keys });
    } catch (error) {
      logSecureError(OperationContext.CLIPBOARD_ANALYZE, error, { operation: 'import_keys' });
      return false;
    }
  },

  // 检查Ollama服务状态
  async checkOllamaStatus(): Promise<boolean> {
    const invoke = await getInvokeFunction();
    if (!invoke) {
      logSecureWarning(OperationContext.OLLAMA_CHECK, "不在 Tauri 环境中，无法检查Ollama服务状态");
      return false;
    }

    try {
      // 调用Tauri后端命令
      return await invoke("check_ollama_status");
    } catch (error) {
      logSecureError(OperationContext.OLLAMA_CHECK, error);
      return false;
    }
  },
};