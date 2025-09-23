import { useState } from "react";
import { FloatingToolbar } from "./FloatingToolbar/FloatingToolbar";

export function FloatingToolbarDemo() {
  const [showToolbar, setShowToolbar] = useState(false);

  return (
    <div className="min-h-screen p-8">
      {/* 渐变背景容器 */}
      <div className="min-h-screen rounded-2xl bg-gradient-to-br from-purple-400 via-pink-500 to-orange-500 p-8 shadow-2xl">
        <div className="max-w-4xl mx-auto">
          {/* 标题区域 */}
          <div className="text-center mb-12 pt-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              浮动工具条演示
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
              体验现代化的 API 密钥管理工具，支持全局快捷访问和智能搜索
            </p>
          </div>

          {/* 演示控制区域 */}
          <div className="bg-white/20 backdrop-blur-lg rounded-2xl border border-white/30 p-8 mb-12 shadow-xl">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-white mb-6">
                试用浮动工具条
              </h2>
              <p className="text-white/90 mb-8 max-w-2xl mx-auto">
                点击下方按钮显示浮动工具条，或使用快捷键
                <kbd className="ml-2 px-2 py-1 bg-black/20 rounded-md">
                  Ctrl+Shift+K
                </kbd>
              </p>

              <button
                type="button"
                onClick={() => setShowToolbar(true)}
                className="px-8 py-4 bg-white/30 hover:bg-white/40 text-white font-semibold rounded-full backdrop-blur-sm border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                显示浮动工具条
              </button>
            </div>
          </div>

          {/* 功能说明卡片网格 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[
              {
                title: "全局快捷访问",
                description: "Ctrl+Shift+K 随时唤起工具条",
                icon: "⌨️",
              },
              {
                title: "智能搜索",
                description: "实时搜索 API 密钥，支持模糊匹配",
                icon: "🔍",
              },
              {
                title: "拖拽定位",
                description: "工具条可拖拽至任意位置",
                icon: "🖱️",
              },
              {
                title: "径向菜单",
                description: "环形菜单操作更直观",
                icon: "🟢",
              },
              {
                title: "一键复制",
                description: "结果一键复制，安全便捷",
                icon: "📋",
              },
              {
                title: "玻璃拟态",
                description: "磨砂玻璃视觉，融入背景",
                icon: "✨",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white/20 backdrop-blur-lg rounded-xl border border-white/30 p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-white/90">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* 技术说明区域 */}
          <div className="bg-white/20 backdrop-blur-lg rounded-2xl border border-white/30 p-8 shadow-xl">
            <h2 className="text-2xl font-semibold text-white mb-6 text-center">
              技术特点
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-white mb-3 flex items-center">
                  <span className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center mr-2">
                    1
                  </span>
                  现代化 UI 设计
                </h3>
                <ul className="space-y-2 text-white/90">
                  <li className="flex items-start">
                    <span className="text-green-300 mr-2">✔</span>
                    <span>磨砂玻璃效果（Glassmorphism）</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-300 mr-2">✔</span>
                    <span>响应式布局，适配多种屏幕</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-300 mr-2">✔</span>
                    <span>流畅的动画过渡效果</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-3 flex items-center">
                  <span className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center mr-2">
                    2
                  </span>
                  安全特性
                </h3>
                <ul className="space-y-2 text-white/90">
                  <li className="flex items-start">
                    <span className="text-green-300 mr-2">✔</span>
                    <span>AES-256-GCM 数据加密</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-300 mr-2">✔</span>
                    <span>Argon2id 密码哈希</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-300 mr-2">✔</span>
                    <span>安全的剪贴板操作</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showToolbar && <FloatingToolbar onClose={() => setShowToolbar(false)} />}
    </div>
  );
}
