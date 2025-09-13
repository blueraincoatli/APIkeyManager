import { useState, useEffect, useRef } from 'react';

interface AdaptiveThemeResult {
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  isDarkBackground: boolean;
}

export function useAdaptiveTheme(elementRef?: React.RefObject<HTMLDivElement | null>): AdaptiveThemeResult {
  const [backgroundColor, setBackgroundColor] = useState("rgba(30, 32, 71, 0.85)");
  const [textColor, setTextColor] = useState("#ffffff");
  const [borderColor, setBorderColor] = useState("rgba(255, 255, 255, 0.2)");
  const [isDarkBackground, setIsDarkBackground] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const analysisIntervalRef = useRef<number | null>(null);

  // 初始化canvas
  useEffect(() => {
    canvasRef.current = document.createElement('canvas');
    canvasRef.current.width = 1;
    canvasRef.current.height = 1;
    
    return () => {
      if (analysisIntervalRef.current) {
        clearInterval(analysisIntervalRef.current);
      }
    };
  }, []);

  // 分析背景颜色
  const analyzeBackground = () => {
    try {
      let x = window.innerWidth / 2;
      let y = window.innerHeight / 2;

      // 如果有元素引用，分析元素中心的背景
      if (elementRef?.current) {
        const rect = elementRef.current.getBoundingClientRect();
        x = rect.left + rect.width / 2;
        y = rect.top + rect.height / 2;
      }

      // 使用一个简化的方法来获取背景颜色
      // 在实际应用中，这里可以使用更复杂的颜色采样算法
      const simulatedColor = getSimulatedBackgroundColor(x, y);
      const brightness = calculateBrightness(simulatedColor);
      
      // 根据背景亮度调整主题
      if (brightness < 128) {
        // 深色背景
        setBackgroundColor("rgba(26, 28, 65, 0.9)");
        setTextColor("#ffffff");
        setBorderColor("rgba(255, 255, 255, 0.2)");
        setIsDarkBackground(true);
      } else {
        // 浅色背景
        setBackgroundColor("rgba(255, 255, 255, 0.9)");
        setTextColor("#1a1c41");
        setBorderColor("rgba(26, 28, 65, 0.2)");
        setIsDarkBackground(false);
      }
    } catch (error) {
      console.error('Background analysis failed:', error);
      // 使用默认主题
      setBackgroundColor("rgba(30, 32, 71, 0.85)");
      setTextColor("#ffffff");
      setBorderColor("rgba(255, 255, 255, 0.2)");
      setIsDarkBackground(true);
    }
  };

  // 模拟背景颜色获取（实际应用中应该使用真实的颜色采样）
  const getSimulatedBackgroundColor = (x: number, y: number): string => {
    // 这里使用一个基于位置和时间的变化来模拟不同的背景
    const time = Date.now() * 0.001;
    const r = Math.floor(Math.sin(x * 0.01 + time) * 50 + 100);
    const g = Math.floor(Math.sin(y * 0.01 + time * 1.1) * 50 + 100);
    const b = Math.floor(Math.sin((x + y) * 0.01 + time * 0.9) * 50 + 150);
    
    return `rgb(${r}, ${g}, ${b})`;
  };

  // 计算颜色亮度
  const calculateBrightness = (color: string): number => {
    // 解析RGB颜色
    const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (!match) return 128;
    
    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);
    
    // 使用相对亮度公式
    return (r * 0.299 + g * 0.587 + b * 0.114);
  };

  // 开始定期分析背景
  useEffect(() => {
    analyzeBackground();
    
    // 每2秒重新分析一次背景
    analysisIntervalRef.current = window.setInterval(analyzeBackground, 2000);
    
    return () => {
      if (analysisIntervalRef.current) {
        clearInterval(analysisIntervalRef.current);
      }
    };
  }, [elementRef]);

  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      analyzeBackground();
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return {
    backgroundColor,
    textColor,
    borderColor,
    isDarkBackground
  };
}