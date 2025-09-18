import { useEffect, useRef, useState } from "react";
import { ApiKey } from "../../types/apiKey";
import { searchService } from "../../services/searchService";
import { RadialMenu } from "../RadialMenu/RadialMenu";
import { SearchResults } from "../SearchResults/SearchResults";
import { SearchIcon, PlusIcon, EllipsisIcon, GearIcon, CloseIcon } from "../Icon/Icon";
import { PROVIDERS, matchProvider } from "../../constants/providers";
import { AddApiKeyDialog } from "../AddApiKey/AddApiKeyDialog";
import { SettingsPanel } from "../SettingsPanel/SettingsPanel";
import { apiKeyService } from "../../services/apiKeyService";
import { useTheme } from "../../contexts/ThemeContext";
import "./FloatingToolbar.css";

// 检查是否在Tauri环境中
const isTauri = typeof window !== 'undefined' && '__TAURI__' in window;

interface FloatingToolbarProps {
  onClose: () => void;
}

export function FloatingToolbar({ onClose }: FloatingToolbarProps) {
  const { resolvedTheme } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<ApiKey[]>([]);
  const [providerLabel, setProviderLabel] = useState<string | undefined>(undefined);
  const [showRadialMenu, setShowRadialMenu] = useState(false);
  const [position, setPosition] = useState(() => {
    // 使用屏幕尺寸而不是窗口尺寸来计算初始位置
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    return {
      x: screenWidth / 2 - 180, // 工具条宽度360px的一半
      y: screenHeight / 4 - 28   // 工具条高度56px的一半，放在屏幕上1/4处
    };
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const toolbarRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const moreBtnRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [providerCounts, setProviderCounts] = useState<Record<string, number>>({});

  // 新增：用于管理当前显示的面板类型
  type ActivePanel = 'none' | 'radial' | 'search' | 'add' | 'settings';
  const [activePanel, setActivePanel] = useState<ActivePanel>('none');

  // 点击穿透状态管理 - 初始状态为false，确保工具条可以正常交互
  const [isClickThrough, setIsClickThrough] = useState(false);

  // 设置点击穿透模式 - 重新设计逻辑
  const setClickThrough = async (enabled: boolean) => {
    // 暂时禁用全局点击穿透，改为使用CSS pointer-events控制
    // 这样可以精确控制哪些区域可以点击
    setIsClickThrough(enabled);
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // 处理鼠标进入工具条区域 - 重新获得窗口焦点
  const handleMouseEnter = async () => {
    // 重新获得窗口焦点
    if (isTauri) {
      try {
        const { getCurrentWebviewWindow } = await import("@tauri-apps/api/webviewWindow");
        const window = getCurrentWebviewWindow();
        await window.setFocus();
      } catch (error) {
        console.warn("Failed to set window focus:", error);
      }
    }
  };

  const handleMouseLeave = () => {
    // 使用CSS pointer-events控制，不需要额外逻辑
  };

  // 辅助：获取屏幕尺寸并限制位置（允许在整个屏幕范围内拖拽）
  const clamp = (x: number, y: number) => {
    const width = toolbarRef.current?.offsetWidth || 360;
    const height = toolbarRef.current?.offsetHeight || 56;

    // 获取屏幕尺寸（而不是窗口尺寸）
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;

    // 允许工具条在整个屏幕范围内移动，但保留一定可见区域
    const maxX = screenWidth - 50; // 保留50px可见区域
    const maxY = screenHeight - 50;
    return {
      x: Math.min(Math.max(-width + 50, x), maxX),
      y: Math.min(Math.max(-height + 50, y), maxY)
    };
  };

  // 拖拽：仅当点击不在 input 或 button 上时启动
  const handleDragStart = async (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.tagName === 'INPUT' || target.closest('input')) return;

    // 点击工具条时重新获得焦点
    if (isTauri) {
      try {
        const { getCurrentWebviewWindow } = await import("@tauri-apps/api/webviewWindow");
        const window = getCurrentWebviewWindow();
        await window.setFocus();
      } catch (error) {
        console.warn("Failed to set window focus on drag start:", error);
      }
    }

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
      setActivePanel('none');
      return;
    }
    const results = await searchService.searchKeys(term);
    setSearchResults(results.data);
    // 隐藏其他面板
    setShowRadialMenu(false);
    setShowAddDialog(false);
    setShowSettingsPanel(false);
    setActivePanel('search');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  };

  // 点击外部区域隐藏所有面板
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      // 检查点击是否在工具栏内
      if (wrapperRef.current && wrapperRef.current.contains(target)) {
        return;
      }

      // 检查点击是否在任何面板内
      const panelSelectors = [
        '.settings-panel-container',
        '.add-api-key-dialog-container',
        '.radial-menu-overlay',
        '.search-results-container'
      ];

      const isClickInPanel = panelSelectors.some(selector => {
        const panel = document.querySelector(selector);
        return panel && panel.contains(target);
      });

      // 只有当点击既不在工具栏内也不在任何面板内时，才隐藏面板
      if (!isClickInPanel) {
        setSearchResults([]);
        setShowRadialMenu(false);
        setShowAddDialog(false);
        setShowSettingsPanel(false);
        setActivePanel('none');
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
    setActivePanel('none');
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
    // 隐藏环形菜单，显示搜索结果
    setShowRadialMenu(false);
    setActivePanel('search');
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
      el.style.setProperty('--wrapper-left', `${position.x}px`);
      el.style.setProperty('--wrapper-top', `${position.y}px`);
      el.classList.add('positioned');
    }
  }, [position]);

  return (
    <>
      <div ref={wrapperRef} className="floating-toolbar-wrapper">
        {/* 工具条本体（无全屏遮罩） */}
        <div
          ref={toolbarRef}
          className={`floating-toolbar-container ${isDragging ? 'dragging' : ''}`}
          onMouseDown={handleDragStart}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
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
              type="button"
              className="floating-toolbar-button"
              onClick={() => {
                // 隐藏其他面板
                setSearchResults([]);
                setShowRadialMenu(false);
                setShowSettingsPanel(false);
                // 显示添加对话框
                setShowAddDialog(true);
                setActivePanel('add');
              }}
              aria-label="Add API Key"
            >
              <PlusIcon />
            </button>

            {/* 更多（环形菜单） */}
            <button
              type="button"
              className="floating-toolbar-button"
              onClick={() => {
                // 隐藏其他面板
                setSearchResults([]);
                setShowAddDialog(false);
                setShowSettingsPanel(false);
                // 显示径向菜单
                setShowRadialMenu(true);
                setActivePanel('radial');
              }}
              ref={moreBtnRef}
              aria-label="More"
            >
              <EllipsisIcon />
            </button>

            {/* 设置 */}
            <button
              type="button"
              className="floating-toolbar-button"
              onClick={() => {
                // 隐藏其他面板
                setSearchResults([]);
                setShowAddDialog(false);
                setShowRadialMenu(false);
                // 显示设置面板
                setShowSettingsPanel(true);
                setActivePanel('settings');
              }}
              aria-label="Settings"
            >
              <GearIcon />
            </button>

            {/* 退出应用程序 */}
            <button
              type="button"
              className="floating-toolbar-button"
              onClick={async () => {
                console.log("Exit button clicked");
                // 仅在Tauri环境中调用
                if (isTauri) {
                  try {
                    console.log("Calling exit_application command");
                    // 调用Tauri命令退出应用程序
                    const { invoke } = await import("@tauri-apps/api/core");
                    await invoke("exit_application");
                    console.log("Exit command completed");
                  } catch (error) {
                    console.error("Failed to exit application:", error);
                  }
                } else {
                  console.log("Not in Tauri environment");
                }
              }}
              aria-label="Exit Application"
              title="退出应用程序"
            >
              <CloseIcon />
            </button>
          </div>

          {/* 拖拽说明：点击输入框或按钮不会触发拖拽 */}
          
          {/* 环形菜单 */}
          {activePanel === 'radial' && (
            <div className="floating-toolbar-radial-menu">
              <RadialMenu
                options={PROVIDERS.slice(0,6).map(p => ({
                  id: p.id,
                  label: p.label,
                  count: providerCounts[p.id] ?? 0,
                }))}
                onSelect={handleRadialSelect}
                onClose={() => {
                  setShowRadialMenu(false);
                  setActivePanel('none');
                }}
                
              />
            </div>
          )}
        </div>

        {/* 结果面板（统一组件） */}
        {activePanel === 'search' && searchResults.length > 0 && (
          <SearchResults results={searchResults} onCopy={copyToClipboard} position={position} toolbarWidth={toolbarRef.current?.offsetWidth || 360} providerLabel={providerLabel} />
        )}
      </div>

      {activePanel === 'add' && showAddDialog && (
        <AddApiKeyDialog 
          open={showAddDialog} 
          onClose={() => {
            setShowAddDialog(false);
            setActivePanel('none');
          }} 
          onAdded={async()=>{
            if (searchTerm) {
              const res = await searchService.searchKeys(searchTerm);
              setSearchResults(res.data);
              setActivePanel('search');
            } else {
              setActivePanel('none');
            }
          }} 
          position={position} 
          toolbarWidth={toolbarRef.current?.offsetWidth || 360} 
        />
      )}

      {activePanel === 'settings' && showSettingsPanel && (
        <SettingsPanel 
          open={showSettingsPanel} 
          onClose={() => {
            setShowSettingsPanel(false);
            setActivePanel('none');
          }} 
          position={position} 
          toolbarWidth={toolbarRef.current?.offsetWidth || 360} 
        />
      )}
    </>
  );

}