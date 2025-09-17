import { CheckIcon, SunIcon, MoonIcon, ComputerIcon, ShuffleIcon } from '../Icon/Icon';
import { useBackgroundGradient } from '../../hooks/useBackgroundGradient';
import { useEffect, useRef } from 'react';
import './SettingsPanel.css';

interface ThemeOption {
  id: 'light' | 'dark' | 'system';
  label: string;
  icon: React.ReactNode;
  description: string;
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
    description: '始终使用浅色主题'
  },
  {
    id: 'dark',
    label: '深色',
    icon: <MoonIcon className="settings-panel-theme-icon" />,
    description: '始终使用深色主题'
  },
  {
    id: 'system',
    label: '系统',
    icon: <ComputerIcon className="settings-panel-theme-icon" />,
    description: '跟随系统设置'
  }
];

export function SettingsPanel({ open, onClose, position, toolbarWidth }: SettingsPanelProps) {
  const { currentTheme, changeTheme, randomizeGradient } = useBackgroundGradient();
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
                >
                  <div className="settings-panel-theme-option-header">
                    <div className="settings-panel-theme-option-icon">
                      {option.icon}
                    </div>
                    <div className="settings-panel-theme-option-info">
                      <div className="settings-panel-theme-option-label">
                        {option.label}
                      </div>
                      <div className="settings-panel-theme-option-description">
                        {option.description}
                      </div>
                    </div>
                    {currentTheme === option.id && (
                      <div className="settings-panel-theme-option-selected">
                        <CheckIcon className="settings-panel-selected-icon" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 背景渐变 */}
          <div className="settings-panel-section">
            <h3 className="settings-panel-section-title">背景效果</h3>
            <div className="settings-panel-background-options">
              <button
                type="button"
                onClick={randomizeGradient}
                className="settings-panel-background-option"
              >
                <div className="settings-panel-background-option-header">
                  <div className="settings-panel-background-option-icon">
                    <ShuffleIcon className="settings-panel-background-icon" />
                  </div>
                  <div className="settings-panel-background-option-info">
                    <div className="settings-panel-background-option-label">
                      随机渐变
                    </div>
                    <div className="settings-panel-background-option-description">
                      切换背景渐变效果
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPanel;