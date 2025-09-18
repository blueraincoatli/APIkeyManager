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
import "./FloatingToolbar.css";

// 检查是否在Tauri环境中 - 更可靠的检测方法
const isTauri = typeof window !== 'undefined' && (
  '__TAURI__' in window ||
  '__TAURI_INTERNALS__' in window ||
  window.location.protocol === 'tauri:'
);

interface FloatingToolbarProps {
  onClose: () => void;
}

export function FloatingToolbar({ onClose }: FloatingToolbarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<ApiKey[]>([]);
  const [providerLabel, setProviderLabel] = useState<string | undefined>(undefined);
  const [showRadialMenu, setShowRadialMenu] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
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

  // 记住径向菜单打开前的窗口状态，用于恢复位置
  const [originalWindowState, setOriginalWindowState] = useState<{
    position: { x: number; y: number };
    size: { width: number; height: number };
  } | null>(null);



  useEffect(() => {
    inputRef.current?.focus();

    // 调试信息
    console.log("Tauri environment check:");
    console.log("- window.__TAURI__:", typeof window !== 'undefined' && '__TAURI__' in window);
    console.log("- window.__TAURI_INTERNALS__:", typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window);
    console.log("- window.location.protocol:", typeof window !== 'undefined' ? window.location.protocol : 'undefined');
    console.log("- isTauri result:", isTauri);
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

  const handleExitClick = async () => {
    if (!isTauri) {
      onClose();
      return;
    }

    try {
      const { invoke } = await import("@tauri-apps/api/core");
      await invoke("exit_application");
    } catch (error) {
      console.error("Failed to exit application via Tauri command:", error);
      onClose();
    }
  };

  const handleMouseLeave = () => {
    // 使用CSS pointer-events控制，不需要额外逻辑
  };



  // 拖拽：整个工具条可拖拽
  const handleDragStart = async (e: React.MouseEvent) => {
    if (e.button !== 0) return; // 只响应左键

    // 检查是否点击在交互元素上
    const target = e.target as HTMLElement;
    if (target.closest('.floating-toolbar-search-container') ||
        target.closest('.floating-toolbar-buttons') ||
        target.closest('.floating-toolbar-radial-menu') ||
        target.closest('.radial-menu-overlay')) {
      return; // 不处理交互元素的拖拽
    }

    console.log("Drag start triggered, isTauri:", isTauri);

    if (isTauri) {
      try {
        const { getCurrentWebviewWindow } = await import("@tauri-apps/api/webviewWindow");
        const window = getCurrentWebviewWindow();
        console.log("Starting window drag...");
        await window.startDragging();
      } catch (error) {
        console.warn("Failed to start window drag:", error);
      }
    } else {
      console.log("Not in Tauri environment, drag not available");
      // 在非Tauri环境中，可以显示提示信息
      alert("拖拽功能仅在Tauri应用中可用");
    }

    setIsDragging(true);
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDragEnd = () => setIsDragging(false);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mouseup", handleDragEnd);
    }
    return () => {
      document.removeEventListener("mouseup", handleDragEnd);
    };
  }, [isDragging]);

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

  // 以工具条为锚点调整窗口大小
  const adjustWindowSizeWithAnchor = async (newWidth: number, newHeight: number, anchorType: 'center' | 'top-left', saveOriginalState: boolean = false) => {
    try {
      const { getCurrentWebviewWindow } = await import("@tauri-apps/api/webviewWindow");
      const { LogicalSize, LogicalPosition } = await import("@tauri-apps/api/dpi");
      const window = getCurrentWebviewWindow();

      // 获取当前窗口的逻辑位置和尺寸（避免DPI缩放问题）
      const currentPosition = await window.outerPosition();
      const currentSize = await window.outerSize();
      const scaleFactor = await window.scaleFactor();

      // 转换为逻辑坐标
      const currentLogicalX = currentPosition.x / scaleFactor;
      const currentLogicalY = currentPosition.y / scaleFactor;
      const currentLogicalWidth = currentSize.width / scaleFactor;
      const currentLogicalHeight = currentSize.height / scaleFactor;

      console.log("Current window (logical):", {
        position: { x: currentLogicalX, y: currentLogicalY },
        size: { width: currentLogicalWidth, height: currentLogicalHeight },
        scaleFactor,
        newSize: { width: newWidth, height: newHeight }
      });

      // 如果需要保存原始状态（打开径向菜单时）
      if (saveOriginalState) {
        setOriginalWindowState({
          position: { x: currentLogicalX, y: currentLogicalY },
          size: { width: currentLogicalWidth, height: currentLogicalHeight }
        });
        console.log("Saved original window state for restoration");
      }

      if (anchorType === 'center') {
        // 径向菜单：保持工具条在窗口中心位置不变，上下扩展
        const heightDiff = newHeight - currentLogicalHeight;
        const newLogicalY = currentLogicalY - heightDiff / 2; // 向上移动一半高度差

        console.log("Before resize - center anchor:", {
          currentLogicalY,
          currentLogicalHeight,
          heightDiff,
          newLogicalY,
          newWidth,
          newHeight
        });

        // 先调整位置，再调整尺寸（避免跳跃）
        await window.setPosition(new LogicalPosition(currentLogicalX, newLogicalY));
        console.log("Position set, now setting size...");

        await window.setSize(new LogicalSize(newWidth, newHeight));
        console.log("Size set successfully");

        // 验证最终位置
        const finalPosition = await window.outerPosition();
        const finalSize = await window.outerSize();
        console.log("Final window state:", {
          position: {
            physical: finalPosition,
            logical: { x: finalPosition.x / scaleFactor, y: finalPosition.y / scaleFactor }
          },
          size: {
            physical: finalSize,
            logical: { width: finalSize.width / scaleFactor, height: finalSize.height / scaleFactor }
          }
        });
      } else {
        // 下拉面板：工具条通过CSS固定在顶部，只需调整窗口尺寸
        console.log("Before resize - top-positioned panels:", {
          currentLogicalX,
          currentLogicalY,
          currentLogicalWidth,
          currentLogicalHeight,
          newWidth,
          newHeight
        });

        // 对于下拉面板，工具条会通过CSS移动到顶部，所以只需要调整尺寸
        await window.setSize(new LogicalSize(newWidth, newHeight));
        console.log("Size set for top-positioned panels");

        // 验证最终状态
        const finalPosition = await window.outerPosition();
        const finalSize = await window.outerSize();
        console.log("Final window state:", {
          position: {
            physical: finalPosition,
            logical: { x: finalPosition.x / scaleFactor, y: finalPosition.y / scaleFactor }
          },
          size: {
            physical: finalSize,
            logical: { width: finalSize.width / scaleFactor, height: finalSize.height / scaleFactor }
          }
        });
      }
    } catch (error) {
      console.warn("Failed to adjust window size with anchor:", error);
    }
  };

  // 恢复到原始窗口状态
  const restoreOriginalWindowState = async () => {
    if (!originalWindowState) {
      console.warn("No original window state to restore");
      return;
    }

    try {
      const { getCurrentWebviewWindow } = await import("@tauri-apps/api/webviewWindow");
      const { LogicalSize, LogicalPosition } = await import("@tauri-apps/api/dpi");
      const window = getCurrentWebviewWindow();

      console.log("Restoring original window state:", originalWindowState);

      // 先恢复位置，再恢复尺寸
      await window.setPosition(new LogicalPosition(originalWindowState.position.x, originalWindowState.position.y));
      await window.setSize(new LogicalSize(originalWindowState.size.width, originalWindowState.size.height));

      console.log("Original window state restored successfully");

      // 清除保存的状态
      setOriginalWindowState(null);
    } catch (error) {
      console.warn("Failed to restore original window state:", error);
    }
  };

  // 动态调整窗口大小以适应弹出内容
  useEffect(() => {
    const adjustWindowSize = async () => {
      // 重新检查Tauri环境
      const isInTauri = typeof window !== 'undefined' && (
        '__TAURI__' in window ||
        '__TAURI_INTERNALS__' in window ||
        window.location.protocol === 'tauri:'
      );

      console.log("Window resize check - isInTauri:", isInTauri, "activePanel:", activePanel);

      if (!isInTauri) {
        console.log("Not in Tauri environment, skipping window resize");
        return;
      }

      if (activePanel === 'radial') {
        // 显示径向菜单时扩展窗口 - 使用中心锚点，并保存原始状态
        console.log("Setting window size for radial menu: 640x300");
        await adjustWindowSizeWithAnchor(640, 300, 'center', true);
      } else if (activePanel === 'search') {
        // 搜索结果面板 - 使用左上角锚点
        console.log("Setting window size for search: 420x500");
        await adjustWindowSizeWithAnchor(420, 500, 'top-left');
      } else if (activePanel === 'add' || activePanel === 'settings') {
        // 添加/设置面板 - 使用左上角锚点
        console.log("Setting window size for dialog panels: 420x600");
        await adjustWindowSizeWithAnchor(420, 600, 'top-left');
      } else {
        // 默认小窗口 - 恢复原始状态或使用默认尺寸
        if (originalWindowState) {
          console.log("Restoring original window state");
          await restoreOriginalWindowState();
        } else {
          console.log("Setting window size for default: 420x72");
          await adjustWindowSizeWithAnchor(420, 72, 'top-left');
        }
      }
      console.log("Window size adjustment completed successfully");
    };

    adjustWindowSize();
  }, [activePanel]);



  return (
    <>
      <div ref={wrapperRef} className={`floating-toolbar-wrapper ${
        activePanel === 'search' || activePanel === 'add' || activePanel === 'settings'
          ? 'top-positioned'
          : ''
      }`}>
        {/* 工具条本体（无全屏遮罩） */}
        <div
          ref={toolbarRef}
          className={`floating-toolbar-container ${isDragging ? 'dragging' : ''}`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseDown={handleDragStart}
          data-tauri-drag-region
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
              onClick={handleExitClick}
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
          <SearchResults results={searchResults} onCopy={copyToClipboard} providerLabel={providerLabel} />
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
        />
      )}

      {activePanel === 'settings' && showSettingsPanel && (
        <SettingsPanel
          open={showSettingsPanel}
          onClose={() => {
            setShowSettingsPanel(false);
            setActivePanel('none');
          }}
        />
      )}
    </>
  );

}