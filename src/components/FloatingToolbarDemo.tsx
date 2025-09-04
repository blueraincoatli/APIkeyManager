import { useState } from "react";
import { FloatingToolbar } from "./FloatingToolbar/FloatingToolbar";

export function FloatingToolbarDemo() {
  const [showToolbar, setShowToolbar] = useState(false);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">浮动工具条演示</h1>
      <p className="mb-4">点击下面的按钮来显示浮动工具条，或使用快捷键 Ctrl+Shift+K</p>
      
      <button
        onClick={() => setShowToolbar(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        显示浮动工具条
      </button>
      
      {showToolbar && (
        <FloatingToolbar onClose={() => setShowToolbar(false)} />
      )}
      
      <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">使用说明</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>工具条可以拖拽到任意位置</li>
          <li>搜索框支持实时搜索API Key</li>
          <li>点击右箭头按钮显示径向菜单</li>
          <li>搜索结果会显示在工具条下方</li>
          <li>使用 Ctrl+Shift+K 快捷键可以随时唤起工具条</li>
        </ul>
      </div>
    </div>
  );
}