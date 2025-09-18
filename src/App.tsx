import { useState, useEffect } from "react";
import { FloatingToolbar } from "./components/FloatingToolbar/FloatingToolbar";
import ToastContainer from "./components/Toast/ToastContainer";
import { ErrorBoundary } from "./components/ErrorBoundary";
import "./App.css";
import "./styles/theme.css";

// 检查是否在Tauri环境中
const isTauri = typeof window !== 'undefined' && '__TAURI__' in window;

function App() {
  const [showFloatingToolbar, setShowFloatingToolbar] = useState(true);
  const [windowLabel, setWindowLabel] = useState<string | null>(null);

  // 检测backdrop-filter支持
  useEffect(() => {
    const checkBackdropFilterSupport = () => {
      const testElement = document.createElement('div');
      testElement.style.backdropFilter = 'blur(10px)';
      testElement.style.webkitBackdropFilter = 'blur(10px)';

      const supportsBackdropFilter = testElement.style.backdropFilter !== '';
      const supportsWebkitBackdropFilter = testElement.style.webkitBackdropFilter !== '';

      console.log('Backdrop-filter support details:', {
        backdropFilter: supportsBackdropFilter,
        webkitBackdropFilter: supportsWebkitBackdropFilter,
        testElementBackdropFilter: testElement.style.backdropFilter,
        testElementWebkitBackdropFilter: testElement.style.webkitBackdropFilter,
        userAgent: navigator.userAgent,
        isTauri: isTauri,
        protocol: window.location.protocol,
        href: window.location.href
      });

      // 添加CSS类来标识支持情况
      if (supportsBackdropFilter || supportsWebkitBackdropFilter) {
        document.body.classList.add('supports-backdrop-filter');
      } else {
        document.body.classList.add('no-backdrop-filter');
      }
    };

    checkBackdropFilterSupport();
  }, []);

  // 获取当前窗口标签
  useEffect(() => {
    const getWindowLabel = async () => {
      if (isTauri) {
        try {
          const { getCurrentWebviewWindow } = await import("@tauri-apps/api/webviewWindow");
          const window = getCurrentWebviewWindow();
          setWindowLabel(window.label);

          // 为浮动工具条窗口添加特殊类名
          if (window.label === "floating-toolbar") {
            document.body.classList.add("floating-toolbar-window");
          }
        } catch (error) {
          console.warn("Failed to get window label:", error);
          setWindowLabel("floating-toolbar"); // 默认为浮动工具条
          document.body.classList.add("floating-toolbar-window");
        }
      } else {
        // 非Tauri环境，默认为浮动工具条用于开发测试
        setWindowLabel("floating-toolbar");
        document.body.classList.add("floating-toolbar-window");
      }
    };

    getWindowLabel();
  }, []);

  // 注册全局快捷键 - Ctrl+Shift+K 显示/隐藏工具条
  useEffect(() => {
    // 只在主窗口中注册全局快捷键
    if (windowLabel === "main" && isTauri) {
      const handleKeyDown = async (e: KeyboardEvent) => {
        // Ctrl+Shift+K 快捷键切换工具条显示
        if (e.ctrlKey && e.shiftKey && e.key === "K") {
          e.preventDefault();
          try {
            const { invoke } = await import("@tauri-apps/api/core");
            await invoke("show_floating_toolbar");
          } catch (error) {
            console.warn("Failed to show floating toolbar:", error);
          }
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [windowLabel, isTauri]);

  // 应用启动时显示工具条（仅在浮动工具条窗口中）
  useEffect(() => {
    const initializeWindow = async () => {
      if (isTauri && windowLabel) {
        try {
          const { getCurrentWebviewWindow } = await import("@tauri-apps/api/webviewWindow");
          const window = getCurrentWebviewWindow();

          if (windowLabel === "floating-toolbar") {
            // 确保浮动工具条窗口可见
            await window.show();
            await window.setFocus();
            setShowFloatingToolbar(true);
          } else if (windowLabel === "main") {
            // 主窗口默认隐藏工具条
            setShowFloatingToolbar(false);
          }
        } catch (error) {
          console.warn("Failed to handle window behavior:", error);
        }
      } else if (!isTauri) {
        // 非Tauri环境，默认显示工具条用于开发测试
        setShowFloatingToolbar(true);
      }
    };

    initializeWindow();
  }, [windowLabel, isTauri]);

  return (
    <ErrorBoundary>
      <div
        className={`app-container ${windowLabel === "floating-toolbar" ? "floating-toolbar-window" : ""}`}
        id="app-bg"
      >
        {/* 仅在浮动工具条窗口中渲染工具条 */}
        {windowLabel === "floating-toolbar" && showFloatingToolbar && (
          <FloatingToolbar onClose={async () => {
            setShowFloatingToolbar(false);
            // 仅在Tauri环境中调用
            if (isTauri) {
              try {
                const { getCurrentWebviewWindow } = await import("@tauri-apps/api/webviewWindow");
                const window = getCurrentWebviewWindow();
                await window.hide();
              } catch (error) {
                console.warn("Failed to hide window:", error);
              }
            }
          }} />
        )}

        {/* Toast 通知容器 */}
        <ToastContainer />
      </div>
    </ErrorBoundary>
  );
}

export default App;