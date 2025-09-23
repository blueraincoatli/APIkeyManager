import { memo } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../contexts/ThemeContext";
import "./ThemeToggle.css";

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle = memo(({ className = "" }: ThemeToggleProps) => {
  const { t } = useTranslation();
  const { theme, resolvedTheme, setTheme } = useTheme();

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    requestAnimationFrame(() => {
      setTheme(newTheme);
    });
  };

  return (
    <div className={`theme-toggle ${className}`}>
      <button
        type="button"
        onClick={() => handleThemeChange("light")}
        className={`theme-toggle__button ${theme === "light" ? "theme-toggle__button--active" : ""}`}
        title={t("themeToggle.lightTheme")}
        aria-label={t("themeToggle.switchToLight")}
      >
        <svg className="theme-toggle__icon" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      </button>

      <button
        type="button"
        onClick={() => handleThemeChange("dark")}
        className={`theme-toggle__button ${theme === "dark" ? "theme-toggle__button--active" : ""}`}
        title={t("themeToggle.darkTheme")}
        aria-label={t("themeToggle.switchToDark")}
      >
        <svg className="theme-toggle__icon" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      </button>

      <button
        type="button"
        onClick={() => handleThemeChange("system")}
        className={`theme-toggle__button ${theme === "system" ? "theme-toggle__button--active" : ""}`}
        title={t("themeToggle.systemTheme")}
        aria-label={t("themeToggle.followSystem")}
      >
        <svg className="theme-toggle__icon" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      </button>

      <div className="theme-toggle__status">
        {theme === "system"
          ? `${t("themeToggle.system")} (${resolvedTheme})`
          : theme === "dark"
            ? t("themeToggle.dark")
            : t("themeToggle.light")}
      </div>
    </div>
  );
});

ThemeToggle.displayName = "ThemeToggle";
