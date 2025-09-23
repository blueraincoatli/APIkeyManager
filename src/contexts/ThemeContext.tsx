import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useThemeTransition } from "../hooks/useThemeTransition";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");
  const { optimizedThemeChange, batchDOMUpdates } = useThemeTransition();

  // 从localStorage读取保存的主题设置
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey) as Theme;
      if (stored && ["light", "dark", "system"].includes(stored)) {
        setTheme(stored);
      }
    } catch (error) {
      console.warn("Failed to read theme from localStorage:", error);
    }
  }, [storageKey]);

  // 监听系统主题变化
  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      setResolvedTheme(e.matches ? "dark" : "light");
    };

    // 设置初始值
    setResolvedTheme(mediaQuery.matches ? "dark" : "light");

    // 添加监听器
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [theme]);

  // 当主题改变时更新DOM和localStorage - 使用性能优化
  useEffect(() => {
    optimizedThemeChange(() => {
      batchDOMUpdates(() => {
        const root = window.document.documentElement;

        let newResolvedTheme: "light" | "dark";

        if (theme === "system") {
          newResolvedTheme = window.matchMedia("(prefers-color-scheme: dark)")
            .matches
            ? "dark"
            : "light";
        } else {
          newResolvedTheme = theme;
        }

        setResolvedTheme(newResolvedTheme);

        // 使用class策略而不是data-theme，与Tailwind CSS兼容
        if (newResolvedTheme === "dark") {
          root.classList.add("dark");
          root.setAttribute("data-theme", "dark");
        } else {
          root.classList.remove("dark");
          root.setAttribute("data-theme", "light");
        }

        // 保存到localStorage
        try {
          localStorage.setItem(storageKey, theme);
        } catch (error) {
          console.warn("Failed to save theme to localStorage:", error);
        }
      });
    });
  }, [theme, storageKey, optimizedThemeChange, batchDOMUpdates]);

  // 优化的主题设置函数
  const handleSetTheme = useCallback((newTheme: Theme) => {
    setTheme(newTheme);
  }, []);

  // 优化的主题切换函数
  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      if (prev === "light") return "dark";
      if (prev === "dark") return "system";
      return "light";
    });
  }, []);

  // 使用useMemo优化context值
  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme: handleSetTheme,
      toggleTheme,
    }),
    [theme, resolvedTheme, handleSetTheme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
