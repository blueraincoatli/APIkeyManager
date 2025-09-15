1. 概述
APIkeyManager 是一个专为 AIGC 开发者和研究人员设计的个人 API Key 管理桌面软件。其核心功能包括 API Key 的管理、快速搜索、智能剪贴板等。现有设计已经具备现代化的 UI 元素，如磨砂玻璃效果和径向菜单，但需要进一步优化以满足新的设计要求。
2. 技术栈与依赖
前端：React 18 + TypeScript + Tailwind CSS
构建工具：Vite
3. 组件架构
3.1 Component Definition
FloatingToolbar：主界面中的搜索工具条，包含搜索框、添加按钮、配置图标和关闭按钮。
RadialMenu：鼠标点击“更多”图标时弹出的环形菜单，选项沿弧线排列。
SearchResults：搜索或点击环形菜单选项后弹出的 API key 搜索结果列表。
3.2 Component Hierarchy
App
├── FloatingToolbar
│   ├── SearchInput
│   ├── AddButton
│   ├── RadialMenuTrigger
│   ├── SettingsButton
│   └── CloseButton
├── RadialMenu
│   ├── MenuItem
│   └── MenuAnimation
└── SearchResults
    ├── ResultItem
    │   ├── APIKeyName
    │   └── CopyButton
    └── ScrollBar
3.3 Props/State Management
FloatingToolbar：管理搜索状态、显示/隐藏 RadialMenu 和 SearchResults。
RadialMenu：根据鼠标位置动态显示更多选项，并绘制连线指示。
SearchResults：根据搜索结果动态渲染列表，并处理拷贝操作。
3.4 Lifecycle Methods/Hooks
useEffect：用于监听搜索输入变化和 RadialMenu 的动画效果。
useState：管理组件状态，如搜索结果、RadialMenu 的显示状态等。
3.5 Example of Component Usage
jsx
<FloatingToolbar />
<RadialMenu />
<SearchResults />
4. Routing & Navigation
项目主要通过事件（如点击、快捷键）进行导航，无需复杂的路由配置。
5. Styling Strategy
Tailwind CSS：用于实现磨砂玻璃效果、投影和圆角等现代设计元素。
backdrop-blur-xl：实现磨砂玻璃效果。
shadow-xl 和 shadow-2xl：创建层次感的投影效果。
6. State Management
使用 React 的 Context API 或 Redux 进行状态管理，确保数据在组件间高效传递。
7. API Integration Layer
通过 Tauri 命令调用 Rust 后端功能，实现 API Key 的管理和搜索。
8. Testing Strategy
使用 Vitest 进行单元测试和集成测试，确保新设计的功能正确性和稳定性。
设计细节
过渡效果
保持现有的过渡效果设置，不需要进一步调整持续时间和缓动函数。
过渡效果实现
jsx
const RadialMenuItem = styled.div`
  transition: transform 0.2s ease-in-out;
  &:hover {
    transform: scale(1.05); // 鼠标悬停时放大 5%
  }
`;
连线坐标计算
从图标中心到鼠标位置计算初始坐标，但在显示时调整起点和终点位置，使其从图标外缘到选项外轮廓线。
连线坐标计算实现
jsx
const calculateConnectorLinePoints = (iconCenter, mousePosition, iconRadius, optionBounds) => {
  // 从图标中心到鼠标位置计算初始坐标
  const initialStartPoint = { x: iconCenter.x, y: iconCenter.y };
  const initialEndPoint = { x: mousePosition.x, y: mousePosition.y };

  // 调整起点到图标外缘
  const startPoint = {
    x: initialStartPoint.x + (initialEndPoint.x - initialStartPoint.x) * (iconRadius / distance(initialStartPoint, initialEndPoint)),
    y: initialStartPoint.y + (initialEndPoint.y - initialStartPoint.y) * (iconRadius / distance(initialStartPoint, initialEndPoint))
  };

  // 调整终点到选项外轮廓线
  const endPoint = {
    x: optionBounds.left + (optionBounds.right - optionBounds.left) * (initialEndPoint.x - optionBounds.left) / (optionBounds.right - optionBounds.left),
    y: optionBounds.top + (optionBounds.bottom - optionBounds.top) * (initialEndPoint.y - optionBounds.top) / (optionBounds.bottom - optionBounds.top)
  };

  return { startPoint, endPoint };
};

const distance = (point1, point2) => {
  return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
};

9. 悬浮工具条窗口行为
9.1 窗口配置
- 在生产环境中，默认隐藏主窗口，只通过全局快捷键（Ctrl+Shift+K）显示悬浮工具条
- 开发环境中保持主应用窗口可见，用于调试和开发
- 窗口配置为无边框、透明且不显示在任务栏中

9.2 全局快捷键
- 使用 Ctrl+Shift+K 快捷键唤起悬浮工具条
- 快捷键在 Tauri 后端注册，确保即使应用失去焦点也能响应
- 快捷键触发时显示并聚焦主窗口，使悬浮工具条可见
