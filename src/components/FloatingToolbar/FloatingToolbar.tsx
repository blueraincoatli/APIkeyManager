import { useState, useEffect, useRef } from "react";
import { ApiKey } from "../../types/apiKey";
import { searchService } from "../../services/searchService";
import { clipboardService } from "../../services/clipboardService";

interface FloatingToolbarProps {
  onClose: () => void;
}

export function FloatingToolbar({ onClose }: FloatingToolbarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<ApiKey[]>([]);
  const [showRadialMenu, setShowRadialMenu] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth / 2 - 200, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const toolbarRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 聚焦搜索框
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // 处理拖拽开始
  const handleDragStart = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // 只响应左键
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
    e.preventDefault(); // 防止默认行为
  };

  // 处理拖拽移动
  const handleDragMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  // 处理拖拽结束
  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // 添加事件监听器
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleDragMove);
      document.addEventListener("mouseup", handleDragEnd);
    }
    
    return () => {
      document.removeEventListener("mousemove", handleDragMove);
      document.removeEventListener("mouseup", handleDragEnd);
    };
  }, [isDragging, dragStart]);

  // 处理搜索
  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    if (term.trim() === "") {
      setSearchResults([]);
      return;
    }

    const results = await searchService.searchKeys(term);
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

  return (
    <div 
      className="fixed z-50"
      style={{ left: position.x, top: position.y }}
    >
      {/* 背景遮罩 */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-0"
        onClick={onClose}
      />
      
      {/* 浮动工具条 */}
      <div 
        ref={toolbarRef}
        className="flex items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-full shadow-xl border border-white/30 dark:border-gray-700/30 px-4 py-2 space-x-3 bg-gradient-to-r from-white/80 to-gray-100/80 dark:from-gray-800/80 dark:to-gray-900/80"
      >
        {/* 设置按钮 - 圆形 */}
        <button className="w-8 h-8 rounded-full bg-gray-200/50 dark:bg-gray-700/50 flex items-center justify-center hover:bg-gray-300/50 dark:hover:bg-gray-600/50 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        {/* 搜索框 */}
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="搜索API Key..."
          className="flex-1 px-4 py-2 bg-white/70 dark:bg-gray-700/70 border-none rounded-full focus:outline-none focus:ring-0 min-w-[200px] backdrop-blur-sm cursor-text"
        />
        
        {/* 弹出菜单按钮 - 圆形 */}
        <button 
          className="w-8 h-8 rounded-full bg-gray-200/50 dark:bg-gray-700/50 flex items-center justify-center hover:bg-gray-300/50 dark:hover:bg-gray-600/50 transition-colors"
          onClick={() => setShowRadialMenu(!showRadialMenu)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        {/* 关闭按钮 - 圆形 */}
        <button 
          className="w-8 h-8 rounded-full bg-gray-200/50 dark:bg-gray-700/50 flex items-center justify-center hover:bg-gray-300/50 dark:hover:bg-gray-600/50 transition-colors"
          onClick={onClose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* 拖拽手柄 - 改进位置和可见性 */}
        <div 
          className="absolute top-0 left-0 w-full h-full rounded-full"
          onMouseDown={handleDragStart}
        />
      </div>

      {/* 搜索结果 */}
      {searchResults.length > 0 && (
        <div className="absolute top-full left-0 mt-2 w-full max-w-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-lg shadow-xl border border-white/30 dark:border-gray-700/30 overflow-hidden bg-gradient-to-b from-white/90 to-gray-100/90 dark:from-gray-800/90 dark:to-gray-900/90">
          <div className="max-h-80 overflow-y-auto">
            <ul className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
              {searchResults.slice(0, 5).map((key) => (
                <li 
                  key={key.id} 
                  className="p-3 hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors duration-150"
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
            {searchResults.length > 5 && (
              <div className="p-2 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200/50 dark:border-gray-700/50">
                显示前5个结果，共{searchResults.length}个匹配项
              </div>
            )}
          </div>
        </div>
      )}

      {/* 径向菜单 */}
      {showRadialMenu && (
        <div className="absolute top-1/2 right-0 transform translate-x-full -translate-y-1/2">
          <div className="relative w-48 h-48">
            {/* 示例平台选项 */}
            {["AWS", "Google Cloud", "Azure", "GitHub", "GitLab"].map((platform, index) => {
              // 计算选项位置（沿弧线排列）
              const angle = (index * 45) - 90; // 从顶部开始，顺时针排列
              const radius = 100; // 半径
              const x = radius * Math.cos(angle * Math.PI / 180);
              const y = radius * Math.sin(angle * Math.PI / 180);
              
              return (
                <button
                  key={platform}
                  className="absolute flex items-center justify-center w-32 h-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-full shadow-lg border border-white/30 dark:border-gray-700/30 transition-all duration-200 hover:scale-105 hover:bg-white/90 dark:hover:bg-gray-700/90 text-sm font-medium text-gray-700 dark:text-gray-300"
                  style={{
                    left: `calc(50% + ${x}px - 64px)`,
                    top: `calc(50% + ${y}px - 20px)`,
                  }}
                >
                  {platform}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}