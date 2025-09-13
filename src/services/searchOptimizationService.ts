/**
 * 搜索优化服务
 * 提供搜索缓存、结果排序、智能搜索建议等功能
 */

import { ApiKey } from "../types/apiKey";
import { searchService } from "./searchService";

// 缓存接口
interface SearchCache {
  keyword: string;
  results: ApiKey[];
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

// 搜索建议接口
interface SearchSuggestion {
  text: string;
  type: 'name' | 'platform' | 'description';
  frequency: number;
}

// 搜索配置接口
interface SearchConfig {
  cacheEnabled: boolean;
  cacheTTL: number; // 5 minutes
  maxCacheSize: number;
  enableSuggestions: boolean;
  enableFuzzySearch: boolean;
  maxResults: number;
}

// 默认配置
const DEFAULT_SEARCH_CONFIG: SearchConfig = {
  cacheEnabled: true,
  cacheTTL: 5 * 60 * 1000, // 5 minutes
  maxCacheSize: 100,
  enableSuggestions: true,
  enableFuzzySearch: true,
  maxResults: 50
};

export class SearchOptimizationService {
  private cache: Map<string, SearchCache> = new Map();
  private suggestions: SearchSuggestion[] = [];
  private config: SearchConfig = DEFAULT_SEARCH_CONFIG;

  constructor(config?: Partial<SearchConfig>) {
    this.config = { ...DEFAULT_SEARCH_CONFIG, ...config };
    this.startCacheCleanup();
  }

  /**
   * 搜索API Keys（带缓存）
   */
  async searchKeys(keyword: string): Promise<{ data: ApiKey[]; error?: string }> {
    // 验证输入
    if (!keyword || typeof keyword !== 'string') {
      return { data: [], error: "搜索关键词无效" };
    }

    const trimmedKeyword = keyword.trim();
    if (trimmedKeyword.length === 0) {
      return { data: [], error: "搜索关键词不能为空" };
    }

    // 检查缓存
    if (this.config.cacheEnabled) {
      const cachedResult = this.getFromCache(trimmedKeyword);
      if (cachedResult) {
        return { data: cachedResult, error: undefined };
      }
    }

    // 执行搜索
    const result = await searchService.searchKeys(trimmedKeyword);

    // 缓存结果
    if (this.config.cacheEnabled && !result.error && result.data.length > 0) {
      this.addToCache(trimmedKeyword, result.data);
    }

    // 更新搜索建议
    if (this.config.enableSuggestions && result.data.length > 0) {
      this.updateSuggestions(trimmedKeyword, result.data);
    }

    return result;
  }

  /**
   * 智能搜索（支持模糊搜索）
   */
  async smartSearch(keyword: string): Promise<{ data: ApiKey[]; error?: string }> {
    if (!this.config.enableFuzzySearch) {
      return this.searchKeys(keyword);
    }

    const trimmedKeyword = keyword.trim();

    // 尝试精确搜索
    let result = await this.searchKeys(trimmedKeyword);

    // 如果精确搜索没有结果，尝试模糊搜索
    if (result.data.length === 0 && trimmedKeyword.length > 2) {
      result = await this.performFuzzySearch(trimmedKeyword);
    }

    return result;
  }

  /**
   * 获取搜索建议
   */
  getSuggestions(keyword: string, limit: number = 5): SearchSuggestion[] {
    if (!this.config.enableSuggestions || !keyword) {
      return [];
    }

    const trimmedKeyword = keyword.toLowerCase();

    return this.suggestions
      .filter(suggestion =>
        suggestion.text.toLowerCase().includes(trimmedKeyword)
      )
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, limit);
  }

  /**
   * 清理过期缓存
   */
  private cleanupCache(): void {
    const now = Date.now();

    for (const [key, cache] of this.cache.entries()) {
      if (now - cache.timestamp > cache.ttl) {
        this.cache.delete(key);
      }
    }

    // 如果缓存过大，删除最旧的条目
    if (this.cache.size > this.config.maxCacheSize) {
      const entries = Array.from(this.cache.entries())
        .sort((a, b) => a[1].timestamp - b[1].timestamp);

      const toDelete = entries.slice(0, this.cache.size - this.config.maxCacheSize);
      toDelete.forEach(([key]) => this.cache.delete(key));
    }
  }

  /**
   * 从缓存获取结果
   */
  private getFromCache(keyword: string): ApiKey[] | null {
    const cache = this.cache.get(keyword);
    if (!cache) {
      return null;
    }

    // 检查是否过期
    if (Date.now() - cache.timestamp > cache.ttl) {
      this.cache.delete(keyword);
      return null;
    }

    return cache.results;
  }

  /**
   * 添加结果到缓存
   */
  private addToCache(keyword: string, results: ApiKey[]): void {
    // 如果缓存已满，先清理
    if (this.cache.size >= this.config.maxCacheSize) {
      this.cleanupCache();
    }

    this.cache.set(keyword, {
      keyword,
      results,
      timestamp: Date.now(),
      ttl: this.config.cacheTTL
    });
  }

  /**
   * 更新搜索建议
   */
  private updateSuggestions(keyword: string, results: ApiKey[]): void {
    const words = keyword.toLowerCase().split(/\s+/);

    results.forEach(result => {
      // 从名称提取建议
      if (result.name) {
        this.addSuggestion(result.name.toLowerCase(), 'name');
      }

      // 从平台提取建议
      if (result.platform) {
        this.addSuggestion(result.platform.toLowerCase(), 'platform');
      }

      // 从描述提取建议
      if (result.description) {
        const descWords = result.description.toLowerCase().split(/\s+/);
        descWords.forEach(word => {
          if (word.length > 2) {
            this.addSuggestion(word, 'description');
          }
        });
      }
    });

    // 限制建议数量
    if (this.suggestions.length > 100) {
      this.suggestions = this.suggestions
        .sort((a, b) => b.frequency - a.frequency)
        .slice(0, 100);
    }
  }

  /**
   * 添加搜索建议
   */
  private addSuggestion(text: string, type: SearchSuggestion['type']): void {
    const existing = this.suggestions.find(s => s.text === text && s.type === type);

    if (existing) {
      existing.frequency++;
    } else {
      this.suggestions.push({
        text,
        type,
        frequency: 1
      });
    }
  }

  /**
   * 执行模糊搜索
   */
  private async performFuzzySearch(keyword: string): Promise<{ data: ApiKey[]; error?: string }> {
    try {
      // 获取所有API Keys
      const allKeysResult = await searchService.searchKeys('');
      if (allKeysResult.error) {
        return { data: [], error: allKeysResult.error };
      }

      // 简单的模糊匹配算法
      const fuzzyResults = allKeysResult.data.filter(key => {
        const searchText = `${key.name} ${key.platform || ''} ${key.description || ''}`.toLowerCase();
        const searchTerms = keyword.toLowerCase().split(/\s+/);

        return searchTerms.every(term =>
          searchText.includes(term) ||
          this.calculateSimilarity(term, searchText) > 0.6
        );
      });

      return { data: fuzzyResults.slice(0, this.config.maxResults), error: undefined };
    } catch (error) {
      return { data: [], error: "模糊搜索失败" };
    }
  }

  /**
   * 计算字符串相似度（简单的Levenshtein距离实现）
   */
  private calculateSimilarity(str1: string, str2: string): number {
    if (str1.length === 0 || str2.length === 0) {
      return 0;
    }

    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

    for (let i = 0; i <= str1.length; i++) {
      matrix[0][i] = i;
    }

    for (let j = 0; j <= str2.length; j++) {
      matrix[j][0] = j;
    }

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1, // deletion
          matrix[j - 1][i] + 1, // insertion
          matrix[j - 1][i - 1] + indicator // substitution
        );
      }
    }

    const distance = matrix[str2.length][str1.length];
    const maxLength = Math.max(str1.length, str2.length);

    return 1 - (distance / maxLength);
  }

  /**
   * 启动缓存清理定时器
   */
  private startCacheCleanup(): void {
    // 每2分钟清理一次缓存
    setInterval(() => {
      this.cleanupCache();
    }, 2 * 60 * 1000);
  }

  /**
   * 获取缓存统计
   */
  getCacheStats(): { size: number; entries: Array<{ keyword: string; age: number }> } {
    const now = Date.now();
    const entries = Array.from(this.cache.entries()).map(([keyword, cache]) => ({
      keyword,
      age: now - cache.timestamp
    }));

    return {
      size: this.cache.size,
      entries
    };
  }

  /**
   * 清除所有缓存
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * 更新配置
   */
  updateConfig(config: Partial<SearchConfig>): void {
    this.config = { ...this.config, ...config };

    // 如果禁用了缓存，清除现有缓存
    if (!config.cacheEnabled) {
      this.clearCache();
    }
  }
}

// 导出单例实例
export const searchOptimizationService = new SearchOptimizationService();