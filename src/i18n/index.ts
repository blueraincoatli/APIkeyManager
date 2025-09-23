import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// 导入语言文件
import enUS from "./languages/en-US";
import zhCN from "./languages/zh-CN";
import zhTW from "./languages/zh-TW";
import esES from "./languages/es-ES";
import jaJP from "./languages/ja-JP";
import ruRU from "./languages/ru-RU";
import frFR from "./languages/fr-FR";
import itIT from "./languages/it-IT";
import ptBR from "./languages/pt-BR";

// 语言资源
const resources = {
  "en-US": {
    translation: enUS,
  },
  "zh-CN": {
    translation: zhCN,
  },
  "zh-TW": {
    translation: zhTW,
  },
  "es-ES": {
    translation: esES,
  },
  "ja-JP": {
    translation: jaJP,
  },
  "ru-RU": {
    translation: ruRU,
  },
  "fr-FR": {
    translation: frFR,
  },
  "it-IT": {
    translation: itIT,
  },
  "pt-BR": {
    translation: ptBR,
  },
};

// 初始化i18n
i18n.use(initReactI18next).init({
  resources,
  lng: "en-US", // 默认语言
  fallbackLng: "en-US", // 回退语言
  debug: false,

  interpolation: {
    escapeValue: false, // React已经对XSS进行了防护
  },

  // 语言检测和存储配置
  detection: {
    order: ["localStorage", "navigator"],
    caches: ["localStorage"],
  },
});

export default i18n;

// 导出语言类型
export type LanguageCode = keyof typeof resources;

// 导出语言选项
export const languageOptions = [
  { code: "en-US" as LanguageCode, label: "English", nativeName: "English" },
  { code: "zh-CN" as LanguageCode, label: "简体中文", nativeName: "简体中文" },
  { code: "zh-TW" as LanguageCode, label: "繁體中文", nativeName: "繁體中文" },
  { code: "es-ES" as LanguageCode, label: "Español", nativeName: "Español" },
  { code: "ja-JP" as LanguageCode, label: "日本語", nativeName: "日本語" },
  { code: "ru-RU" as LanguageCode, label: "Русский", nativeName: "Русский" },
  { code: "fr-FR" as LanguageCode, label: "Français", nativeName: "Français" },
  { code: "it-IT" as LanguageCode, label: "Italiano", nativeName: "Italiano" },
  {
    code: "pt-BR" as LanguageCode,
    label: "Português",
    nativeName: "Português",
  },
];
