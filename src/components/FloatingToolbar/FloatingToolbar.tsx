import { useState, useEffect, useRef } from "react";
import { ApiKey } from "../../types/apiKey";
import { searchService } from "../../services/searchService";
import { clipboardService } from "../../services/clipboardService";
import { useAdaptiveTheme } from "../../hooks/useAdaptiveTheme";

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
  const { backgroundColor, textColor, borderColor } = useAdaptiveTheme(toolbarRef);

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
        className="flex items-center backdrop-blur-2xl rounded-full shadow-2xl border px-6 py-3 space-x-4 transition-all duration-300"
        style={{
          backgroundColor,
          color: textColor,
          borderColor,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
      >
        {/* 设置按钮 - 圆形 */}
        <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all duration-200 hover:scale-110">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
        
        {/* 搜索框 */}
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search API keys..."
          className="flex-1 px-5 py-2.5 bg-white/20 backdrop-blur-sm border rounded-full focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent min-w-[250px] placeholder-white/70 transition-all duration-200"
          style={{ 
            color: textColor,
            borderColor: borderColor,
            backgroundColor: textColor === '#ffffff' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(26, 28, 65, 0.2)'
          }}
        />
        
        {/* 弹出菜单按钮 - 圆形 */}
        <button 
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all duration-200 hover:scale-110"
          onClick={() => setShowRadialMenu(!showRadialMenu)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {/* 关闭按钮 - 圆形 */}
        <button 
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all duration-200 hover:scale-110"
          onClick={onClose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* 拖拽手柄 - 改进位置和可见性 */}
        <div 
          className="absolute top-0 left-0 w-full h-full rounded-full cursor-move"
          onMouseDown={handleDragStart}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        />
      </div>

      {/* 搜索结果 */}
      {searchResults.length > 0 && (
        <div className="absolute top-full left-0 mt-3 w-full max-w-md backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden transition-all duration-300"
             style={{
               backgroundColor,
               color: textColor,
               boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
             }}>
          <div className="max-h-80 overflow-y-auto">
            <ul className="divide-y divide-white/10">
              {searchResults.slice(0, 5).map((key) => (
                <li 
                  key={key.id} 
                  className="p-4 hover:bg-white/10 transition-colors duration-200 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">
                        {key.name}
                      </div>
                      <div className="text-sm opacity-80 truncate">
                        {key.keyValue.replace(/(.{3}).*(.{3})/, "$1***$2")}
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(key)}
                      className="ml-3 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200 hover:scale-105 text-sm font-medium"
                    >
                      Copy
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            {searchResults.length > 5 && (
              <div className="p-3 text-center text-sm opacity-70 border-t border-white/10">
                Showing 5 of {searchResults.length} results
              </div>
            )}
          </div>
        </div>
      )}

      {/* 径向菜单 */}
      {showRadialMenu && (
        <div className="absolute top-1/2 right-0 transform translate-x-full -translate-y-1/2">
          <div className="relative w-64 h-64">
            {/* 胶囊形菜单选项 */}
            {["AWS", "Google Cloud", "Azure", "GitHub", "GitLab"].map((platform, index) => {
              // 计算选项位置（沿弧线排列）
              const angle = (index * 45) - 90;
              const radius = 120;
              const x = radius * Math.cos(angle * Math.PI / 180);
              const y = radius * Math.sin(angle * Math.PI / 180);
              
              return (
                <button
                  key={platform}
                  className="absolute flex items-center justify-center px-6 py-3 backdrop-blur-xl rounded-full shadow-lg border border-white/20 transition-all duration-200 hover:scale-105 hover:shadow-xl"
                  style={{
                    left: `calc(50% + ${x}px - 80px)`,
                    top: `calc(50% + ${y}px - 24px)`,
                    backgroundColor,
                    color: textColor,
                  }}
                >
                  <span className="font-medium">{platform}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}