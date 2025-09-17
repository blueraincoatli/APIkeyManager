import { CheckIcon, SunIcon, MoonIcon, ComputerIcon } from '../Icon/Icon';
import { useBackgroundGradient } from '../../hooks/useBackgroundGradient';
import { useEffect, useRef } from 'react';
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
  position: { x: number; y: number };
  toolbarWidth: number;
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
  },
  {
    id: 'system',
    label: '系统',
    icon: <ComputerIcon className="settings-panel-theme-icon" />,
  }
];

const shortcutOptions: ShortcutOption[] = [
  {
    label: '打开搜索',
    key: 'Ctrl+Shift+K'
  },
  {
    label: '最小化窗口',
    key: 'Esc'
  },
  {
    label: '关闭面板',
    key: 'Ctrl+W'
  }
];

export function SettingsPanel({ open, onClose, position, toolbarWidth }: SettingsPanelProps) {
  const { currentTheme, changeTheme } = useBackgroundGradient();
  const panelRef = useRef<HTMLDivElement>(null);

  // 计算面板位置（在工具栏下方）
  const panelPosition = {
    left: position.x + (toolbarWidth - 360) / 2, // 与工具条居中对齐
    top: position.y + 10, // 工具条下方固定距离
  };

  // 使用useEffect来设置CSS变量，避免内联样式
  useEffect(() => {
    if (panelRef.current) {
      panelRef.current.style.setProperty('--panel-left', `${panelPosition.left}px`);
      panelRef.current.style.setProperty('--panel-top', `${panelPosition.top}px`);
    }
  }, [panelPosition.left, panelPosition.top]);

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    changeTheme(theme);
  };

  if (!open) {
    return null;
  }

  return (
    <div className="settings-panel-container">
      <div className="settings-panel-overlay" onClick={onClose} />
      <div
        ref={panelRef}
        className="settings-panel positioned"
      >
        <div className="settings-panel-header">
          <h2 className="settings-panel-title">设置</h2>
          <button
            type="button"
            onClick={onClose}
            className="settings-panel-close-button"
            aria-label="关闭设置"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="settings-panel-content">
          {/* 主题选择 */}
          <div className="settings-panel-section">
            <h3 className="settings-panel-section-title">颜色主题</h3>
            <div className="settings-panel-theme-options">
              {themeOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleThemeChange(option.id)}
                  className={`settings-panel-theme-option ${
                    currentTheme === option.id ? 'selected' : ''
                  }`}
                  style={{ position: 'relative' }}
                >
                  <div className="settings-panel-theme-option-icon">
                    {option.icon}
                  </div>
                  <div className="settings-panel-theme-option-label">
                    {option.label}
                  </div>
                  {currentTheme === option.id && (
                    <div className="settings-panel-theme-option-selected">
                      <CheckIcon className="settings-panel-selected-icon" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 快捷键 */}
          <div className="settings-panel-section">
            <h3 className="settings-panel-section-title">快捷键</h3>
            <div className="settings-panel-shortcut-options">
              {shortcutOptions.map((shortcut, index) => (
                <div key={index} className="settings-panel-shortcut-option">
                  <div className="settings-panel-shortcut-label">
                    {shortcut.label}
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
            <h3 className="settings-panel-about-title">API Key Manager</h3>
            <div className="settings-panel-about-version">v1.0.0</div>
            <p className="settings-panel-about-description">
              一个现代化的API密钥管理工具，帮助开发者安全地存储和管理API密钥。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPanel;