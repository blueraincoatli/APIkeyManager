import { useEffect, useRef, useState } from "react";
import { ApiKey } from "../../types/apiKey";
import { searchService } from "../../services/searchService";
import { RadialMenu } from "../RadialMenu/RadialMenu";
import { SearchResults } from "../SearchResults/SearchResults";
import { SearchIcon, PlusIcon, EllipsisIcon, GearIcon, CloseIcon } from "../Icon/Icon";
import { PROVIDERS, matchProvider } from "../../constants/providers";
import { AddApiKeyDialog } from "../AddApiKey/AddApiKeyDialog";
import { apiKeyService } from "../../services/apiKeyService";

interface FloatingToolbarProps {
  onClose: () => void;
}

export function FloatingToolbar({ onClose }: FloatingToolbarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<ApiKey[]>([]);
  const [providerLabel, setProviderLabel] = useState<string | undefined>(undefined);
  const [showRadialMenu, setShowRadialMenu] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth / 2 - 260, y: 120 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const toolbarRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const moreBtnRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [providerCounts, setProviderCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // 辅助：限制位置不超出视口
  const clamp = (x: number, y: number) => {
    const width = toolbarRef.current?.offsetWidth || 520;
    const height = toolbarRef.current?.offsetHeight || 56;
    const maxX = Math.max(0, window.innerWidth - width);
    const maxY = Math.max(0, window.innerHeight - height);
    return { x: Math.min(Math.max(0, x), maxX), y: Math.min(Math.max(0, y), maxY) };
  };

  // 拖拽：仅当点击不在 input 或 button 上时启动
  const handleDragStart = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.tagName === 'INPUT' || target.closest('input')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    e.preventDefault();
  };
  const handleDragMove = (e: MouseEvent) => {
    if (isDragging) {
      const next = { x: e.clientX - dragStart.x, y: e.clientY - dragStart.y };
      const clamped = clamp(next.x, next.y);
      setPosition(clamped);
    }
  };
  const handleDragEnd = () => setIsDragging(false);
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

  // 搜索
  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    setProviderLabel(undefined);
    if (term.trim() === "") {
      setSearchResults([]);
      return;
    }
    const results = await searchService.searchKeys(term);
    setSearchResults(results.data);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  };

  const copyToClipboard = async (key: ApiKey) => {
    await apiKeyService.copyToClipboard(key.id);
  };

  // 选择环形菜单项（按提供商过滤）
  const handleRadialSelect = async (id: string) => {
    const def = PROVIDERS.find((p) => p.id === id);
    const label = def?.label || id;
    setProviderLabel(label);
    // 先按标签关键词检索，随后以 platform/name/tags 进行精确过滤（与数据结构对齐）
    const res = await searchService.searchKeys(label);
    const filtered = (res.data || []).filter((k) => matchProvider(k.name, k.platform, k.tags, id));
    setSearchResults(filtered.length ? filtered : res.data);
  };

  // 打开环形菜单时，统计各提供商的 key 数量并展示在按钮上
  useEffect(() => {
    const loadCounts = async () => {
      if (!showRadialMenu) return;
      const res = await apiKeyService.listApiKeys();
      const keys = res.success ? res.data || [] : [];
      const counts: Record<string, number> = {};
      for (const p of PROVIDERS) {
        counts[p.id] = keys.filter(k => matchProvider(k.name, k.platform, k.tags, p.id)).length;
      }
      setProviderCounts(counts);
    };
    loadCounts();
  }, [showRadialMenu]);

  useEffect(() => {
    const el = wrapperRef.current;
    if (el) {
      el.style.left = `${position.x}px`;
      el.style.top = `${position.y}px`;
    }
  }, [position]);

  return (
    <div ref={wrapperRef} className="fixed z-50">
      {/* 工具条本体（无全屏遮罩） */}
      <div
        ref={toolbarRef}
        className={`relative grid grid-cols-[1fr_auto] items-center h-[56px] rounded-full shadow-2xl glass px-[32px] md:px-[40px] gap-4 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} text-gray-900 dark:text-white`}
        onMouseDown={handleDragStart}
      >
        {/* 搜索输入（内置前缀图标，圆角矩形） */}
        <div className="relative z-0 flex-1 min-w-[248px]">
          {/* 放大镜：固定在输入框左侧 16px 位置 */}
          <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 opacity-70" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search API keys..."
            className="w-[calc(100%-3rem)] pl-[32px] pr-4 py-3 bg-transparent backdrop-blur-xl bg-clip-padding border border-white/30 dark:border-white/20 rounded-full focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent placeholder-white/70 shadow-none text-gray-700 dark:text-gray-100"
          />
        </div>
        <div className="relative z-10 flex items-center gap-4">
          {/* 加号 */}
          <button
            className="w-10 h-10 inline-flex items-center justify-center rounded-full hover:bg-white/10 focus:outline-none transition-colors p-0 border-0 bg-transparent shadow-none"
            onClick={() => setShowAddDialog(true)}
            aria-label="Add API Key"
          >
            <PlusIcon />
          </button>

          {/* 更多（环形菜单） */}
          <button
            className="w-10 h-10 inline-flex items-center justify-center rounded-full hover:bg-white/10 focus:outline-none transition-colors p-0 border-0 bg-transparent shadow-none"
            onClick={() => setShowRadialMenu(true)}
            ref={moreBtnRef}
            aria-label="More"
          >
            <EllipsisIcon />
          </button>

          {/* 设置 */}
          <button
            className="w-10 h-10 inline-flex items-center justify-center rounded-full hover:bg-white/10 focus:outline-none transition-colors p-0 border-0 bg-transparent shadow-none"
            aria-label="Settings"
          >
            <GearIcon />
          </button>

          {/* 关闭 */}
          <button
            className="w-10 h-10 inline-flex items-center justify-center rounded-full hover:bg-white/10 focus:outline-none transition-colors p-0 border-0 bg-transparent shadow-none"
            onClick={onClose}
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>

        {/* 拖拽说明：点击输入框或按钮不会触发拖拽 */}
        
        {/* 环形菜单 */}
        {showRadialMenu && (
          <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 z-50">
            <RadialMenu
              options={PROVIDERS.slice(0,6).map(p => ({
                id: p.id,
                label: p.label,
                count: providerCounts[p.id] ?? 0,
              }))}
              onSelect={handleRadialSelect}
              onClose={() => setShowRadialMenu(false)}
              anchor={() => {
                const rect = moreBtnRef.current?.getBoundingClientRect();
                if (!rect) return undefined;
                // 返回相对于工具条容器的坐标
                const toolbarRect = toolbarRef.current?.getBoundingClientRect();
                if (!toolbarRect) return undefined;
                return { 
                  x: rect.left - toolbarRect.left + rect.width/2, 
                  y: rect.top - toolbarRect.top + rect.height / 2 
                };
              }}
            />
          </div>
        )}
      </div>

      {/* 结果面板（统一组件） */}
      {searchResults.length > 0 && (
        <SearchResults results={searchResults} onCopy={copyToClipboard} position={position} providerLabel={providerLabel} />
      )}

      {showAddDialog && (
        <AddApiKeyDialog open={showAddDialog} onClose={() => setShowAddDialog(false)} onAdded={async()=>{
          if (searchTerm) {
            const res = await searchService.searchKeys(searchTerm);
            setSearchResults(res.data);
          }
        }} />
      )}
    </div>
  );

}