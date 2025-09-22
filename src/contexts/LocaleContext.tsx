import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import i18n, { LanguageCode } from '../i18n';
import { languageOptions } from '../i18n';
import { emit } from '@tauri-apps/api/event';

interface LocaleContextType {
  currentLanguage: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  languageOptions: typeof languageOptions;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

interface LocaleProviderProps {
  children: ReactNode;
}

export function LocaleProvider({ children }: LocaleProviderProps) {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en-US');

  // 初始化时从localStorage读取语言设置
  useEffect(() => {
    const savedLanguage = localStorage.getItem('app-language') as LanguageCode;
    if (savedLanguage && languageOptions.some(option => option.code === savedLanguage)) {
      setCurrentLanguage(savedLanguage);
      i18n.changeLanguage(savedLanguage);
    } else {
      // 如果没有保存的语言，尝试使用浏览器语言
      const browserLang = navigator.language;
      const supportedLang = languageOptions.find(option => 
        browserLang.startsWith(option.code.split('-')[0])
      );
      
      if (supportedLang) {
        setCurrentLanguage(supportedLang.code);
        i18n.changeLanguage(supportedLang.code);
      }
    }
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    setCurrentLanguage(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem('app-language', lang);
    // [1m[22m[0m[0m[0m[0m[0m[0m[0m[0m[0m[0m[0m[0m[0m[0m[0m[0m[0m
    try {
      // 通过 Tauri 事件总线通知其他窗口（例如独立预览窗口）
      // 在非 Tauri 环境下（开发网页预览）此调用会被忽略
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      emit('language-change', lang);
    } catch (e) {
      // ignore if tauri event api is not available
    }
  };

  const value: LocaleContextType = {
    currentLanguage,
    setLanguage,
    languageOptions
  };

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}