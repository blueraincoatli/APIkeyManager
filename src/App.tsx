import { useState, useEffect, useCallback } from "react";
import { KeyManager } from "./components/KeyManager/KeyManager";
import { SmartClipboard } from "./components/SmartClipboard/SmartClipboard";
import { FloatingToolbar } from "./components/FloatingToolbar/FloatingToolbar";
import { FloatingToolbarDemo } from "./components/FloatingToolbarDemo";
import { RadialMenuTest } from "./components/RadialMenu/RadialMenu.test";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ThemeToggle } from "./components/ThemeToggle/ThemeToggle";
import ToastContainer from "./components/Toast/ToastContainer";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { UI_CONSTANTS } from "./constants";
import "./App.css";
import "./styles/theme.css";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showFloatingToolbar, setShowFloatingToolbar] = useState(false);

  // 注册全局快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Shift+K 快捷键显示浮动工具条
      if (e.ctrlKey && e.shiftKey && e.key === 'K') {
        e.preventDefault();
        setShowFloatingToolbar(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // 优化：使用useCallback缓存事件处理函数
  const handleTabChange = useCallback((tab: string) => {
    // 添加主题切换动画类
    document.documentElement.classList.add('theme-transitioning');
    setActiveTab(tab);

    // 移除动画类
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning');
    }, UI_CONSTANTS.ANIMATION_DURATION.THEME_TRANSITION);
  }, []);

  return (
    <ThemeProvider defaultTheme="system">
      <ErrorBoundary>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold">API Key Manager</h1>
              <ThemeToggle />
            </div>
            <nav className="flex space-x-4">
              <button
                onClick={() => handleTabChange("dashboard")}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === "dashboard"
                    ? "bg-gray-200 dark:bg-gray-700"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => handleTabChange("keys")}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === "keys"
                    ? "bg-gray-200 dark:bg-gray-700"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                API Keys
              </button>
              <button
                onClick={() => handleTabChange("smart-clipboard")}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === "smart-clipboard"
                    ? "bg-gray-200 dark:bg-gray-700"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                Smart Clipboard
              </button>
              <button
                onClick={() => handleTabChange("floating-toolbar-demo")}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === "floating-toolbar-demo"
                    ? "bg-gray-200 dark:bg-gray-700"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                Floating Toolbar Demo
              </button>
              <button
                onClick={() => handleTabChange("radial-menu-test")}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === "radial-menu-test"
                    ? "bg-gray-200 dark:bg-gray-700"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                Radial Menu Test
              </button>
              <button
                onClick={() => handleTabChange("settings")}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === "settings"
                    ? "bg-gray-200 dark:bg-gray-700"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                Settings
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "dashboard" && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-6 text-white">
                <h3 className="text-lg font-semibold">Total API Keys</h3>
                <p className="text-3xl font-bold mt-2">0</p>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-6 text-white">
                <h3 className="text-lg font-semibold">Used</h3>
                <p className="text-3xl font-bold mt-2">0</p>
              </div>
              <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg p-6 text-white">
                <h3 className="text-lg font-semibold">Recently Used</h3>
                <p className="text-3xl font-bold mt-2">-</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "keys" && <KeyManager />}

        {activeTab === "smart-clipboard" && <SmartClipboard />}

        {activeTab === "floating-toolbar-demo" && <FloatingToolbarDemo />}

        {activeTab === "radial-menu-test" && <RadialMenuTest />}

        {activeTab === "settings" && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Settings</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">General Settings</h3>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span>Theme</span>
                    <ThemeToggle />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Security Settings</h3>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span>Master Password</span>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm">
                      Set
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Set master password to protect your API Keys
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {showFloatingToolbar && (
        <FloatingToolbar onClose={() => setShowFloatingToolbar(false)} />
      )}

      {/* Toast Notification Container */}
      <ToastContainer />
      </div>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;