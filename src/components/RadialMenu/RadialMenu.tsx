import { ApiKey } from "../../types/apiKey";

interface RadialMenuProps {
  apiKey: ApiKey;
  onClose: () => void;
  onCopy: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDetails: () => void;
}

export function RadialMenu({ apiKey: _apiKey, onClose, onCopy, onEdit, onDelete, onDetails }: RadialMenuProps) {
  // 径向菜单选项
  const menuOptions = [
    { id: "copy", label: "复制", icon: "📋", action: onCopy },
    { id: "edit", label: "编辑", icon: "✏️", action: onEdit },
    { id: "delete", label: "删除", icon: "🗑️", action: onDelete },
    { id: "details", label: "详情", icon: "ℹ️", action: onDetails },
  ];

  // 处理选项点击
  const handleOptionClick = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 背景遮罩 */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-0"
        onClick={onClose}
      />
      
      {/* 径向菜单 */}
      <div className="relative w-64 h-64">
        {menuOptions.map((option, index) => {
          // 计算选项位置（圆形排列）
          const angle = (index * 90) - 45; // 从右上角开始，逆时针排列
          const radius = 100; // 半径
          const x = radius * Math.cos(angle * Math.PI / 180);
          const y = radius * Math.sin(angle * Math.PI / 180);
          
          return (
            <button
              key={option.id}
              onClick={() => handleOptionClick(option.action)}
              className="absolute flex flex-col items-center justify-center w-20 h-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 dark:border-gray-700/50 transition-all duration-200 hover:scale-110 hover:bg-white/90 dark:hover:bg-gray-700/90"
              style={{
                left: `calc(50% + ${x}px - 40px)`,
                top: `calc(50% + ${y}px - 40px)`,
              }}
            >
              <span className="text-2xl mb-1">{option.icon}</span>
              <span className="text-xs text-gray-700 dark:text-gray-300">{option.label}</span>
            </button>
          );
        })}
        
        {/* 中心点 */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-gray-400 rounded-full"></div>
      </div>
    </div>
  );
}