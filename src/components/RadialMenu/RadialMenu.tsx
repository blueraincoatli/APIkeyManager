import { useRef, useState, useEffect } from "react";
import { useAdaptiveTheme } from "../../hooks/useAdaptiveTheme";
import "./RadialMenu.css";

interface RadialMenuOption {
  id: string;
  label: string;
  icon?: string;
  count?: number;
}

interface RadialMenuProps {
  options: RadialMenuOption[];
  onSelect: (id: string) => void;
  onClose: () => void;
}

// 通用径向菜单：胶囊按钮沿弧线排列
export function RadialMenu({ options, onSelect, onClose }: RadialMenuProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [animationStage, setAnimationStage] = useState<'initial' | 'animating' | 'complete'>('initial');
  const menuRef = useRef<HTMLDivElement>(null);
  const { backgroundColor, borderColor } = useAdaptiveTheme();
  
  // 计算中心点位置
  const getCenterPoint = () => {
    if (!menuRef.current) return { centerX: 0, centerY: 0 };
    const centerX = menuRef.current.offsetWidth / 2;
    const centerY = menuRef.current.offsetHeight / 2;
    return { centerX, centerY };
  };

  // 菜单弹出动画
  useEffect(() => {
    if (animationStage === 'initial') {
      const timer = setTimeout(() => setAnimationStage('animating'), 10);
      const completeTimer = setTimeout(() => setAnimationStage('complete'), 300);
      return () => {
        clearTimeout(timer);
        clearTimeout(completeTimer);
      };
    }
  }, [animationStage]);

  

  const handleClick = (id: string) => {
    onSelect(id);
    onClose();
  };

  // 计算菜单项的动画样式
  const getItemAnimationStyle = (index: number) => {
    if (animationStage === 'initial') {
      return {
        transform: 'scale(0)',
        opacity: 0,
      };
    }
    
    if (animationStage === 'animating') {
      const delay = index * 30; // 每个项延迟30ms
      return {
        // 不设置transform，让CSS控制悬停效果
        opacity: 1,
        transition: `opacity 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${delay}ms`,
      };
    }
    
    return {};
  };

  return (
    <div className="radial-menu-overlay">
      <div className="radial-menu-background" onClick={onClose} />

      <div
        ref={menuRef}
        className="radial-menu-container"
      >

        {options.map((option, index) => {
          const { centerX, centerY } = getCenterPoint();
          // 修改为扇形布局：从右上开始，形成90度的扇形
          const startAngle = -45; // 起始角度，从右上开始（-45度）
          const angleRange = 90; // 角度范围，形成90度的扇形
          const step = options.length > 1 ? angleRange / (options.length - 1) : 0;
          const angle = startAngle + index * step;
          const radius = 120; // 增大半径以展平弧度
          const x = radius * Math.cos((angle * Math.PI) / 180);
          const y = radius * Math.sin((angle * Math.PI) / 180);
          
          // 计算动画样式
          const animationStyle = getItemAnimationStyle(index);
          
          return (
            <button
              key={option.id}
              onMouseEnter={() => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(null)}
              onClick={() => handleClick(option.id)}
              className="radial-menu-option-button"
              style={{
                left: `${centerX + x - 50}px`,
                top: `${centerY + y - 16}px`,
                zIndex: 10,
                ...animationStyle,
              }}
            >
              <span className="radial-menu-option-content">
                {option.icon && <span className="radial-menu-option-icon"> {option.icon}</span>}
                <span className="radial-menu-option-label">{option.label}</span>
                <span className="radial-menu-option-count" style={{ borderColor, backgroundColor: 'rgba(255,255,255,0.12)' }}>
                  {option.count ?? 0}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export type { RadialMenuOption };
