# 函数索引文档

## 概述
本文档旨在记录项目中所有重要的函数和方法，以避免重复开发并促进代码重用。

## 服务层函数

### apiKeyService
位置: `src/services/apiKeyService.ts`

#### addApiKey
- **功能**: 添加新的API Key
- **参数**: `Omit<ApiKey, "id" | "createdAt" | "updatedAt">`
- **返回值**: `Promise<{ success: boolean; error?: string }>`
- **用途**: 创建新的API密钥记录

#### editApiKey
- **功能**: 编辑现有API Key
- **参数**: `ApiKey`
- **返回值**: `Promise<{ success: boolean; error?: string }>`
- **用途**: 更新现有API密钥信息

#### deleteApiKey
- **功能**: 删除API Key
- **参数**: `string` (API Key ID)
- **返回值**: `Promise<{ success: boolean; error?: string }>`
- **用途**: 从存储中删除指定的API密钥

#### listApiKeys
- **功能**: 获取API Key列表
- **参数**: 无
- **返回值**: `Promise<{ data: ApiKey[]; error?: string }>`
- **用途**: 获取所有API密钥的列表

#### searchKeys
- **功能**: 搜索API Key
- **参数**: `string` (搜索关键词)
- **返回值**: `Promise<{ data: ApiKey[]; error?: string }>`
- **用途**: 根据关键词搜索API密钥

#### copyToClipboard
- **功能**: 复制API Key到剪贴板
- **参数**: `string` (API Key值)
- **返回值**: `Promise<{ success: boolean; error?: string }>`
- **用途**: 将API密钥值复制到系统剪贴板

### groupService
位置: `src/services/apiKeyService.ts`

#### listGroups
- **功能**: 获取分组列表
- **参数**: 无
- **返回值**: `Promise<{ data: Group[]; error?: string }>`
- **用途**: 获取所有分组的列表

#### addGroup
- **功能**: 添加新分组
- **参数**: `Omit<Group, "id" | "createdAt" | "updatedAt">`
- **返回值**: `Promise<{ success: boolean; error?: string }>`
- **用途**: 创建新的分组

### usageHistoryService
位置: `src/services/apiKeyService.ts`

#### recordUsage
- **功能**: 记录使用历史
- **参数**: `string` (API Key ID)
- **返回值**: `Promise<{ success: boolean; error?: string }>`
- **用途**: 记录API密钥的使用情况

#### getUsageHistory
- **功能**: 获取使用历史
- **参数**: `string` (API Key ID)
- **返回值**: `Promise<{ data: UsageHistory[]; error?: string }>`
- **用途**: 获取指定API密钥的使用历史记录

### clipboardService
位置: `src/services/clipboardService.ts`

#### getClipboardContent
- **功能**: 获取剪贴板内容
- **参数**: 无
- **返回值**: `Promise<string>`
- **用途**: 获取系统剪贴板中的文本内容

#### copyToClipboard
- **功能**: 复制内容到剪贴板
- **参数**: `string` (要复制的内容)
- **返回值**: `Promise<boolean>`
- **用途**: 将指定内容复制到系统剪贴板

### searchService
位置: `src/services/searchService.ts`

#### searchKeys
- **功能**: 搜索API Key
- **参数**: `string` (搜索关键词)
- **返回值**: `Promise<{ data: ApiKey[]; error?: string }>`
- **用途**: 根据关键词搜索API密钥

#### showSearchToolbar
- **功能**: 显示搜索工具条
- **参数**: 无
- **返回值**: `void`
- **用途**: 触发显示搜索工具条

#### hideSearchToolbar
- **功能**: 隐藏搜索工具条
- **参数**: 无
- **返回值**: `void`
- **用途**: 触发隐藏搜索工具条

### smartClipboardService
位置: `src/services/smartClipboardService.ts`

#### checkOllamaStatus
- **功能**: 检查Ollama服务状态
- **参数**: 无
- **返回值**: `Promise<boolean>`
- **用途**: 检查本地LLM服务是否可用

#### analyzeText
- **功能**: 分析文本中的API Key
- **参数**: `string` (要分析的文本)
- **返回值**: `Promise<AnalyzedKey[]>`
- **用途**: 使用LLM或正则表达式分析文本中的API密钥

#### importAnalyzedKeys
- **功能**: 导入分析的API Key
- **参数**: `AnalyzedKey[]` (分析结果)
- **返回值**: `Promise<boolean>`
- **用途**: 将分析出的API密钥导入到系统中

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

### Validator
位置: `src/services/validation.ts`

#### validateApiKey
- **功能**: 验证API Key数据
- **参数**: `any` (待验证的数据)
- **返回值**: `{ isValid: boolean; errors: string[] }`
- **用途**: 验证API密钥数据的有效性

#### validateGroup
- **功能**: 验证分组数据
- **参数**: `any` (待验证的数据)
- **返回值**: `{ isValid: boolean; errors: string[] }`
- **用途**: 验证分组数据的有效性

### generateId
位置: `src/services/apiKeyService.ts`

#### generateId
- **功能**: 生成唯一ID
- **参数**: 无
- **返回值**: `string`
- **用途**: 为新创建的记录生成唯一标识符

## 自定义错误类型

### ApiKeyServiceError
位置: `src/services/errors.ts`

#### ApiKeyServiceError
- **功能**: API服务基础错误类型
- **用途**: 所有API服务相关错误的基类

#### NetworkError
- **功能**: 网络错误类型
- **用途**: 表示网络连接相关的错误

#### ValidationError
- **功能**: 验证错误类型
- **用途**: 表示数据验证相关的错误

## 更新记录

### 2025-09-03
- 添加了服务层函数索引
- 添加了组件函数索引
- 添加了工具函数索引
- 添加了自定义错误类型索引

### 2025-09-02
- 初始化函数索引文档结构