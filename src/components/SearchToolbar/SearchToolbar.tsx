import { useState, useEffect, useRef } from "react";
import { ApiKey } from "../../types/apiKey";
import { searchService } from "../../services/searchService";
import { clipboardService } from "../../services/clipboardService";
import { RadialMenu } from "../RadialMenu/RadialMenu";

interface SearchToolbarProps {
  onClose: () => void;
}

export function SearchToolbar({ onClose }: SearchToolbarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<ApiKey[]>([]);
  const [showRadialMenu, setShowRadialMenu] = useState(false);
  const [selectedKey, setSelectedKey] = useState<ApiKey | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 聚焦搜索框
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // 处理搜索
  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    if (term.trim() === "") {
      setSearchResults([]);
      return;
    }

    const results = await searchService.searchKeys(term);
    // 修复类型错误：需要访问results.data
    setSearchResults(results.data);
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

  // 显示径向菜单
  const showRadial = (key: ApiKey) => {
    setSelectedKey(key);
    setShowRadialMenu(true);
  };

  // 编辑API Key（占位符功能）
  const editApiKey = () => {
    console.log("编辑API Key");
  };

  // 删除API Key（占位符功能）
  const deleteApiKey = () => {
    console.log("删除API Key");
  };

  // 查看API Key详情（占位符功能）
  const viewApiKeyDetails = () => {
    console.log("查看API Key详情");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
      {/* 背景遮罩 */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* 搜索工具条 */}
      <div className="relative z-10 w-full max-w-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden">
        {/* 搜索框 */}
        <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="搜索API Key..."
              className="w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-300/50 dark:border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent backdrop-blur-sm"
            />
            <button
              onClick={onClose}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* 搜索结果 */}
        <div className="max-h-96 overflow-y-auto">
          {searchResults.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              {searchTerm ? "未找到匹配的API Key" : "输入关键词搜索API Key"}
            </div>
          ) : (
            <ul className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
              {searchResults.map((key) => (
                <li 
                  key={key.id} 
                  className="p-4 hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {key.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {key.platform || "未指定平台"}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => copyToClipboard(key)}
                        className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                          <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => showRadial(key)}
                        className="p-2 rounded-lg bg-gray-500/10 hover:bg-gray-500/20 text-gray-600 dark:text-gray-400 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* 径向菜单 */}
      {showRadialMenu && selectedKey && (
        <RadialMenu 
          apiKey={selectedKey}
          onClose={() => setShowRadialMenu(false)}
          onCopy={() => {
            copyToClipboard(selectedKey);
            setShowRadialMenu(false);
          }}
          onEdit={editApiKey}
          onDelete={deleteApiKey}
          onDetails={viewApiKeyDetails}
        />
      )}
    </div>
  );
}