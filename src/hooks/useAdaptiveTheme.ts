import { useEffect, useState } from "react";
import { logSecureError, OperationContext } from "../services/secureLogging";

interface AdaptiveThemeResult {
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  isDarkBackground: boolean;
}

// 简化版自适应主题：不再基于时间/位置变化，仅根据文档根主题或系统偏好一次性设置，并在主题切换时同步。
export function useAdaptiveTheme(): AdaptiveThemeResult {
  const [backgroundColor, setBackgroundColor] = useState(
    "rgba(255, 255, 255, 0.9)",
  );
  const [textColor, setTextColor] = useState("#1a1c41");
  const [borderColor, setBorderColor] = useState("rgba(26, 28, 65, 0.2)");
  const [isDarkBackground, setIsDarkBackground] = useState(false);

  const applyFromDocumentTheme = () => {
    try {
      const root = document.documentElement;
      const isDark =
        root.classList.contains("dark") ||
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (isDark) {
        setBackgroundColor("rgba(26, 28, 65, 0.9)");
        setTextColor("#ffffff");
        setBorderColor("rgba(255, 255, 255, 0.2)");
        setIsDarkBackground(true);
      } else {
        setBackgroundColor("rgba(255, 255, 255, 0.9)");
        setTextColor("#1a1c41");
        setBorderColor("rgba(26, 28, 65, 0.2)");
        setIsDarkBackground(false);
      }
    } catch (error) {
      logSecureError(OperationContext.THEME_ANALYSIS, error, {
        component: "useAdaptiveTheme",
      });
    }
  };

  useEffect(() => {
    applyFromDocumentTheme();

    // 监听系统主题与文档 root class 变化
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyFromDocumentTheme();
    mq.addEventListener("change", handler);
    const obs = new MutationObserver(handler);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      mq.removeEventListener("change", handler);
      obs.disconnect();
    };
  }, []);

  return { backgroundColor, textColor, borderColor, isDarkBackground };
}
