import { useEffect, useRef, useState } from "react";
import { ApiKey } from "../../types/apiKey";
import { searchService } from "../../services/searchService";
import { clipboardService } from "../../services/clipboardService";
import { useAdaptiveTheme } from "../../hooks/useAdaptiveTheme";
import { RadialMenu } from "../RadialMenu/RadialMenu";
import { SearchResults } from "../SearchResults/SearchResults";
import { SearchIcon, PlusIcon, EllipsisIcon, GearIcon, CloseIcon } from "../Icon/Icon";
import { PROVIDERS, matchProvider } from "../../constants/providers";
import { AddApiKeyDialog } from "../AddApiKey/AddApiKeyDialog";

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
  const inputRef = useRef<HTMLInputElement>(null);
  const { backgroundColor, textColor, borderColor } = useAdaptiveTheme(toolbarRef);
  const [showAddDialog, setShowAddDialog] = useState(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // 拖拽
  const handleDragStart = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    e.preventDefault();
  };
  const handleDragMove = (e: MouseEvent) => {
    if (isDragging) setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
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
    await clipboardService.copyToClipboard(key.keyValue);
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

  return (
    <div className="fixed z-50" style={{ left: position.x, top: position.y }}>
      {/* 工具条本体（无全屏遮罩） */}
      <div
        ref={toolbarRef}
        className="relative flex items-center rounded-full shadow-2xl border px-5 py-3 gap-2 backdrop-blur-2xl"
        style={{ backgroundColor, color: textColor, borderColor, boxShadow: "0 25px 50px -12px rgba(0,0,0,.25)" }}
      >
        {/* 放大镜图标 */}
        <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
          <SearchIcon />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search API keys..."
          className="flex-1 px-3 py-2 bg-white/20 backdrop-blur-sm border rounded-full focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent min-w-[260px] placeholder-white/70"
          style={{ color: textColor, borderColor, backgroundColor: textColor === "#ffffff" ? "rgba(255,255,255,.2)" : "rgba(26,28,65,.2)" }}
        />

        {/* 加号 */}
        <button className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all" onClick={() => setShowAddDialog(true)}>
          <PlusIcon />
        </button>

        {/* 更多（环形菜单） */}
        <button
          className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all"
          onClick={() => setShowRadialMenu(true)}
        >
          <EllipsisIcon />
        </button>

        {/* 设置 */}
        <button className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all">
          <GearIcon />
        </button>

        {/* 关闭 */}
        <button className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all" onClick={onClose}>
          <CloseIcon />
        </button>

        {/* 拖拽手柄 */}
        <div className="absolute inset-0 rounded-full" onMouseDown={handleDragStart} style={{ cursor: isDragging ? "grabbing" : "grab" }} />
      </div>

      {/* 结果面板（统一组件） */}
      {searchResults.length > 0 && (
        <SearchResults results={searchResults} onCopy={copyToClipboard} position={position} providerLabel={providerLabel} />
      )}

      {/* 环形菜单 */}
      {showRadialMenu && (
        
        // 以工具条右侧为中心点动态定位菜单
        
        
        <RadialMenu
          options={PROVIDERS.slice(0,5).map(p => ({ id: p.id, label: p.label, icon: p.label.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase() }))}
          onSelect={handleRadialSelect}
          onClose={() => setShowRadialMenu(false)}
          center={{
            x: position.x + (toolbarRef.current?.offsetWidth || 520) + 60,
            y: position.y + (toolbarRef.current?.offsetHeight || 56) / 2,
          }}
        />
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
