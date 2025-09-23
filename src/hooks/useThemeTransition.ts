import { useCallback } from "react";

/**
 * 性能优化的主题切换hook
 * 提供平滑的主题切换体验，减少重绘和重排
 */
export function useThemeTransition() {
  // 开始主题切换过渡
  const startTransition = useCallback(() => {
    const html = document.documentElement;

    // 添加过渡类
    html.classList.add("theme-transitioning");

    // 强制重绘以确保过渡效果
    html.offsetHeight;

    return () => {
      // 清理函数
      setTimeout(() => {
        html.classList.remove("theme-transitioning");
      }, 200);
    };
  }, []);

  // 优化的主题切换函数
  const optimizedThemeChange = useCallback(
    (
      changeFn: () => void,
      options: {
        useTransition?: boolean;
        delay?: number;
      } = {},
    ) => {
      const { useTransition = true, delay = 0 } = options;

      if (useTransition) {
        const endTransition = startTransition();

        if (delay > 0) {
          setTimeout(() => {
            changeFn();
            endTransition();
          }, delay);
        } else {
          requestAnimationFrame(() => {
            changeFn();
            endTransition();
          });
        }
      } else {
        changeFn();
      }
    },
    [startTransition],
  );

  // 批量DOM更新以减少重排
  const batchDOMUpdates = useCallback((updates: () => void) => {
    // 使用requestAnimationFrame确保在下一帧执行
    requestAnimationFrame(() => {
      // 测量之前的状态
      const startMeasure = performance.now();

      // 执行更新
      updates();

      // 测量性能
      const endMeasure = performance.now();
      const duration = endMeasure - startMeasure;

      if (duration > 16) {
        // 超过一帧时间
        console.warn(
          `Theme transition took ${duration.toFixed(2)}ms, consider optimizing`,
        );
      }
    });
  }, []);

  // 预加载主题资源
  const preloadThemeResources = useCallback(() => {
    // 预加载可能的资源
    const preloadResources: string[] = [
      // 这里可以添加需要预加载的资源
    ];

    preloadResources.forEach((resource) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image"; // 根据实际资源类型调整
      link.href = resource;
      document.head.appendChild(link);
    });
  }, []);

  // 优化图片和媒体元素的主题切换
  const optimizeMediaElements = useCallback(() => {
    const mediaElements = document.querySelectorAll("img, video, canvas");

    mediaElements.forEach((element) => {
      // 添加过渡类
      element.classList.add("theme-transitioning");

      // 优化性能
      (element as HTMLElement).style.willChange = "opacity";

      // 清理
      setTimeout(() => {
        element.classList.remove("theme-transitioning");
        (element as HTMLElement).style.willChange = "auto";
      }, 300);
    });
  }, []);

  return {
    startTransition,
    optimizedThemeChange,
    batchDOMUpdates,
    preloadThemeResources,
    optimizeMediaElements,
  };
}
