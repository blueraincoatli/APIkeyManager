import { useState, useRef, useCallback, useMemo } from "react";

interface VirtualListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemHeight: number | ((index: number, item: T) => number);
  containerHeight: number;
  overscan?: number;
  className?: string;
  onScroll?: (scrollInfo: {
    scrollTop: number;
    scrollDirection: "up" | "down";
  }) => void;
}

interface Range {
  startIndex: number;
  endIndex: number;
  overscanStartIndex: number;
  overscanEndIndex: number;
}

export function VirtualList<T>({
  items,
  renderItem,
  itemHeight,
  containerHeight,
  overscan = 3,
  className = "",
  onScroll,
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lastScrollTopRef = useRef(0);

  // 计算总高度
  const totalHeight = useMemo(() => {
    if (typeof itemHeight === "number") {
      return items.length * itemHeight;
    }
    return items.reduce(
      (total, _, index) => total + itemHeight(index, items[index]),
      0,
    );
  }, [items, itemHeight]);

  // 计算项目位置的缓存
  const itemPositions = useMemo(() => {
    const positions: number[] = [];
    let currentOffset = 0;

    for (let i = 0; i < items.length; i++) {
      positions[i] = currentOffset;
      currentOffset +=
        typeof itemHeight === "number" ? itemHeight : itemHeight(i, items[i]);
    }

    return positions;
  }, [items, itemHeight]);

  // 根据滚动位置计算可见项目范围
  const calculateRange = useCallback(
    (scrollTopValue: number): Range => {
      let startIndex = 0;
      let endIndex = items.length - 1;

      // 二分查找开始位置
      let low = 0;
      let high = items.length - 1;
      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        if (itemPositions[mid] < scrollTopValue) {
          low = mid + 1;
        } else {
          high = mid - 1;
        }
      }
      startIndex = Math.max(0, low - 1);

      // 二分查找结束位置
      low = 0;
      high = items.length - 1;
      const scrollBottom = scrollTopValue + containerHeight;
      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        if (itemPositions[mid] < scrollBottom) {
          low = mid + 1;
        } else {
          high = mid - 1;
        }
      }
      endIndex = Math.min(items.length - 1, high);

      // 添加过扫描区域
      const overscanStartIndex = Math.max(0, startIndex - overscan);
      const overscanEndIndex = Math.min(items.length - 1, endIndex + overscan);

      return {
        startIndex,
        endIndex,
        overscanStartIndex,
        overscanEndIndex,
      };
    },
    [items, itemPositions, containerHeight, overscan],
  );

  const range = useMemo(
    () => calculateRange(scrollTop),
    [scrollTop, calculateRange],
  );

  // 处理滚动事件
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const currentScrollTop = e.currentTarget.scrollTop;
      setScrollTop(currentScrollTop);
      lastScrollTopRef.current = currentScrollTop;

      if (onScroll) {
        onScroll({
          scrollTop: currentScrollTop,
          scrollDirection:
            currentScrollTop > lastScrollTopRef.current ? "down" : "up",
        });
      }
    },
    [onScroll],
  );

  // 渲染可见项目
  const visibleItems = useMemo(() => {
    const itemsToRender = [];
    for (let i = range.overscanStartIndex; i <= range.overscanEndIndex; i++) {
      if (i >= 0 && i < items.length) {
        const top = itemPositions[i];
        const height =
          typeof itemHeight === "number" ? itemHeight : itemHeight(i, items[i]);

        itemsToRender.push(
          <div
            key={i}
            style={{
              position: "absolute",
              top: `${top}px`,
              width: "100%",
              height: `${height}px`,
            }}
          >
            {renderItem(items[i], i)}
          </div>,
        );
      }
    }
    return itemsToRender;
  }, [range, items, itemPositions, itemHeight, renderItem]);

  // 滚动到指定项目 (保留以供将来使用)
  // const scrollToIndex = useCallback((index: number, behavior: ScrollBehavior = 'auto') => {
  //   if (index < 0 || index >= items.length || !containerRef.current) {
  //     return;
  //   }
  //
  //   const targetTop = itemPositions[index];
  //   containerRef.current.scrollTo({
  //     top: targetTop,
  //     behavior
  //   });
  // }, [items.length, itemPositions]);

  // 滚动到顶部 (保留以供将来使用)
  // const scrollToTop = useCallback((behavior: ScrollBehavior = 'auto') => {
  //   if (containerRef.current) {
  //     containerRef.current.scrollTo({
  //       top: 0,
  //       behavior
  //     });
  //   }
  // }, []);

  // 滚动到底部 (保留以供将来使用)
  // const scrollToBottom = useCallback((behavior: ScrollBehavior = 'auto') => {
  //   if (containerRef.current) {
  //     containerRef.current.scrollTo({
  //       top: totalHeight,
  //       behavior
  //     });
  //   }
  // }, [totalHeight]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-auto ${className}`}
      style={{ height: `${containerHeight}px` }}
      onScroll={handleScroll}
    >
      <div
        ref={contentRef}
        style={{ height: `${totalHeight}px`, position: "relative" }}
      >
        {visibleItems}
      </div>
    </div>
  );
}

// 导出hooks以便于使用
export function useVirtualList<T>(
  _items: T[],
  options: {
    itemHeight: number | ((index: number, item: T) => number);
    containerHeight: number;
    overscan?: number;
  },
) {
  const { itemHeight, containerHeight, overscan = 3 } = options;

  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // const scrollToIndex = useCallback((index: number, behavior: ScrollBehavior = 'auto') => {
  //   if (!containerRef.current) return;
  //
  //   const itemPositions: number[] = [];
  //   let currentOffset = 0;
  //
  //   for (let i = 0; i < items.length; i++) {
  //     itemPositions[i] = currentOffset;
  //     currentOffset += typeof itemHeight === 'number' ? itemHeight : itemHeight(i, items[i]);
  //   }
  //
  //   if (index >= 0 && index < items.length) {
  //     const targetTop = itemPositions[index];
  //     containerRef.current.scrollTo({
  //       top: targetTop,
  //       behavior
  //     });
  //   }
  // }, [items, itemHeight]);

  return {
    scrollTop,
    setScrollTop,
    containerRef,
    // scrollToIndex,
    itemHeight,
    containerHeight,
    overscan,
  };
}
