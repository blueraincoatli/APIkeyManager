import { useState, useEffect } from "react";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { invoke } from "@tauri-apps/api/core";
import { FloatingToolbar } from "./components/FloatingToolbar/FloatingToolbar";
import ToastContainer from "./components/Toast/ToastContainer";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { LocaleProvider } from "./contexts/LocaleContext";
import "./App.css";
import "./styles/theme.css";
import "./i18n";

// 检查是否在Tauri环境中
const isTauri = typeof window !== 'undefined' && '__TAURI__' in window;

function App() {
  const [showFloatingToolbar, setShowFloatingToolbar] = useState(true);

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

  // 初始化窗口
  useEffect(() => {
    const initializeWindow = async () => {
      if (isTauri) {
        try {
          const window = getCurrentWebviewWindow();
          await window.setFocus();
          document.body.classList.add("floating-toolbar-window");
        } catch (error) {
          console.warn("Failed to initialize window:", error);
          document.body.classList.add("floating-toolbar-window");
        }
      } else {
        // 非Tauri环境，默认为浮动工具条用于开发测试
        document.body.classList.add("floating-toolbar-window");
      }
    };

    initializeWindow();
  }, []);

  // 注册全局快捷键 - Ctrl+Shift+K 显示/隐藏工具条
  useEffect(() => {
    if (isTauri) {
      const handleKeyDown = async (e: KeyboardEvent) => {
        // Ctrl+Shift+K 快捷键切换工具条显示
        if (e.ctrlKey && e.shiftKey && e.key === "K") {
          e.preventDefault();
          try {
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
  }, [isTauri]);

  // 应用启动时显示工具条
  useEffect(() => {
    const initializeToolbar = async () => {
      if (isTauri) {
        try {
          const window = getCurrentWebviewWindow();
          await window.show();
          await window.setFocus();
          setShowFloatingToolbar(true);
        } catch (error) {
          console.warn("Failed to handle window behavior:", error);
        }
      } else {
        // 非Tauri环境，默认显示工具条用于开发测试
        setShowFloatingToolbar(true);
      }
    };

    initializeToolbar();
  }, [isTauri]);

  return (
    <ErrorBoundary>
      <LocaleProvider>
        <div
          className="app-container floating-toolbar-window"
          id="app-bg"
        >
          {/* 渲染浮动工具条 */}
          {showFloatingToolbar && (
            <FloatingToolbar onClose={async () => {
              setShowFloatingToolbar(false);
              // 仅在Tauri环境中调用
              if (isTauri) {
                try {
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
      </LocaleProvider>
    </ErrorBoundary>
  );
}

export default App;