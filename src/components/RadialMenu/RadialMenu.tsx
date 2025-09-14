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
  center?: { x: number; y: number } | (() => { x: number; y: number });
  anchor?: () => { x: number; y: number } | undefined; // 连线起点，通常为“更多”按钮中心
}

// 通用径向菜单：胶囊按钮沿弧线排列，仅对悬停项绘制单条连线
export function RadialMenu({ options, onSelect, onClose, center, anchor }: RadialMenuProps) {
  const initialCenter = typeof center === 'function' ? center() : center;
  const [menuCenter, setMenuCenter] = useState<{ x: number; y: number }>(initialCenter || { x: 0, y: 0 });
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [angleOffset, setAngleOffset] = useState<number>(0); // 根据鼠标位置产生轻微滑动
  const menuRef = useRef<HTMLDivElement>(null);
  const { backgroundColor, textColor, borderColor } = useAdaptiveTheme(menuRef);

  useEffect(() => {
    if (!center) {
      setMenuCenter({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    }
  }, [center]);

  // 根据鼠标在容器内的Y偏移，给予轻微角度偏移，制造“随鼠标滑动”的感觉
  useEffect(() => {
    const el = menuRef.current;
    if (!el) return;
    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cy = rect.top + rect.height / 2;
      const dy = e.clientY - cy; // [-h/2, h/2]
      const norm = Math.max(-1, Math.min(1, dy / (rect.height / 2))); // [-1,1]
      const max = 20; // 最大偏移角度（度）
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
    const angle = index * 60 - 90;
    const radius = 120;
    const x = radius * Math.cos((angle * Math.PI) / 180);
    const y = radius * Math.sin((angle * Math.PI) / 180);
    const centerX = menuRef.current.offsetWidth / 2;
    const centerY = menuRef.current.offsetHeight / 2;
    const rect = menuRef.current.getBoundingClientRect();
    const anchorPoint = anchor?.();
    const anchorLocal = anchorPoint
      ? { x: anchorPoint.x - rect.left, y: anchorPoint.y - rect.top }
      : { x: centerX, y: centerY };

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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/10" onClick={onClose} />

      <div
        ref={menuRef}
        className="relative w-80 h-80"
        style={{ left: (menuCenter.x || 0) - 160, top: (menuCenter.y || 0) - 160 }}
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
          // 步进角根据数量自适应，基础从顶点-90°开始
          const step = Math.min(60, 360 / Math.max(6, options.length));
          const angle = index * step - 90 + angleOffset;
          const radius = 120;
          const x = radius * Math.cos((angle * Math.PI) / 180);
          const y = radius * Math.sin((angle * Math.PI) / 180);
          return (
            <button
              key={option.id}
              onMouseEnter={() => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(null)}
              onClick={() => handleClick(option.id)}
              className="absolute flex items-center justify-center px-6 py-3 rounded-full border shadow-xl backdrop-blur-xl transition-transform duration-200 hover:scale-105 hover:shadow-2xl"
              style={{
                left: `calc(50% + ${x}px - 60px)`,
                top: `calc(50% + ${y}px - 20px)`,
                backgroundColor,
                color: textColor,
                borderColor,
              }}
            >
              <span className="text-sm font-medium flex items-center gap-2">
                {option.icon && <span className="text-base">{option.icon}</span>}
                {option.label}
                <span className="ml-1 text-xs px-2 py-0.5 rounded-full border" style={{ borderColor, backgroundColor: 'rgba(255,255,255,0.12)' }}>
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
