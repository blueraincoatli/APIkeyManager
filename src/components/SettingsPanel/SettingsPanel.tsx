import { CheckIcon, SunIcon, MoonIcon, ComputerIcon } from '../Icon/Icon';
import { useTheme } from '../../contexts/ThemeContext';
import { useLocale } from '../../contexts/LocaleContext';
import { useTranslation } from 'react-i18next';
import './SettingsPanel.css';

interface ThemeOption {
  id: 'light' | 'dark' | 'system';
  label: string;
  icon: React.ReactNode;
}

interface ShortcutOption {
  label: string;
  key: string;
}

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
}

const themeOptions: ThemeOption[] = [
  {
    id: 'light',
    label: '浅色',
    icon: <SunIcon className="settings-panel-theme-icon" />,
  },
  {
    id: 'dark',
    label: '深色',
    icon: <MoonIcon className="settings-panel-theme-icon" />,
  }
];

const shortcutOptions: ShortcutOption[] = [
  {
    label: '召唤/隐藏',
    key: 'Ctrl+Shift+K'
  }
];

export function SettingsPanel({ open, onClose }: SettingsPanelProps) {
  const { theme: currentTheme, setTheme } = useTheme();
  const { currentLanguage, setLanguage, languageOptions } = useLocale();
  const { t } = useTranslation();

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    setTheme(theme);
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang as any);
  };

  // 阻止事件冒泡，防止点击面板内部时关闭面板
  const handlePanelClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  if (!open) {
    return null;
  }

  return (
    <div className="settings-panel-container">
      <div className="settings-panel-overlay" onClick={onClose} />
      <div
        className="settings-panel"
        onClick={handlePanelClick}
      >
        <div className="settings-panel-header">
          <h2 className="settings-panel-title">{t('settings.title')}</h2>
          <button
            type="button"
            onClick={onClose}
            className="settings-panel-close-button"
            aria-label={t('common.close')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="settings-panel-content">
          {/* 主题选择 */}
          <div className="settings-panel-section">
            <h3 className="settings-panel-section-title">{t('settings.theme')}</h3>
            <div className="settings-panel-theme-options-horizontal">
              {themeOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleThemeChange(option.id)}
                  className={`settings-panel-theme-option-horizontal ${
                    currentTheme === option.id ? 'selected' : ''
                  }`}
                >
                  <div className="settings-panel-theme-option-icon-horizontal">
                    {option.icon}
                  </div>
                  <div className="settings-panel-theme-option-label-horizontal">
                    {t(`settings.themeOptions.${option.id}`)}
                  </div>
                  {currentTheme === option.id && (
                    <div className="settings-panel-theme-option-selected-horizontal">
                      <CheckIcon className="settings-panel-selected-icon" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 语言选择 */}
          <div className="settings-panel-section">
            <h3 className="settings-panel-section-title">{t('settings.language')}</h3>
            <div className="settings-panel-language-select">
              <select
                value={currentLanguage}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="settings-panel-language-dropdown"
              >
                {languageOptions.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.nativeName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 快捷键 */}
          <div className="settings-panel-section">
            <h3 className="settings-panel-section-title">{t('settings.shortcuts')}</h3>
            <div className="settings-panel-shortcut-options">
              {shortcutOptions.map((shortcut, index) => (
                <div key={index} className="settings-panel-shortcut-option">
                  <div className="settings-panel-shortcut-label">
                    {t('settings.shortcutsToggle')}
                  </div>
                  <div className="settings-panel-shortcut-key">
                    {shortcut.key}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 关于 */}
          <div className="settings-panel-about">
            <div className="settings-panel-about-logo">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div className="settings-panel-about-info">
              <h3 className="settings-panel-about-title">{t('settings.about.title')}</h3>
              <div className="settings-panel-about-version">{t('settings.about.version')}</div>
              <p className="settings-panel-about-description">{t('settings.about.description')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPanel;