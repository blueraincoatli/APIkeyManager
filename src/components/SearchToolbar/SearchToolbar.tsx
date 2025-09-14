import { useState, useEffect, useRef } from "react";
import { ApiKey } from "../../types/apiKey";
import { searchOptimizationService } from "../../services/searchOptimizationService";
import { clipboardService } from "../../services/clipboardService";
import { debounced } from "../../utils/debounce";
import { SearchSuggestions } from "./SearchSuggestions";
import { UI_CONSTANTS } from "../../constants";

interface SearchToolbarProps {
  onClose: () => void;
}

export function SearchToolbar({ onClose }: SearchToolbarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<ApiKey[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // 创建防抖搜索函数 - 300ms延迟
  const { fn: debouncedSearch, cancel } = debounced(async (term: string) => {
    if (term.trim() === "") {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchOptimizationService.smartSearch(term);
      setSearchResults(results.data);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, UI_CONSTANTS.ANIMATION_DURATION.MEDIUM);

  // 聚焦搜索框
  useEffect(() => {
    inputRef.current?.focus();

    // 组件卸载时清理防抖定时器
    return () => {
      cancel();
    };
  }, [cancel]);

  // 处理搜索
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setShowSuggestions(term.trim().length > 1);
    debouncedSearch(term);
  };

  // 处理搜索建议选择
  const handleSuggestionSelect = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    debouncedSearch(suggestion);
  };

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  // 复制API Key到剪贴板
  const copyToClipboard = async (key: ApiKey) => {
    await clipboardService.copyToClipboard(key.keyValue);
    // 可以添加一些用户反馈，比如显示"已复制"提示
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
      {/* 背景遮罩 */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* 搜索工具条 */}
      <div className="relative z-10 w-full max-w-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl shadow-2xl border border-white/30 dark:border-gray-700/30 overflow-hidden bg-gradient-to-b from-white/80 to-gray-100/80 dark:from-gray-800/80 dark:to-gray-900/80">
        {/* 搜索框 */}
        <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowSuggestions(searchTerm.trim().length > 1)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), UI_CONSTANTS.ANIMATION_DURATION.SHORT)}
              placeholder="搜索API Key..."
              className="w-full px-4 py-3 bg-white/70 dark:bg-gray-700/70 border border-gray-300/50 dark:border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent backdrop-blur-sm cursor-text"
            />
            <button
              onClick={onClose}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full bg-gray-200/50 dark:bg-gray-700/50 flex items-center justify-center hover:bg-gray-300/50 dark:hover:bg-gray-600/50 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </button>

            {/* 搜索建议 */}
            <SearchSuggestions
              keyword={searchTerm}
              onSelect={handleSuggestionSelect}
              visible={showSuggestions}
            />
          </div>
        </div>

        {/* 搜索结果 */}
        <div className="max-h-96 overflow-y-auto">
          {isSearching ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span>搜索中...</span>
              </div>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              {searchTerm ? "未找到匹配的API Key" : "输入关键词搜索API Key"}
            </div>
          ) : (
            <ul className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
              {searchResults.slice(0, UI_CONSTANTS.LIMITS.MAX_SEARCH_RESULTS).map((key) => (
                <li 
                  key={key.id} 
                  className="p-4 hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 dark:text-white truncate">
                        {key.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {/* 部分字符用xxx替代 */}
                        {key.keyValue.replace(/(.{3}).*(.{3})/, "$1***$2")}
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(key)}
                      className="ml-2 w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm flex items-center justify-center"
                    >
                      复制
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {searchResults.length > UI_CONSTANTS.LIMITS.MAX_SEARCH_RESULTS && (
            <div className="p-2 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200/50 dark:border-gray-700/50">
              显示前{UI_CONSTANTS.LIMITS.MAX_SEARCH_RESULTS}个结果，共{searchResults.length}个匹配项
            </div>
          )}
        </div>
      </div>
    </div>
  );
}