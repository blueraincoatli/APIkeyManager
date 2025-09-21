import { useEffect, useRef, useState, useMemo } from "react";
import { ApiKey } from "../../types/apiKey";
import { searchService } from "../../services/searchService";
import { RadialMenu } from "../RadialMenu/RadialMenu";
import { SearchResults } from "../SearchResults/SearchResults";
import { SearchIcon, PlusIcon, EllipsisIcon, GearIcon, CloseIcon } from "../Icon/Icon";
import { PROVIDERS, matchProvider } from "../../constants/providers";
import { AddApiKeyDialog } from "../AddApiKey/AddApiKeyDialog";
import { invoke } from "@tauri-apps/api/core";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { LogicalSize, LogicalPosition } from "@tauri-apps/api/dpi";
import { currentMonitor } from "@tauri-apps/api/window";
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
  // 新增：用于管理从数据库获取的platform数据
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [isLoadingPlatforms, setIsLoadingPlatforms] = useState(false);

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

    // 测试数据库连接
    const testDatabase = async () => {
      try {
        const result = await invoke("test_database");
        console.log("Database test result:", result);
      } catch (error) {
        console.error("Database test failed:", error);
      }
    };

    if (isTauri) {
      testDatabase();
    } else {
      console.log("Not in Tauri environment, skipping database test");
    }
  }, []);

  // 初始化窗口位置：水平居中，垂直在屏幕上1/3处
  useEffect(() => {
    const positionWindow = async () => {
      if (!isTauri) return;

      try {
        const window = getCurrentWebviewWindow();

        // 获取屏幕尺寸
        const monitor = await currentMonitor();
        if (monitor) {
          const scaleFactor = await window.scaleFactor();

          // 获取屏幕尺寸
          const screenWidth = monitor.size.width;
          const screenHeight = monitor.size.height;

          // 窗口尺寸（从配置文件）
          const windowWidth = 460;
          const windowHeight = 120;

          // 计算位置：水平居中，垂直在屏幕上1/3处
          const centerX = (screenWidth / scaleFactor - windowWidth) / 2;
          const upperThirdY = (screenHeight / scaleFactor) / 3 - windowHeight / 2;

          await window.setPosition(new LogicalPosition(centerX, upperThirdY));
          console.log(`Window positioned at: x=${centerX}, y=${upperThirdY} (screen: ${screenWidth}x${screenHeight})`);
          
          // 位置设置完成后显示窗口
          await window.show();
          console.log("Window shown after positioning");
        }
      } catch (error) {
        console.warn("Failed to position window:", error);
      }
    };

    // 延迟一点执行，确保窗口已经完全初始化
    const timer = setTimeout(positionWindow, 100);
    return () => clearTimeout(timer);
  }, []);

  // 处理鼠标进入工具条区域 - 重新获得窗口焦点
  const handleMouseEnter = async () => {
    // 重新获得窗口焦点
    if (isTauri) {
      try {
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

  // 处理platform选择
  const handlePlatformSelect = async (platform: string) => {
    setProviderLabel(platform);
    // 按platform搜索API keys
    const res = await searchService.searchKeys(platform);
    setSearchResults(res.data || []);
    // 隐藏环形菜单，显示搜索结果
    setShowRadialMenu(false);
    setActivePanel('search');
  };

  // 创建径向菜单选项
  const radialMenuOptions = useMemo(() => {
    // 使用从数据库获取的platforms数据（不再限制数量，滚轮滚动查看更多）
    const displayPlatforms = platforms;

    // 将platforms转换为径向菜单选项格式，并添加计数
    const platformOptions = displayPlatforms.map(platform => {
      // 计算该platform的API key数量
      const count = providerCounts[platform] || 0;
      return {
        id: platform,
        label: platform,
        count: count
      };
    });
    
    return platformOptions;
  }, [platforms, providerCounts]);

  // 打开环形菜单时，从数据库获取所有platform数据
  useEffect(() => {
    const loadPlatforms = async () => {
      if (!showRadialMenu) return;
      setIsLoadingPlatforms(true);
      try {
        // 获取所有platform
        const res = await apiKeyService.getAllPlatforms();
        if (res.success) {
          setPlatforms(res.data || []);
        }
        
        // 统计各提供商的 key 数量并展示在按钮上
        const keysRes = await apiKeyService.listApiKeys();
        const keys = keysRes.success ? keysRes.data || [] : [];
        const counts: Record<string, number> = {};
        
        // 统计静态PROVIDERS的数量
        for (const p of PROVIDERS) {
          counts[p.id] = keys.filter(k => matchProvider(k.name, k.platform, k.tags, p.id)).length;
        }
        
        // 统计数据库中platform的数量
        if (res.success && res.data) {
          for (const platform of res.data) {
            counts[platform] = keys.filter(k => k.platform === platform).length;
          }
        }
        
        setProviderCounts(counts);
      } catch (error) {
        console.error("Failed to load platforms:", error);
      } finally {
        setIsLoadingPlatforms(false);
      }
    };
    loadPlatforms();
  }, [showRadialMenu]); // 添加依赖数组

  const adjustWindowSizeWithAnchor = async (newWidth: number, newHeight: number, anchorType: 'center' | 'top-left', saveOriginalState: boolean = false) => {
    if (!isTauri) return;
    try {
      const window = getCurrentWebviewWindow();

      const currentPosition = await window.outerPosition();
      const currentSize = await window.outerSize();
      const scaleFactor = await window.scaleFactor();

      const currentLogicalX = currentPosition.x / scaleFactor;
      const currentLogicalY = currentPosition.y / scaleFactor;
      const currentLogicalWidth = currentSize.width / scaleFactor;
      const currentLogicalHeight = currentSize.height / scaleFactor;

      if (anchorType === 'center') {
        // Per user feedback, the window should always move up by the same amount
        // when opening the radial menu, regardless of the previous state.
        // This amount is calculated based on the transition from the BASE state (80px height).
        const baseHeight = 120; // 与配置文件中的初始高度保持一致
        const heightDiff = newHeight - baseHeight; // Always calculate diff from base height
        const newLogicalY = currentLogicalY - heightDiff / 2;

        // Only save state if coming from the small, non-top-positioned state.
        const isTopPositioned = wrapperRef.current?.classList.contains('top-positioned');
        if (saveOriginalState && !isTopPositioned) {
          setOriginalWindowState({
            position: { x: currentLogicalX, y: currentLogicalY },
            size: { width: currentLogicalWidth, height: currentLogicalHeight }
          });
        }

        await window.setPosition(new LogicalPosition(currentLogicalX, newLogicalY));
        await window.setSize(new LogicalSize(newWidth, newHeight));

      } else { // 'top-left'
        await window.setSize(new LogicalSize(newWidth, newHeight));
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
      if (!isTauri) return;

      if (activePanel === 'radial') {
        await adjustWindowSizeWithAnchor(640, 300, 'center', true);
      } else if (activePanel === 'search' || activePanel === 'add' || activePanel === 'settings') {
        await adjustWindowSizeWithAnchor(460, 600, 'top-left');
      } else {
        if (originalWindowState) {
          await restoreOriginalWindowState();
        } else {
          await adjustWindowSizeWithAnchor(460, 120, 'top-left'); // 与配置文件保持一致
        }
      }
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
              {isLoadingPlatforms ? (
                <div className="loading-indicator">Loading platforms...</div>
              ) : (
                <RadialMenu
                  options={radialMenuOptions}
                  onSelect={(id) => {
                    // 检查id是否是platform
                    if (platforms.includes(id)) {
                      handlePlatformSelect(id);
                    } else {
                      handleRadialSelect(id);
                    }
                  }}
                  onClose={() => {
                    setShowRadialMenu(false);
                    setActivePanel('none');
                  }}
                />
              )}
            </div>
          )}
        </div>

        {/* 结果面板（统一组件） */}
        {activePanel === 'search' && searchResults.length > 0 && (
          <SearchResults 
            results={searchResults} 
            onCopy={copyToClipboard} 
            providerLabel={providerLabel}
            onRefresh={async () => {
              // 重新搜索以刷新结果
              if (searchTerm) {
                const res = await searchService.searchKeys(searchTerm);
                setSearchResults(res.data);
              }
            }}
          />
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