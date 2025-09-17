# 函数索引（更新于 2025-09-17）

本文档列出项目中主要的服务、组件与工具函数，便于查找与复用。

## 一、服务层（services）

### apiKeyService（src/services/apiKeyService.ts）
- addApiKey(apiKey: Omit<ApiKey, 'id'|'createdAt'|'updatedAt'>): Promise<ServiceResult<ApiKey>>
  - 新增 API Key，带输入验证与错误包装；被 AddApiKeyDialog 调用。
- editApiKey(apiKey: ApiKey): Promise<ServiceResult<ApiKey>>
- deleteApiKey(id: string): Promise<ServiceResult<boolean>>
- listApiKeys(): Promise<ServiceResult<ApiKey[]>>
- searchKeys(keyword: string): Promise<ServiceResult<ApiKey[]>>
- copyToClipboard(id: string): Promise<ServiceResult<boolean>>

### groupService（同文件导出）
- listGroups(): Promise<ServiceResult<Group[]>>
- addGroup(group: Omit<Group, 'id'|'createdAt'|'updatedAt'>): Promise<ServiceResult<Group>>

### usageHistoryService（同文件导出）
- recordUsage(keyId: string): Promise<ServiceResult<UsageHistory>>
- getUsageHistory(keyId: string): Promise<ServiceResult<UsageHistory[]>>

### clipboardService（src/services/clipboardService.ts）
- getClipboardContent(authorization?, metadataId?): Promise<string>
- copyToClipboard(text: string, level, authorization?, options?): Promise<{ success: boolean; metadataId?: string }>
- clearClipboard(metadataId?): Promise<boolean>
- getClipboardMetadata(metadataId): ClipboardContentMetadata | undefined
- isClipboardValid(metadataId): boolean
- getActiveOperations(): { metadataId, expiresAt, securityLevel }[]

### searchService（src/services/searchService.ts）
- searchKeys(keyword: string): Promise<{ data: ApiKey[]; error?: string }>

### searchOptimizationService（src/services/searchOptimizationService.ts）
- 智能搜索缓存和优化服务，实现LRU缓存机制和模糊搜索

### toastService（src/services/toastService.ts）
- success/error/warning/info(title, message?, options?)
- remove(id), clear(), subscribe(listener)

### secureLogging（src/services/secureLogging.ts）
- logSecureError(context: OperationContext, error: any, additionalInfo?): void
- logSecureInfo(context: OperationContext, message: string, data?): void
- logSecureWarning(context: OperationContext, message: string, data?): void
- getUserFriendlyErrorMessage(context: OperationContext): string

### errors（src/services/errors.ts）
- ServiceResult<T> 统一错误响应接口
- ErrorCode 错误代码枚举
- createSuccessResult / createErrorResult 结果创建函数
- wrapServiceOperation 异步错误处理包装器

## 二、组件（components）

## 二、组件（components）

### FloatingToolbar（src/components/FloatingToolbar/FloatingToolbar.tsx）
- 主界面搜索工具条：
  - 键入调用 searchService 搜索，结果由 SearchResults 显示；
  - "+" 打开 AddApiKeyDialog；
  - "…" 打开 RadialMenu，选择后按 providers 匹配精筛并展示结果；
  - 仅工具条可拖动，无全屏遮罩（设计图一致）。

### RadialMenu（src/components/RadialMenu/RadialMenu.tsx）
- RadialMenu({ options: {id,label,icon?}[], onSelect, onClose, center? })
- 胶囊按钮沿弧线排列；仅对悬停项绘制单条连线；外部点击或选择后关闭。

### SearchResults（src/components/SearchResults/SearchResults.tsx）
- SearchResults({ results, onCopy, position, providerLabel? })
- 纸片式面板；右侧图标复制按钮；可选左上提供商胶囊。

### AddApiKeyDialog（src/components/AddApiKey/AddApiKeyDialog.tsx）
- AddApiKeyDialog({ open, onClose, onAdded })
- 表单项：名称、Key、提供商、描述；提交调用 apiKeyService.addApiKey。

### Icon 库（src/components/Icon/Icon.tsx）
- SearchIcon, PlusIcon, EllipsisIcon, GearIcon, CloseIcon, CopyIcon, CheckIcon

### VirtualList（src/components/VirtualScroll/VirtualList.tsx）
- VirtualList<T>({ items, renderItem, itemHeight, containerHeight, overscan?, className?, onScroll? })
- 高性能虚拟滚动组件，支持动态高度和过扫描优化
- useVirtualList<T>(items, options) - 虚拟滚动hook

## 三、常量与工具

### constants/index.ts
- UI_CONSTANTS / SECURITY_CONSTANTS / API_CONSTANTS / …

### constants/providers.ts
- PROVIDERS: { id, label, aliases[] }[]
- matchProvider(name?, platform?, tags?, providerIdOrLabel?) => boolean

### utils/helpers.ts
- cn(...classes): string（支持对象条件写法）
- formatDateTime(ts), generateId(), debounce(), throttle(), deepClone()

### hooks（src/hooks/）
- useAdaptiveTheme(): AdaptiveThemeResult - 自适应主题hook
- useBackgroundGradient() - 背景渐变管理hook
- useThemeTransition() - 主题切换性能优化hook
- useApiKey() - API Key管理hook
- useClipboard() - 剪贴板操作hook
- useSearch() - 搜索功能hook
- useToast() - Toast通知hook

## 四、全局快捷键与窗口管理

### Tauri 全局快捷键配置（src-tauri/src/main.rs）
- 使用 Ctrl+Shift+K 快捷键唤起悬浮工具条
- 在生产环境中，默认隐藏主窗口，只通过快捷键显示悬浮工具条
- 开发环境中保持主应用窗口可见，用于调试

### 前端窗口控制（src/App.tsx）
- 在生产环境中应用启动时自动隐藏主窗口
- 通过 getCurrentWebviewWindow().hide() 隐藏窗口
- 悬浮工具条通过状态控制显示/隐藏

## 五、样式系统

### theme.css（src/styles/theme.css）
- 主题切换性能优化样式
- 暗色/亮色模式滚动条样式
- 高性能容器和过渡效果

### tokens.css（src/styles/tokens.css）
- 设计令牌（Design Tokens）
- 间距、尺寸、圆角、字体、阴影等CSS变量
- 磨砂玻璃效果变量定义

## 六、类型（types）
- types/apiKey.ts：ApiKey, Group, UsageHistory...
- types/clipboardSecurity.ts：ClipboardOperation, ClipboardSecurityLevel, ClipboardContentMetadata(iv 可选) 等

## 备注
- 本次（2025-09-17）新增/更新：安全日志服务、统一错误处理、虚拟滚动组件、主题性能优化、设计系统化、自适应背景渐变等功能。

