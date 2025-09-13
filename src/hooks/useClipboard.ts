import { useState } from 'react';
import { clipboardService } from '../services/clipboardService';

// 自定义Hook用于管理剪贴板相关的状态和逻辑
export const useClipboard = () => {
  const [isCopying, setIsCopying] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);

  // 复制文本到剪贴板
  const copyToClipboard = async (text: string) => {
    setIsCopying(true);
    setCopyError(null);
    try {
      const result = await clipboardService.copyToClipboard(text);
      if (!result) {
        setCopyError('复制失败');
      }
      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '复制过程中发生错误';
      setCopyError(errorMsg);
      return false;
    } finally {
      setIsCopying(false);
    }
  };

  return {
    isCopying,
    copyError,
    copyToClipboard,
  };
};