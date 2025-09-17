import { useState, useEffect } from "react";
import { FloatingToolbar } from "./components/FloatingToolbar/FloatingToolbar";
import { ThemeProvider } from "./contexts/ThemeContext";
import ToastContainer from "./components/Toast/ToastContainer";
import { ErrorBoundary } from "./components/ErrorBoundary";
import "./App.css";
import "./styles/theme.css";

// 检查是否在Tauri环境中
const isTauri = typeof window !== 'undefined' && '__TAURI__' in window;

// 条件导入Tauri API
let getCurrentWebviewWindow: any = null;
if (isTauri) {
  try {
    getCurrentWebviewWindow = (await import("@tauri-apps/api/webviewWindow")).getCurrentWebviewWindow;
  } catch (error) {
    console.warn("Failed to import Tauri webviewWindow API:", error);
  }
}

function App() {
  const [showFloatingToolbar, setShowFloatingToolbar] = useState(true);

  // 注册全局快捷键 - Ctrl+Shift+K 显示/隐藏工具条
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Shift+K 快捷键切换工具条显示
      if (e.ctrlKey && e.shiftKey && e.key === "K") {
        e.preventDefault();
        setShowFloatingToolbar(prev => !prev);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // 应用启动时显示工具条
  useEffect(() => {
    // 仅在Tauri环境中调用
    if (isTauri && getCurrentWebviewWindow) {
      try {
        // 确保窗口可见
        getCurrentWebviewWindow().show();
      } catch (error) {
        console.warn("Failed to show window:", error);
      }
    }
  }, []);

  return (
    <ThemeProvider defaultTheme="system">
      <ErrorBoundary>
        <div className="min-h-screen" id="app-bg">
          {/* 浮动工具条作为主界面 */}
          {showFloatingToolbar && (
            <FloatingToolbar onClose={async () => {
              setShowFloatingToolbar(false);
              // 仅在Tauri环境中调用
              if (isTauri && getCurrentWebviewWindow) {
                try {
                  // 隐藏窗口而不是关闭应用
                  await getCurrentWebviewWindow().hide();
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
    </ThemeProvider>
  );
}

export default App;