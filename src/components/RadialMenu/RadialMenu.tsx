import { ApiKey } from "../../types/apiKey";
import { useState, useEffect, useRef } from "react";
import { useAdaptiveTheme } from "../../hooks/useAdaptiveTheme";

interface RadialMenuProps {
  apiKey: ApiKey;
  onClose: () => void;
  onCopy: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDetails: () => void;
}

export function RadialMenu({ apiKey: _apiKey, onClose, onCopy, onEdit, onDelete, onDetails }: RadialMenuProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const { backgroundColor, textColor, borderColor } = useAdaptiveTheme(menuRef);
  
  // 径向菜单选项
  const menuOptions = [
    { id: "copy", label: "Copy", icon: "📋", action: onCopy },
    { id: "edit", label: "Edit", icon: "✏️", action: onEdit },
    { id: "delete", label: "Delete", icon: "🗑️", action: onDelete },
    { id: "details", label: "Details", icon: "ℹ️", action: onDetails },
  ];

  // 初始化菜单位置
  useEffect(() => {
    setMenuPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  }, []);

  // 处理鼠标移动
  const handleMouseMove = (e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  

  // 添加鼠标移动事件监听器
  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // 计算两点间距离
  const distance = (point1: { x: number; y: number }, point2: { x: number; y: number }) => {
    return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
  };

  // 计算连线坐标点
  const calculateConnectorLinePoints = (
    iconCenter: { x: number; y: number },
    mousePosition: { x: number; y: number },
    iconRadius: number,
    optionBounds: { left: number; top: number; right: number; bottom: number }
  ) => {
    // 从图标中心到鼠标位置计算初始坐标
    const initialStartPoint = { x: iconCenter.x, y: iconCenter.y };
    const initialEndPoint = { x: mousePosition.x, y: mousePosition.y };

    // 调整起点到图标外缘
    const dist = distance(initialStartPoint, initialEndPoint);
    if (dist === 0) {
      // 当鼠标和图标中心重合时，返回默认坐标
      return { 
        startPoint: initialStartPoint, 
        endPoint: initialEndPoint 
      };
    }
    const startPoint = {
      x: initialStartPoint.x + (initialEndPoint.x - initialStartPoint.x) * (iconRadius / dist),
      y: initialStartPoint.y + (initialEndPoint.y - initialStartPoint.y) * (iconRadius / dist)
    };

    // 调整终点到选项外轮廓线
    const boundsWidth = optionBounds.right - optionBounds.left;
    const boundsHeight = optionBounds.bottom - optionBounds.top;
    if (boundsWidth === 0 || boundsHeight === 0) {
      // 当选项边界无效时，返回默认坐标
      return { 
        startPoint: initialStartPoint, 
        endPoint: initialEndPoint 
      };
    }
    const endPoint = {
      x: optionBounds.left + boundsWidth * (initialEndPoint.x - optionBounds.left) / boundsWidth,
      y: optionBounds.top + boundsHeight * (initialEndPoint.y - optionBounds.top) / boundsHeight
    };

    return { startPoint, endPoint };
  };

  // 处理选项点击
  const handleOptionClick = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 背景遮罩 */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* 径向菜单 */}
      <div 
        ref={menuRef} 
        className="relative w-80 h-80"
        style={{ left: menuPosition.x - 160, top: menuPosition.y - 160 }}
      >
        {/* SVG连线 */}
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: -1 }}>
          {menuOptions.map((_, index) => {
            // 计算选项位置（沿弧线排列，胶囊形设计）
            const angle = (index * 60) - 90; // 从顶部开始，间隔60度
            const radius = 120; // 半径
            const x = radius * Math.cos(angle * Math.PI / 180);
            const y = radius * Math.sin(angle * Math.PI / 180);
            
            // 获取选项元素的位置信息
            if (menuRef.current) {
              const centerX = menuRef.current.offsetWidth / 2;
              const centerY = menuRef.current.offsetHeight / 2;
              const iconRadius = 24; // 中心点半径
              
              // 胶囊形按钮尺寸
              const buttonWidth = 120;
              const buttonHeight = 40;
              const optionBounds = {
                left: centerX + x - buttonWidth/2,
                top: centerY + y - buttonHeight/2,
                right: centerX + x + buttonWidth/2,
                bottom: centerY + y + buttonHeight/2
              };
              
              const iconCenter = { x: centerX, y: centerY };
              const points = calculateConnectorLinePoints(iconCenter, mousePosition, iconRadius, optionBounds);
              
              return (
                <line
                  key={index}
                  x1={points.startPoint.x}
                  y1={points.startPoint.y}
                  x2={points.endPoint.x}
                  y2={points.endPoint.y}
                  stroke="rgba(255, 255, 255, 0.3)"
                  strokeWidth="2"
                  strokeDasharray="4,4"
                />
              );
            }
            return null;
          })}
        </svg>
        
        {menuOptions.map((option, index) => {
          // 计算选项位置（沿弧线排列，胶囊形设计）
          const angle = (index * 60) - 90; // 从顶部开始，间隔60度
          const radius = 120; // 半径
          const x = radius * Math.cos(angle * Math.PI / 180);
          const y = radius * Math.sin(angle * Math.PI / 180);
          
          return (
            <button
              key={option.id}
              onClick={() => handleOptionClick(option.action)}
              className="absolute flex items-center justify-center px-6 py-3 backdrop-blur-xl rounded-full shadow-xl border transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:bg-white/20"
              style={{
                left: `calc(50% + ${x}px - 60px)`,
                top: `calc(50% + ${y}px - 20px)`,
                backgroundColor,
                color: textColor,
                borderColor,
              }}
            >
              <span className="flex items-center space-x-2 font-medium">
                <span className="text-lg">{option.icon}</span>
                <span className="text-sm">{option.label}</span>
              </span>
            </button>
          );
        })}
        
        {/* 中心装饰点 */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full backdrop-blur-xl border-2 border-white/30"
             style={{ backgroundColor }}></div>
      </div>
    </div>
  );
}