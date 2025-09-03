import { useState } from "react";
import { KeyManager } from "./components/KeyManager/KeyManager";
import { SmartClipboard } from "./components/SmartClipboard/SmartClipboard";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">API Key Manager</h1>
            </div>
            <nav className="flex space-x-4">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === "dashboard"
                    ? "bg-gray-200 dark:bg-gray-700"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                仪表板
              </button>
              <button
                onClick={() => setActiveTab("keys")}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === "keys"
                    ? "bg-gray-200 dark:bg-gray-700"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                API Keys
              </button>
              <button
                onClick={() => setActiveTab("smart-clipboard")}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === "smart-clipboard"
                    ? "bg-gray-200 dark:bg-gray-700"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                智能剪贴板
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === "settings"
                    ? "bg-gray-200 dark:bg-gray-700"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                设置
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "dashboard" && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">仪表板</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-6 text-white">
                <h3 className="text-lg font-semibold">总API Keys</h3>
                <p className="text-3xl font-bold mt-2">0</p>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-6 text-white">
                <h3 className="text-lg font-semibold">已使用</h3>
                <p className="text-3xl font-bold mt-2">0</p>
              </div>
              <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg p-6 text-white">
                <h3 className="text-lg font-semibold">最近使用</h3>
                <p className="text-3xl font-bold mt-2">-</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "keys" && <KeyManager />}

        {activeTab === "smart-clipboard" && <SmartClipboard />}

        {activeTab === "settings" && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">设置</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">通用设置</h3>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span>主题</span>
                    <select className="bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1">
                      <option>浅色</option>
                      <option>深色</option>
                      <option>自动</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">安全设置</h3>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span>主密码</span>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm">
                      设置
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    设置主密码以保护您的API Keys
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;