import { useState } from "react";
import { RadialMenu } from "./RadialMenu";

export function RadialMenuTest() {
  const [showMenu, setShowMenu] = useState(false);

  const options = [
    { id: "copy", label: "Copy", icon: "📋" },
    { id: "edit", label: "Edit", icon: "✏️" },
    { id: "delete", label: "Delete", icon: "🗑️" },
    { id: "details", label: "Details", icon: "ℹ️" },
  ];

  const handleSelect = (id: string) => {
    console.log(`Selected: ${id}`);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">RadialMenu 测试页面</h1>
      <p className="mb-4">点击下面的按钮来显示径向菜单并测试连线功能。</p>

      <button
        onClick={() => setShowMenu(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        显示径向菜单
      </button>

      {showMenu && (
        <RadialMenu
          options={options}
          onSelect={handleSelect}
          onClose={() => setShowMenu(false)}
        />
      )}

      <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">测试说明</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>点击“显示径向菜单”按钮来打开菜单</li>
          <li>将鼠标悬停在选项上观察单条连线</li>
          <li>点击任一选项查看回调日志</li>
          <li>点击遮罩层或选项后关闭菜单</li>
        </ul>
      </div>
    </div>
  );
}
