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