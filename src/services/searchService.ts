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
      
      // Web 环境（无 Tauri）回退：使用内存数据进行本地过滤，避免报错阻断 UI
      const isTauri = typeof window !== 'undefined' && (window as any).__TAURI__;
      if (!isTauri) {
        const now = Date.now();
        const demoData: ApiKey[] = [
          // OpenAI Keys
          { id: 'openai_1', name: 'OpenAI Production Key', keyValue: 'sk-xxxxx-demo1', platform: 'openai', description: 'Production API key for OpenAI', createdAt: now - 86400000 * 30, updatedAt: now - 86400000 * 5, tags: ['ai', 'nlp', 'production'] },
          { id: 'openai_2', name: 'OpenAI Development Key', keyValue: 'sk-xxxxx-demo2', platform: 'openai', description: 'Development API key for OpenAI', createdAt: now - 86400000 * 15, updatedAt: now - 86400000 * 2, tags: ['ai', 'nlp', 'development'] },
          { id: 'openai_3', name: 'OpenAI Testing Key', keyValue: 'sk-xxxxx-demo3', platform: 'openai', description: 'Testing API key for OpenAI', createdAt: now - 86400000 * 7, updatedAt: now - 86400000 * 1, tags: ['ai', 'nlp', 'testing'] },
          
          // Claude Keys
          { id: 'claude_1', name: 'Claude API Key', keyValue: 'sk-ant-xxxxx-demo1', platform: 'claude', description: 'Anthropic Claude API key', createdAt: now - 86400000 * 20, updatedAt: now - 86400000 * 3, tags: ['ai', 'nlp'] },
          { id: 'claude_2', name: 'Claude Sonnet Key', keyValue: 'sk-ant-xxxxx-demo2', platform: 'claude', description: 'Anthropic Claude Sonnet API key', createdAt: now - 86400000 * 10, updatedAt: now - 86400000 * 1, tags: ['ai', 'nlp'] },
          
          // Google Gemini Keys
          { id: 'gemini_1', name: 'Google Gemini Pro Key', keyValue: 'xxxxx-demo1', platform: 'gemini', description: 'Google Gemini Pro API key', createdAt: now - 86400000 * 25, updatedAt: now - 86400000 * 4, tags: ['ai', 'nlp'] },
          
          // GitHub Tokens
          { id: 'github_1', name: 'GitHub Personal Access Token', keyValue: 'ghp_xxxxx-demo1', platform: 'github', description: 'Personal access token for GitHub', createdAt: now - 86400000 * 40, updatedAt: now - 86400000 * 10, tags: ['code', 'git'] },
          { id: 'github_2', name: 'GitHub CI/CD Token', keyValue: 'ghs_xxxxx-demo1', platform: 'github', description: 'CI/CD token for GitHub Actions', createdAt: now - 86400000 * 5, updatedAt: now - 86400000 * 1, tags: ['ci', 'cd'] },
          
          // AWS Keys
          { id: 'aws_1', name: 'AWS Access Key', keyValue: 'AKIAxxxxx-demo1', platform: 'aws', description: 'AWS access key for production services', createdAt: now - 86400000 * 60, updatedAt: now - 86400000 * 15, tags: ['cloud', 'production'] },
          
          // Azure Keys
          { id: 'azure_1', name: 'Azure API Key', keyValue: 'xxxxx-demo1', platform: 'azure', description: 'Microsoft Azure API key', createdAt: now - 86400000 * 35, updatedAt: now - 86400000 * 8, tags: ['cloud', 'ai'] },
          
          // Stability AI Keys
          { id: 'stability_1', name: 'Stability AI Key', keyValue: 'xxxxx-demo1', platform: 'stability', description: 'Stability AI API key for image generation', createdAt: now - 86400000 * 12, updatedAt: now - 86400000 * 3, tags: ['ai', 'image'] },
        ];
        const q = (keyword || '').trim().toLowerCase();
        if (!q) return { data: demoData, error: undefined };
        const filtered = demoData.filter(k => {
          const hay = `${k.name} ${k.platform || ''} ${k.description || ''} ${(k as any).tags?.join(' ') || ''}`.toLowerCase();
          return hay.includes(q);
        });
        return { data: filtered, error: undefined };
      }

      // 调用Tauri后端命令
      const result = await invoke("search_api_keys", { keyword });
      return { data: result as ApiKey[], error: undefined };
    } catch (error) {
      logSecureError(OperationContext.API_KEY_SEARCH, error);
      return { data: [], error: getUserFriendlyErrorMessage(OperationContext.API_KEY_SEARCH) };
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
