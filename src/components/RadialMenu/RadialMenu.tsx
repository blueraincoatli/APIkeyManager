import { useEffect, useRef, useState } from "react";
import { useAdaptiveTheme } from "../../hooks/useAdaptiveTheme";

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
  anchor?: () => { x: number; y: number } | undefined; // 连线起点，通常为"更多"按钮中心
}

// 通用径向菜单：胶囊按钮沿弧线排列，仅对悬停项绘制单条连线
export function RadialMenu({ options, onSelect, onClose, anchor }: RadialMenuProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [angleOffset, setAngleOffset] = useState<number>(0); // 根据鼠标位置产生轻微滑动
  const menuRef = useRef<HTMLDivElement>(null);
  const { backgroundColor, textColor, borderColor } = useAdaptiveTheme(menuRef);

  // 根据鼠标在容器内的Y偏移，给予轻微角度偏移，制造"随鼠标滑动"的感觉
  useEffect(() => {
    const el = menuRef.current;
    if (!el) return;
    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cy = rect.top + rect.height / 2;
      const dy = e.clientY - cy; // [-h/2, h/2]
      const norm = Math.max(-1, Math.min(1, dy / (rect.height / 2))); // [-1,1]
      const max = 2; // 进一步减小最大偏移角度（度），使效果更 subtle
      setAngleOffset(norm * max);
    };
    const handleLeave = () => setAngleOffset(0);
    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', handleLeave);
    return () => {
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  const getLineForItem = (index: number) => {
    if (!menuRef.current) return null;
    // 修改为扇形布局的角度计算
    const startAngle = -60; // 起始角度，从右上开始
    const angleRange = 120; // 角度范围，形成120度的扇形
    const step = options.length > 1 ? angleRange / (options.length - 1) : 0;
    const angle = startAngle + index * step;
    const radius = 120;
    const x = radius * Math.cos((angle * Math.PI) / 180);
    const y = radius * Math.sin((angle * Math.PI) / 180);
    const centerX = menuRef.current.offsetWidth / 2;
    const centerY = menuRef.current.offsetHeight / 2;
    const anchorPoint = anchor?.();
    const anchorLocal = anchorPoint || { x: 0, y: centerY };

    const buttonWidth = 120;
    const buttonHeight = 40;
    const optionBounds = {
      left: centerX + x - buttonWidth / 2,
      top: centerY + y - buttonHeight / 2,
      right: centerX + x + buttonWidth / 2,
      bottom: centerY + y + buttonHeight / 2,
    };
    const iconRadius = 14; // 起点离anchor稍远，避免贴边
    const vx = (optionBounds.left + optionBounds.right) / 2 - anchorLocal.x;
    const vy = optionBounds.top - anchorLocal.y;
    const vlen = Math.max(1, Math.hypot(vx, vy));
    const startPoint = { x: anchorLocal.x + (vx / vlen) * iconRadius, y: anchorLocal.y + (vy / vlen) * iconRadius };
    const endPoint = { x: (optionBounds.left + optionBounds.right) / 2, y: optionBounds.top };

    return { startPoint, endPoint };
  };

  const handleClick = (id: string) => {
    onSelect(id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/10" onClick={onClose} />

      <div
        ref={menuRef}
        className="absolute w-80 h-64"
        style={{ left: 0, top: 0 }}
      >
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: -1 }}>
          {hoverIndex !== null && (() => {
            const p = getLineForItem(hoverIndex);
            if (!p) return null;
            return (
              <line
                x1={p.startPoint.x}
                y1={p.startPoint.y}
                x2={p.endPoint.x}
                y2={p.endPoint.y}
                stroke="rgba(255,255,255,0.35)"
                strokeWidth="2"
              />
            );
          })()}
        </svg>

        {options.map((option, index) => {
          // 修改为扇形布局：从右上开始，形成120度的扇形
          const startAngle = -60; // 起始角度，从右上开始（-60度）
          const angleRange = 120; // 角度范围，形成120度的扇形
          const step = options.length > 1 ? angleRange / (options.length - 1) : 0;
          const angle = startAngle + index * step + angleOffset;
          const radius = 100; // 减小半径以适应新的容器尺寸
          const x = radius * Math.cos((angle * Math.PI) / 180);
          const y = radius * Math.sin((angle * Math.PI) / 180);
          return (
            <button
              key={option.id}
              onMouseEnter={() => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(null)}
              onClick={() => handleClick(option.id)}
              className="absolute flex items-center justify-center px-4 py-2 rounded-full shadow-xl glass-chip transition-transform duration-200 hover:scale-105 hover:shadow-2xl min-w-[100px] max-w-[140px]"
              style={{
                left: `calc(50% + ${x}px - 50px)`,
                top: `calc(50% + ${y}px - 16px)`,
              }}
            >
              <span className="text-sm font-medium flex items-center gap-2 whitespace-nowrap max-w-[140px] text-gray-700 dark:text-gray-100">
                {option.icon && <span className="text-base flex-shrink-0"> {option.icon}</span>}
                <span className="truncate flex-grow text-center">{option.label}</span>
                <span className="ml-1 text-xs px-2 py-0.5 rounded-full border flex-shrink-0 text-gray-700 dark:text-gray-100" style={{ borderColor, backgroundColor: 'rgba(255,255,255,0.12)' }}>
                  {option.count ?? 0}
                </span>
              </span>
            </button>
          );
        })}

        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 border-white/30"
          style={{ backgroundColor }}
        />
      </div>
    </div>
  );
}

export type { RadialMenuOption };
