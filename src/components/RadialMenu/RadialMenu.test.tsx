import { useState } from "react";
import { RadialMenu } from "./RadialMenu";
import { ApiKey } from "../../types/apiKey";

export function RadialMenuTest() {
  const [showMenu, setShowMenu] = useState(false);
  
  // 创建一个示例API Key
  const sampleApiKey: ApiKey = {
    id: "test-id",
    name: "Test API Key",
    keyValue: "sk-1234567890abcdef",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    lastUsedAt: undefined,
  };

  const handleCopy = () => {
    console.log("Copy action triggered");
  };

  const handleEdit = () => {
    console.log("Edit action triggered");
  };

  const handleDelete = () => {
    console.log("Delete action triggered");
  };

  const handleDetails = () => {
    console.log("Details action triggered");
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">RadialMenu 测试页面</h1>
      <p className="mb-4">点击下面的按钮来显示径向菜单并测试连线功能</p>
      
      <button
        onClick={() => setShowMenu(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        显示径向菜单
      </button>
      
      {showMenu && (
        <RadialMenu
          apiKey={sampleApiKey}
          onClose={() => setShowMenu(false)}
          onCopy={handleCopy}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDetails={handleDetails}
        />
      )}
      
      <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">测试说明</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>点击"显示径向菜单"按钮来打开菜单</li>
          <li>移动鼠标观察连线是否跟随鼠标移动</li>
          <li>点击菜单选项测试功能是否正常</li>
          <li>点击遮罩层关闭菜单</li>
        </ul>
      </div>
    </div>
  );
}