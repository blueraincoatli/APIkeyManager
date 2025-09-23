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
  const [animationStage, setAnimationStage] = useState<
    "initial" | "animating" | "complete"
  >("initial");
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [scrollOffset, setScrollOffset] = useState(0);
  const scrollTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 计算可见选项
  const PAGE_SIZE = 6;
  const visibleOptions = options.slice(scrollOffset, scrollOffset + PAGE_SIZE);
  const canScrollUp = options.length > PAGE_SIZE && scrollOffset > 0;
  const canScrollDown =
    options.length > PAGE_SIZE && scrollOffset < options.length - PAGE_SIZE;

  // 计算中心点位置
  const getCenterPoint = () => {
    if (!menuRef.current) return { centerX: 0, centerY: 0 };
    const centerX = menuRef.current.offsetWidth / 2;
    const centerY = menuRef.current.offsetHeight / 2;
    return { centerX, centerY };
  };

  // 菜单弹出动画
  useEffect(() => {
    if (animationStage === "initial") {
      const timer = setTimeout(() => setAnimationStage("animating"), 10);
      const completeTimer = setTimeout(
        () => setAnimationStage("complete"),
        300,
      );
      return () => {
        clearTimeout(timer);
        clearTimeout(completeTimer);
      };
    }
  }, [animationStage]);

  // 设置按钮位置的CSS变量
  useEffect(() => {
    const { centerX, centerY } = getCenterPoint();

    visibleOptions.forEach((_, index) => {
      const button = buttonRefs.current[index];
      if (button) {
        // 修改为扇形布局：从右上开始，形成90度的扇形
        const startAngle = -45; // 起始角度，从右上开始（-45度）
        const angleRange = 90; // 角度范围，形成90度的扇形
        const step =
          visibleOptions.length > 1
            ? angleRange / (visibleOptions.length - 1)
            : 0;
        const angle = startAngle + index * step;
        const radius = 120; // 增大半径以展平弧度
        const x = radius * Math.cos((angle * Math.PI) / 180);
        const y = radius * Math.sin((angle * Math.PI) / 180);

        button.style.setProperty("--item-left", `${centerX + x - 50}px`);
        button.style.setProperty("--item-top", `${centerY + y - 16}px`);
      }
    });
  }, [visibleOptions]);

  const handleClick = (id: string) => {
    onSelect(id);
    onClose();
  };

  // 计算菜单项的动画类名
  const getItemAnimationClass = () => {
    if (animationStage === "initial") {
      return "initial";
    }

    if (animationStage === "animating") {
      return "animating";
    }

    return "";
  };

  // 计算菜单项的动画延迟类名
  const getItemAnimationDelay = (index: number) => {
    if (animationStage === "animating") {
      return `delay-${index}`;
    }
    return "";
  };

  // 滚动处理
  const handleScroll = (direction: "up" | "down") => {
    // 确保有足够多的选项来滚动
    if (options.length <= PAGE_SIZE) {
      return;
    }

    if (direction === "up" && scrollOffset > 0) {
      setScrollOffset((prev) => Math.max(0, prev - 1));
    } else if (
      direction === "down" &&
      scrollOffset < options.length - PAGE_SIZE
    ) {
      setScrollOffset((prev) => Math.min(options.length - PAGE_SIZE, prev + 1));
    }
  };

  const startAutoScroll = (direction: "up" | "down") => {
    if (scrollTimerRef.current) clearInterval(scrollTimerRef.current as any);
    // 连续滚动：每 220ms 滚动一项
    scrollTimerRef.current = setInterval(() => {
      handleScroll(direction);
    }, 220) as any;
  };

  const stopAutoScroll = () => {
    if (scrollTimerRef.current) {
      clearInterval(scrollTimerRef.current as any);
      scrollTimerRef.current = null;
    }
  };

  // 处理鼠标滚轮事件
  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      // 向上滚动
      handleScroll("up");
    } else {
      // 向下滚动
      handleScroll("down");
    }
  };

  // 添加鼠标滚轮事件监听器
  useEffect(() => {
    const menuContainer = menuRef.current;
    if (menuContainer && options.length > 6) {
      menuContainer.addEventListener("wheel", handleWheel, { passive: false });
      return () => {
        menuContainer.removeEventListener("wheel", handleWheel);
      };
    }
  }, [options.length, scrollOffset]);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="radial-menu-overlay">
      <div ref={menuRef} className="radial-menu-container">
        {/* 顶部/底部第一二项采用透明度弱化，取消遮罩层 */}

        {/* 顶部滚动箭头 */}
        {options.length > PAGE_SIZE && (
          <button
            type="button"
            className={`radial-menu-scroll-indicator top ${canScrollUp ? "" : "disabled"}`}
            onClick={() => handleScroll("up")}
            onMouseEnter={() => canScrollUp && startAutoScroll("up")}
            onMouseLeave={stopAutoScroll}
            disabled={!canScrollUp}
          >
            ▲
          </button>
        )}

        {/* 底部滚动箭头 */}
        {options.length > PAGE_SIZE && (
          <button
            type="button"
            className={`radial-menu-scroll-indicator bottom ${canScrollDown ? "" : "disabled"}`}
            onClick={() => handleScroll("down")}
            onMouseEnter={() => canScrollDown && startAutoScroll("down")}
            onMouseLeave={stopAutoScroll}
            disabled={!canScrollDown}
          >
            ▼
          </button>
        )}

        {visibleOptions.map((option, index) => {
          // 计算动画类名和延迟
          const animationClass = getItemAnimationClass();
          const animationDelay = getItemAnimationDelay(index);
          // 顶部/底部两项透明度渐隐
          const len = visibleOptions.length;
          let fadeClass = "";
          // 顶部渐隐仅在可以继续向上滚动时出现
          if (canScrollUp) {
            if (index === 0) fadeClass = "fade-strong";
            else if (index === 1) fadeClass = "fade-weak";
          }
          // 底部渐隐仅在可以继续向下滚动时出现
          if (canScrollDown) {
            if (index === len - 2) fadeClass = "fade-weak";
            else if (index === len - 1) fadeClass = "fade-strong";
          }

          return (
            <button
              key={option.id}
              ref={(el) => {
                buttonRefs.current[index] = el;
              }}
              type="button"
              onClick={() => handleClick(option.id)}
              className={`radial-menu-option-button positioned ${fadeClass} ${animationClass} ${animationDelay}`}
            >
              <span className="radial-menu-option-content">
                {option.icon && (
                  <span className="radial-menu-option-icon">
                    {" "}
                    {option.icon}
                  </span>
                )}
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
