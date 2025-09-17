import { useRef, useState, useEffect } from "react";
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
  const [animationStage, setAnimationStage] = useState<'initial' | 'animating' | 'complete'>('initial');
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  
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

  // 设置按钮位置的CSS变量
  useEffect(() => {
    const { centerX, centerY } = getCenterPoint();

    options.forEach((_, index) => {
      const button = buttonRefs.current[index];
      if (button) {
        // 修改为扇形布局：从右上开始，形成90度的扇形
        const startAngle = -45; // 起始角度，从右上开始（-45度）
        const angleRange = 90; // 角度范围，形成90度的扇形
        const step = options.length > 1 ? angleRange / (options.length - 1) : 0;
        const angle = startAngle + index * step;
        const radius = 120; // 增大半径以展平弧度
        const x = radius * Math.cos((angle * Math.PI) / 180);
        const y = radius * Math.sin((angle * Math.PI) / 180);

        button.style.setProperty('--item-left', `${centerX + x - 50}px`);
        button.style.setProperty('--item-top', `${centerY + y - 16}px`);
      }
    });
  }, [options]);

  const handleClick = (id: string) => {
    onSelect(id);
    onClose();
  };

  // 计算菜单项的动画类名
  const getItemAnimationClass = () => {
    if (animationStage === 'initial') {
      return 'initial';
    }

    if (animationStage === 'animating') {
      return 'animating';
    }

    return '';
  };

  // 计算菜单项的动画延迟类名
  const getItemAnimationDelay = (index: number) => {
    if (animationStage === 'animating') {
      return `delay-${index}`;
    }
    return '';
  };

  return (
    <div className="radial-menu-overlay">
      <div className="radial-menu-background" onClick={onClose} />

      <div
        ref={menuRef}
        className="radial-menu-container"
      >

        {options.map((option, index) => {
          // 计算动画类名和延迟
          const animationClass = getItemAnimationClass();
          const animationDelay = getItemAnimationDelay(index);

          return (
            <button
              key={option.id}
              ref={(el) => { buttonRefs.current[index] = el; }}
              type="button"
              onClick={() => handleClick(option.id)}
              className={`radial-menu-option-button positioned ${animationClass} ${animationDelay}`}
            >
              <span className="radial-menu-option-content">
                {option.icon && <span className="radial-menu-option-icon"> {option.icon}</span>}
                <span className="radial-menu-option-label">{option.label}</span>
                <span className="radial-menu-option-count">
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
