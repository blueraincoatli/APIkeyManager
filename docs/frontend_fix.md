1. FloatingToolbar 组件的修改
首先，我们来调整 FloatingToolbar 组件，确保它具有磨砂玻璃效果、投影效果，并且支持拖放功能。
修改 FloatingToolbar.tsx
tsx
import React, { useState, useEffect, useRef } from 'react';

const FloatingToolbar: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const toolbarRef = useRef(null);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    // ... existing code ...
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    // ... existing code ...
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    // ... existing code ...
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      // ... existing code ...
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      // ... existing code ...
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      ref={toolbarRef}
      className="fixed top-0 left-0 p-4 z-50 bg-white/70 backdrop-blur-xl shadow-xl rounded-lg"
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      onMouseDown={handleMouseDown}
    >
      {/* SearchInput */}
      <input className="rounded-full px-4 py-2" placeholder="Search API keys..." />
      {/* AddButton */}
      <button className="rounded-full p-2">
        <span>+</span>
      </button>
      {/* RadialMenuTrigger */}
      <button className="rounded-full p-2">
        <span>...</span>
      </button>
      {/* SettingsButton */}
      <button className="rounded-full p-2">
        <span>⚙️</span>
      </button>
      {/* CloseButton */}
      <button className="rounded-full p-2">
        <span>×</span>
      </button>
    </div>
  );
};

export default FloatingToolbar;
2. RadialMenu 组件的修改
接下来，我们调整 RadialMenu 组件，确保选项沿弧线排列但保持文本水平对齐，并采用扁平化胶囊形设计。
修改 RadialMenu.tsx
tsx
import React from 'react';

const RadialMenu: React.FC = () => {
  return (
    <div className="radial-menu absolute right-0 mt-2">
      {/* MenuItems */}
      <div className="menu-item rounded-full flex items-center px-4 py-2">Item 1</div>
      <div className="menu-item rounded-full flex items-center px-4 py-2">Item 2</div>
      {/* More Items */}
    </div>
  );
};

export default RadialMenu;
3. SearchResults 组件的修改
然后，我们调整 SearchResults 组件，确保搜索结果从工具条下方以纸片形式展示，并包含 API 密钥（部分字符隐藏）和拷贝按钮。
修改 SearchResults.tsx
tsx
import React from 'react';

const SearchResults: React.FC = () => {
  const results = [
    { name: 'OpenAI', key: 'sk-xxxxx...xxxxx' },
    { name: 'Claude', key: 'cl-xxxxx...xxxxx' },
    // More Results
  ];

  return (
    <div className="absolute top-12 w-96 bg-white/70 backdrop-blur-xl shadow-xl rounded-lg overflow-y-auto max-h-96">
      {results.map((result) => (
        <div key={result.name} className="p-4 border-b last:border-b-0">
          <div className="font-semibold">{result.name}</div>
          <div className="text-sm text-gray-600">{result.key}</div>
          <button className="float-right mt-2 px-2 py-1 bg-blue-500 text-white rounded">Copy</button>
        </div>
      ))}
    </div>
  );
};

export default SearchResults;
4. 全局样式调整
最后，我们在 tailwind.config.js 中配置相关样式，确保整体设计符合现代化规范。
修改 tailwind.config.js
js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        'full': '9999px',
      },
      boxShadow: {
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      },
      colors: {
        primary: '#3498db',
        secondary: '#2ecc71',
      },
    },
  },
  plugins: [],
};

5. 窗口行为与全局快捷键配置
为实现真正的悬浮工具条效果，需要调整窗口行为和全局快捷键配置。

5.1 Tauri 配置调整
在 tauri.conf.json 中配置窗口为无边框、透明且不显示在任务栏：
json
{
  "app": {
    "windows": [
      {
        "title": "api-key-manager",
        "width": 300,
        "height": 100,
        "decorations": false,
        "skipTaskbar": true,
        "transparent": true,
        "hiddenTitle": true,
        "focus": false,
        "visible": false
      }
    ]
  }
}

5.2 前端窗口控制
在生产环境中默认隐藏主窗口，只通过全局快捷键显示悬浮工具条：
tsx
useEffect(() => {
  if (!isDev) {
    // 在生产环境中隐藏主窗口
    getCurrentWebviewWindow().hide();
  }
}, [isDev]);

5.3 Tauri 后端全局快捷键处理
在 Tauri 后端注册全局快捷键并处理显示逻辑：
rust
tauri::Builder::default()
  .plugin(
    tauri_plugin_global_shortcut::Builder::new()
      .with_shortcuts(["Ctrl+Shift+K"])
      .unwrap()
      .with_handler(|app, _shortcut, event| {
        if event.state == ShortcutState::Pressed {
          // 获取主窗口并显示它
          if let Some(window) = app.get_webview_window("main") {
            let _ = window.show();
            let _ = window.set_focus();
          }
        }
      })
      .build(),
  )
  .setup(|app| {
    // 在生产环境中隐藏主窗口
    #[cfg(not(debug_assertions))]
    if let Some(window) = app.get_webview_window("main") {
      let _ = window.hide();
    }
  })