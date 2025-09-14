# 函数索引文档

## 概述
本文档旨在记录项目中所有重要的函数和方法，以避免重复开发并促进代码重用。

## 服务层函数

### apiKeyService
位置: `src/services/apiKeyService.ts`

#### addApiKey
- **功能**: 添加新的API Key，包含完整验证和加密
- **参数**: `Omit<ApiKey, "id" | "createdAt" | "updatedAt">`
- **返回值**: `Promise<ServiceResult<ApiKey>>`
- **用途**: 创建新的API密钥记录，支持输入验证和安全加密
- **错误处理**: 标准化的ServiceResult错误响应

#### editApiKey
- **功能**: 编辑现有API Key
- **参数**: `ApiKey`
- **返回值**: `Promise<ServiceResult<ApiKey>>`
- **用途**: 更新现有API密钥信息
- **错误处理**: 使用executeOperation统一错误处理，支持ID验证

#### deleteApiKey
- **功能**: 删除API Key
- **参数**: `string` (API Key ID)
- **返回值**: `Promise<ServiceResult<boolean>>`
- **用途**: 从存储中删除指定的API密钥
- **错误处理**: 使用executeOperation统一错误处理，包含乐观删除机制

#### listApiKeys
- **功能**: 获取API Key列表
- **参数**: 无
- **返回值**: `Promise<ServiceResult<ApiKey[]>>`
- **用途**: 获取所有API密钥的列表
- **错误处理**: 使用executeOperation统一错误处理

#### searchKeys
- **功能**: 搜索API Key
- **参数**: `string` (搜索关键词)
- **返回值**: `Promise<ServiceResult<ApiKey[]>>`
- **用途**: 根据关键词搜索API密钥
- **错误处理**: 使用executeOperation统一错误处理

#### copyToClipboard
- **功能**: 复制API Key到剪贴板
- **参数**: `string` (API Key值)
- **返回值**: `Promise<ServiceResult<boolean>>`
- **用途**: 将API密钥值复制到系统剪贴板
- **错误处理**: 使用executeOperation统一错误处理

### groupService
位置: `src/services/apiKeyService.ts`

#### listGroups
- **功能**: 获取分组列表
- **参数**: 无
- **返回值**: `Promise<ServiceResult<Group[]>>`
- **用途**: 获取所有分组的列表
- **错误处理**: 使用executeOperation统一错误处理

#### addGroup
- **功能**: 添加新分组
- **参数**: `Omit<Group, "id" | "createdAt" | "updatedAt">`
- **返回值**: `Promise<ServiceResult<Group>>`
- **用途**: 创建新的分组
- **错误处理**: 使用executeOperation统一错误处理

### usageHistoryService
位置: `src/services/apiKeyService.ts`

#### recordUsage
- **功能**: 记录使用历史
- **参数**: `string` (API Key ID)
- **返回值**: `Promise<ServiceResult<boolean>>`
- **用途**: 记录API密钥的使用情况
- **错误处理**: 使用executeOperation统一错误处理

#### getUsageHistory
- **功能**: 获取使用历史
- **参数**: `string` (API Key ID)
- **返回值**: `Promise<ServiceResult<UsageHistory[]>>`
- **用途**: 获取指定API密钥的使用历史记录
- **错误处理**: 使用executeOperation统一错误处理

### clipboardService
位置: `src/services/clipboardService.ts`

#### getClipboardContent
- **功能**: 获取剪贴板内容
- **参数**: 无
- **返回值**: `Promise<string>`
- **用途**: 获取系统剪贴板中的文本内容
- **错误处理**: 支持剪贴板权限检查和错误恢复

#### copyToClipboard
- **功能**: 复制内容到剪贴板
- **参数**: `string` (要复制的内容)
- **返回值**: `Promise<boolean>`
- **用途**: 将指定内容复制到系统剪贴板
- **错误处理**: 支持剪贴板权限检查和错误恢复

### searchService
位置: `src/services/searchService.ts`

#### searchKeys
- **功能**: 搜索API Key
- **参数**: `string` (搜索关键词)
- **返回值**: `Promise<ServiceResult<ApiKey[]>>`
- **用途**: 根据关键词搜索API密钥
- **错误处理**: 使用executeOperation统一错误处理

#### showSearchToolbar
- **功能**: 显示搜索工具条
- **参数**: 无
- **返回值**: `void`
- **用途**: 触发显示搜索工具条
- **优化**: 使用防抖技术，避免频繁状态更新

#### hideSearchToolbar
- **功能**: 隐藏搜索工具条
- **参数**: 无
- **返回值**: `void`
- **用途**: 触发隐藏搜索工具条
- **优化**: 清理所有定时器和监听器，防止内存泄漏

### smartClipboardService
位置: `src/services/smartClipboardService.ts`

#### checkOllamaStatus
- **功能**: 检查Ollama服务状态
- **参数**: 无
- **返回值**: `Promise<boolean>`
- **用途**: 检查本地LLM服务是否可用
- **错误处理**: 网络超时和连接错误处理

#### analyzeText
- **功能**: 分析文本中的API Key
- **参数**: `string` (要分析的文本)
- **返回值**: `Promise<AnalyzedKey[]>`
- **用途**: 使用LLM或正则表达式分析文本中的API密钥
- **错误处理**: LLM服务失败时自动降级到正则表达式分析

#### importAnalyzedKeys
- **功能**: 导入分析的API Key
- **参数**: `AnalyzedKey[]` (分析结果)
- **返回值**: `Promise<boolean>`
- **用途**: 将分析出的API密钥导入到系统中
- **错误处理**: 支持批量导入和部分失败处理

## 组件函数

### KeyManager 组件
位置: `src/components/KeyManager/KeyManager.tsx`

#### fetchData
- **功能**: 获取API Keys和分组数据
- **参数**: 无
- **返回值**: `Promise<void>`
- **用途**: 从服务层获取数据并更新组件状态

#### copyToClipboard
- **功能**: 复制API Key到剪贴板
- **参数**: `string` (API Key值)
- **返回值**: `Promise<void>`
- **用途**: 调用服务层函数复制API密钥到剪贴板

#### deleteApiKey
- **功能**: 删除API Key
- **参数**: `string` (API Key ID)
- **返回值**: `Promise<void>`
- **用途**: 调用服务层函数删除API密钥

### SearchToolbar 组件
位置: `src/components/SearchToolbar/SearchToolbar.tsx`

#### handleSearch
- **功能**: 处理搜索
- **参数**: `string` (搜索关键词)
- **返回值**: `Promise<void>`
- **用途**: 调用服务层函数搜索API密钥

#### copyToClipboard
- **功能**: 复制API Key到剪贴板
- **参数**: `ApiKey` (API密钥对象)
- **返回值**: `Promise<void>`
- **用途**: 调用服务层函数复制API密钥到剪贴板

#### showRadial
- **功能**: 显示径向菜单
- **参数**: `ApiKey` (API密钥对象)
- **返回值**: `void`
- **用途**: 显示指定API密钥的径向菜单

### SmartClipboard 组件
位置: `src/components/SmartClipboard/SmartClipboard.tsx`

#### checkOllama
- **功能**: 检查Ollama服务状态
- **参数**: 无
- **返回值**: `Promise<void>`
- **用途**: 调用服务层函数检查LLM服务状态

#### getClipboardContent
- **功能**: 获取剪贴板内容
- **参数**: 无
- **返回值**: `Promise<void>`
- **用途**: 调用服务层函数获取剪贴板内容

#### analyzeText
- **功能**: 分析文本
- **参数**: 无
- **返回值**: `Promise<void>`
- **用途**: 调用服务层函数分析剪贴板文本

#### importKeys
- **功能**: 导入分析的API Key
- **参数**: 无
- **返回值**: `Promise<void>`
- **用途**: 调用服务层函数导入分析出的API密钥

## 工具函数

### ServiceResult 统一错误处理
位置: `src/services/apiKeyService.ts`

#### executeOperation
- **功能**: 统一操作执行和错误处理
- **参数**: `<T>(operation: () => Promise<T>, context: OperationContext, errorContext?: Record<string, unknown>)`
- **返回值**: `Promise<ServiceResult<T>>`
- **用途**: 消除代码重复，提供一致的错误处理和日志记录
- **特性**: 自动重试、上下文错误映射、性能监控

#### validateAndHandleId
- **功能**: ID验证和错误处理
- **参数**: `id: string`
- **返回值**: `ServiceResult<string>`
- **用途**: 验证ID格式和有效性，统一错误响应

#### mapContextToErrorCode
- **功能**: 上下文到错误代码映射
- **参数**: `context: OperationContext`
- **返回值**: `ErrorCode`
- **用途**: 将操作上下文映射到标准错误代码

### Validator
位置: `src/services/validation.ts`

#### validateApiKey
- **功能**: 验证API Key数据
- **参数**: `ApiKeyInput` (待验证的数据)
- **返回值**: `{ isValid: boolean; errors: string[] }`
- **用途**: 验证API密钥数据的有效性
- **类型安全**: 使用ApiKeyInput接口替代any类型

#### validateGroup
- **功能**: 验证分组数据
- **参数**: `GroupInput` (待验证的数据)
- **返回值**: `{ isValid: boolean; errors: string[] }`
- **用途**: 验证分组数据的有效性
- **类型安全**: 使用GroupInput接口替代any类型

### generateId
位置: `src/services/apiKeyService.ts`

#### generateId
- **功能**: 生成唯一ID
- **参数**: 无
- **返回值**: `string`
- **用途**: 为新创建的记录生成唯一标识符
- **安全性**: 使用crypto.randomUUID()确保唯一性和安全性

## 自定义错误类型

### ServiceResult 统一错误处理
位置: `src/services/errors.ts`

#### ServiceResult<T>
- **功能**: 统一的服务响应类型
- **用途**: 标准化API响应格式，包含成功状态、数据和错误信息
- **结构**: `{ success: boolean; data?: T; error?: string; code?: ErrorCode }`

#### ErrorCode
- **功能**: 标准化错误代码枚举
- **用途**: 统一错误标识和处理
- **包含**: VALIDATION_ERROR, NOT_FOUND, NETWORK_ERROR, PERMISSION_ERROR等

### Toast 通知系统
位置: `src/services/toastService.ts`

#### ToastService
- **功能**: 全局Toast通知管理
- **用途**: 替代alert()调用，提供现代化用户体验
- **特性**: 自动消失、位置配置、类型分类、防重复

#### useToast Hook
- **功能**: React Toast通知Hook
- **用途**: 在组件中便捷使用Toast通知
- **国际化**: 统一使用英文界面文本

### ErrorBoundary 错误边界
位置: `src/components/ErrorBoundary/ErrorBoundary.tsx`

#### ErrorBoundary
- **功能**: React错误边界组件
- **用途**: 捕获和处理组件错误，提供优雅的错误恢复
- **特性**: 错误日志记录、用户友好的错误界面、一键恢复

### Constants 常量管理
位置: `src/constants/index.ts`

#### UI_CONSTANTS
- **功能**: UI相关常量
- **用途**: 集中管理动画时长、Toast配置、颜色值等

#### SECURITY_CONSTANTS
- **功能**: 安全相关常量
- **用途**: 管理加密算法、超时时间、重试次数等

#### API_CONSTANTS
- **功能**: API相关常量
- **用途**: 管理端点路径、HTTP状态码、错误消息等

## 更新记录

### 2025-01-14 - Phase 3 质量改进完成
- **ServiceResult<T>统一错误处理**: 所有服务方法更新为统一的错误处理模式
- **代码去重优化**: 提取executeOperation、validateAndHandleId等公共helper函数
- **类型安全增强**: 使用ApiKeyInput、GroupInput等接口替代any类型
- **Toast通知系统**: 创建现代化的通知系统，替换所有alert()调用
- **常量管理系统**: 建立constants/index.ts统一常量管理
- **错误边界完善**: 添加ErrorBoundary组件和错误恢复机制
- **国际化准备**: 统一使用英文命名和界面文本
- **完整文档**: 为所有新增函数和组件添加详细文档

### 2025-09-03
- 添加了服务层函数索引
- 添加了组件函数索引
- 添加了工具函数索引
- 添加了自定义错误类型索引

### 2025-09-02
- 初始化函数索引文档结构