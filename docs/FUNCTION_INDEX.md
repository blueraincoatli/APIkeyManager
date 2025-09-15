# 函数索引（更新于 2025-09-14）

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

### toastService（src/services/toastService.ts）
- success/error/warning/info(title, message?, options?)
- remove(id), clear(), subscribe(listener)

## 二、组件（components）

### FloatingToolbar（src/components/FloatingToolbar/FloatingToolbar.tsx）
- 主界面搜索工具条：
  - 键入调用 searchService 搜索，结果由 SearchResults 显示；
  - “+” 打开 AddApiKeyDialog；
  - “…” 打开 RadialMenu，选择后按 providers 匹配精筛并展示结果；
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

## 三、常量与工具

### constants/index.ts
- UI_CONSTANTS / SECURITY_CONSTANTS / API_CONSTANTS / …

### constants/providers.ts
- PROVIDERS: { id, label, aliases[] }[]
- matchProvider(name?, platform?, tags?, providerIdOrLabel?) => boolean

### utils/helpers.ts
- cn(...classes): string（支持对象条件写法）
- formatDateTime(ts), generateId(), debounce(), throttle(), deepClone()

## 四、全局快捷键与窗口管理

### Tauri 全局快捷键配置（src-tauri/src/main.rs）
- 使用 Ctrl+Shift+K 快捷键唤起悬浮工具条
- 在生产环境中，默认隐藏主窗口，只通过快捷键显示悬浮工具条
- 开发环境中保持主应用窗口可见，用于调试

### 前端窗口控制（src/App.tsx）
- 在生产环境中应用启动时自动隐藏主窗口
- 通过 getCurrentWebviewWindow().hide() 隐藏窗口
- 悬浮工具条通过状态控制显示/隐藏

## 五、类型（types）
- types/apiKey.ts：ApiKey, Group, UsageHistory...
- types/clipboardSecurity.ts：ClipboardOperation, ClipboardSecurityLevel, ClipboardContentMetadata(iv 可选) 等

## 备注
- 本次（2025-09-14）新增/更新：AddApiKeyDialog、Icon 库、providers 与 matchProvider、RadialMenu 通用化、SearchResults 统一样式、FloatingToolbar 联动逻辑与开发/生产视图区分。

