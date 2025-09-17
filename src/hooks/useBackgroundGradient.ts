import { useState, useEffect } from 'react';

// 定义渐变配置类型
interface GradientConfig {
  id: string;
  colors: string[];
  angle: number;
}

// 浅色主题渐变配置
const lightThemeGradients: GradientConfig[] = [
  {
    id: 'light-sunset',
    colors: ['#FFE5B4', '#FFCCCB', '#FFA07A'],
    angle: 135
  },
  {
    id: 'light-ocean',
    colors: ['#E0F2FE', '#BAE6FD', '#7DD3FC'],
    angle: 45
  },
  {
    id: 'light-forest',
    colors: ['#DCFCE7', '#BBF7D0', '#86EFAC'],
    angle: 90
  },
  {
    id: 'light-lavender',
    colors: ['#F3E8FF', '#E9D5FF', '#D8B4FE'],
    angle: 180
  }
];

// 深色主题渐变配置
const darkThemeGradients: GradientConfig[] = [
  {
    id: 'dark-midnight',
    colors: ['#1E1B4B', '#312E81', '#4C1D95'],
    angle: 225
  },
  {
    id: 'dark-forest',
    colors: ['#14532D', '#166534', '#15803D'],
    angle: 315
  },
  {
    id: 'dark-ocean',
    colors: ['#082F49', '#075985', '#0369A1'],
    angle: 135
  },
  {
    id: 'dark-sunset',
    colors: ['#7C2D12', '#9A3412', '#C2410C'],
    angle: 45
  }
];

// 生成CSS渐变字符串
const generateGradientCSS = (config: GradientConfig): string => {
  const colorStops = config.colors.map((color, index) => {
    const position = (index / (config.colors.length - 1)) * 100;
    return `${color} ${position}%`;
  }).join(', ');
  
  return `linear-gradient(${config.angle}deg, ${colorStops})`;
};

// 获取随机渐变
const getRandomGradient = (theme: 'light' | 'dark'): GradientConfig => {
  const gradients = theme === 'light' ? lightThemeGradients : darkThemeGradients;
  const randomIndex = Math.floor(Math.random() * gradients.length);
  return gradients[randomIndex];
};

export function useBackgroundGradient() {
  const [currentGradient, setCurrentGradient] = useState<string>('');
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [isInitialized, setIsInitialized] = useState(false);

  // 应用背景渐变
  const applyGradient = (theme: 'light' | 'dark') => {
    const gradient = getRandomGradient(theme);
    const gradientCSS = generateGradientCSS(gradient);
    
    // 应用到body背景
    document.body.style.background = gradientCSS;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundAttachment = 'fixed';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.minHeight = '100vh';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.transition = 'background 0.5s ease';
    
    setCurrentGradient(gradientCSS);
  };

  // 切换主题并应用对应的渐变
  const changeTheme = (theme: 'light' | 'dark' | 'system') => {
    setCurrentTheme(theme);
    
    // 应用HTML主题类
    const root = document.documentElement;
    if (theme === 'system') {
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDarkMode) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      applyGradient(isDarkMode ? 'dark' : 'light');
    } else {
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      applyGradient(theme);
    }
    
    // 保存主题设置
    localStorage.setItem('theme', theme);
  };

  // 随机切换当前主题的渐变
  const randomizeGradient = () => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    applyGradient(isDarkMode ? 'dark' : 'light');
  };

  // 初始化
  useEffect(() => {
    if (isInitialized) return;
    
    // 恢复保存的主题设置
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
    const initialTheme = savedTheme || 'system';
    changeTheme(initialTheme);
    setIsInitialized(true);

    // 监听系统主题变化
    if (initialTheme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        if (currentTheme === 'system') {
          applyGradient(e.matches ? 'dark' : 'light');
        }
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [isInitialized, currentTheme]);

  return {
    currentGradient,
    currentTheme,
    changeTheme,
    randomizeGradient
  };
}