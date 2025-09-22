import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import i18n, { LanguageCode } from '../i18n';
import { languageOptions } from '../i18n';

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