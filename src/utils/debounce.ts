/**
 * 防抖工具函数
 * 防止频繁触发函数调用，提高性能
 */

/**
 * 创建防抖函数
 * @param func 要防抖的函数
 * @param delay 延迟时间（毫秒）
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: number;

  return function (this: any, ...args: Parameters<T>) {
    const context = this;

    // 清除之前的定时器
    clearTimeout(timeoutId);

    // 设置新的定时器
    timeoutId = window.setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}

/**
 * 创建节流函数
 * @param func 要节流的函数
 * @param delay 延迟时间（毫秒）
 * @returns 节流后的函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: number | null = null;
  let lastExecTime = 0;

  return function (this: any, ...args: Parameters<T>) {
    const context = this;
    const currentTime = Date.now();

    // 如果距离上次执行时间超过延迟，立即执行
    if (currentTime - lastExecTime > delay) {
      lastExecTime = currentTime;
      func.apply(context, args);
      return;
    }

    // 否则，设置定时器在延迟后执行
    if (!timeoutId) {
      timeoutId = window.setTimeout(() => {
        lastExecTime = Date.now();
        func.apply(context, args);
        timeoutId = null;
      }, delay - (currentTime - lastExecTime));
    }
  };
}

/**
 * 创建带有取消功能的防抖函数
 * @param func 要防抖的函数
 * @param delay 延迟时间（毫秒）
 * @returns 包含防抖函数和取消函数的对象
 */
export function debounced<T extends (...args: any[]) => any>(
  func: T,
  delay: number
) {
  let timeoutId: number;

  const debouncedFn = function (this: any, ...args: Parameters<T>) {
    const context = this;

    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };

  const cancel = () => {
    clearTimeout(timeoutId);
  };

  return {
    fn: debouncedFn,
    cancel
  };
}