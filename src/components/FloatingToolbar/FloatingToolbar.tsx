import { useEffect, useRef, useState } from "react";
import { ApiKey } from "../../types/apiKey";
import { searchService } from "../../services/searchService";
import { RadialMenu } from "../RadialMenu/RadialMenu";
import { SearchResults } from "../SearchResults/SearchResults";
import { SearchIcon, PlusIcon, EllipsisIcon, GearIcon, CloseIcon } from "../Icon/Icon";
import { PROVIDERS, matchProvider } from "../../constants/providers";
import { AddApiKeyDialog } from "../AddApiKey/AddApiKeyDialog";
import { apiKeyService } from "../../services/apiKeyService";
import "./FloatingToolbar.css";

// 检查是否在Tauri环境中
const isTauri = typeof window !== 'undefined' && '__TAURI__' in window;

// 条件导入Tauri API
let getCurrentWebviewWindow: any = null;
if (isTauri) {
  try {
    import("@tauri-apps/api/webviewWindow").then(module => {
      getCurrentWebviewWindow = module.getCurrentWebviewWindow;
    }).catch(error => {
      console.warn("Failed to import Tauri webviewWindow API:", error);
    });
  } catch (error) {
    console.warn("Failed to import Tauri webviewWindow API:", error);
  }
}

interface FloatingToolbarProps {
  onClose: () => void;
}

export function FloatingToolbar({ onClose }: FloatingToolbarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<ApiKey[]>([]);
  const [providerLabel, setProviderLabel] = useState<string | undefined>(undefined);
  const [showRadialMenu, setShowRadialMenu] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth / 2 - 208, y: window.innerHeight / 2 - 28 });
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

  // 辅助：限制位置在屏幕范围内（允许部分超出，提供更好的拖拽体验）
  const clamp = (x: number, y: number) => {
    const width = toolbarRef.current?.offsetWidth || 360;
    const height = toolbarRef.current?.offsetHeight || 56;
    // 允许工具条部分超出屏幕边缘，但保留一定可见区域
    const maxX = window.innerWidth - 50; // 保留50px可见区域
    const maxY = window.innerHeight - 50;
    return { 
      x: Math.min(Math.max(-width + 50, x), maxX), 
      y: Math.min(Math.max(-height + 50, y), maxY) 
    };
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

  // 点击外部区域隐藏搜索结果
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setSearchResults([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const copyToClipboard = async (key: ApiKey) => {
    await apiKeyService.copyToClipboard(key.id);
    // 复制后隐藏搜索结果面板
    setSearchResults([]);
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
      el.style.position = 'fixed';
      el.style.zIndex = '50';
    }
  }, [position]);

  return (
    <div ref={wrapperRef} className="floating-toolbar-wrapper">
      {/* 工具条本体（无全屏遮罩） */}
      <div
        ref={toolbarRef}
        className={`floating-toolbar-container ${isDragging ? 'dragging' : ''}`}
        onMouseDown={handleDragStart}
      >
        {/* 搜索输入（内置前缀图标，圆角矩形） */}
        <div className="floating-toolbar-search-container">
          {/* 放大镜：固定在输入框左侧 16px 位置 */}
          <SearchIcon className="floating-toolbar-search-icon" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search API keys..."
            className="floating-toolbar-search-input"
          />
        </div>
        <div className="floating-toolbar-buttons">
          {/* 加号 */}
          <button
            className="floating-toolbar-button"
            onClick={() => setShowAddDialog(true)}
            aria-label="Add API Key"
          >
            <PlusIcon />
          </button>

          {/* 更多（环形菜单） */}
          <button
            className="floating-toolbar-button"
            onClick={() => setShowRadialMenu(true)}
            ref={moreBtnRef}
            aria-label="More"
          >
            <EllipsisIcon />
          </button>

          {/* 设置 */}
          <button
            className="floating-toolbar-button"
            aria-label="Settings"
          >
            <GearIcon />
          </button>

          {/* 最小化 */}
          <button
            className="floating-toolbar-button"
            onClick={async () => {
              // 仅在Tauri环境中调用
              if (isTauri && getCurrentWebviewWindow) {
                try {
                  // 隐藏窗口而不是关闭应用
                  await getCurrentWebviewWindow().hide();
                } catch (error) {
                  console.warn("Failed to hide window:", error);
                }
              }
            }}
            aria-label="Minimize"
          >
            <CloseIcon />
          </button>
        </div>

        {/* 拖拽说明：点击输入框或按钮不会触发拖拽 */}
        
        {/* 环形菜单 */}
        {showRadialMenu && (
          <div className="floating-toolbar-radial-menu">
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
        <SearchResults results={searchResults} onCopy={copyToClipboard} position={position} toolbarWidth={toolbarRef.current?.offsetWidth || 360} providerLabel={providerLabel} />
      )}

      {showAddDialog && (
        <AddApiKeyDialog 
          open={showAddDialog} 
          onClose={() => setShowAddDialog(false)} 
          onAdded={async()=>{
            if (searchTerm) {
              const res = await searchService.searchKeys(searchTerm);
              setSearchResults(res.data);
            }
          }} 
          position={position} 
          toolbarWidth={toolbarRef.current?.offsetWidth || 360} 
        />
      )}
    </div>
  );

}