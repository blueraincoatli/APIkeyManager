# API Key Manager 需求分析与开发计划

## 1. 概述

### 1.1 项目背景
API Key Manager 是一款轻量、简洁、安全的个人API Key管理桌面软件，旨在为AIGC开发者和研究人员提供便捷的Key管理和快速调用功能。

### 1.2 核心价值主张
- **轻量高效**：快速启动，低资源占用
- **便捷易用**：简洁界面，直观操作
- **快速调用**：全局快捷键，无缝集成开发流程
- **安全可靠**：本地加密存储，保护敏感数据

## 2. 技术架构

### 2.1 整体架构
```
┌─────────────────────────────────────────────┐
│                  前端层                      │
│  React + TypeScript + Tailwind CSS          │
│  • 用户界面组件                             │
│  • 状态管理                                │
│  • 用户交互处理                            │
└─────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│                  Tauri层                    │
│  Rust                                        │
│  • 窗口管理                                │
│  • 全局快捷键注册                          │
│  • 文件系统操作                            │
│  • 剪贴板访问                              │
│  • 数据库加密操作                          │
└─────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│                  数据层                     │
│  SQLite + SQLCipher                         │
│  • API Key加密存储                         │
│  • 用户配置存储                            │
│  • 使用历史记录                            │
└─────────────────────────────────────────────┘
```

### 2.2 技术选型
- **桌面框架**：Tauri (Rust)
- **前端框架**：React 18 + TypeScript
- **样式方案**：Tailwind CSS
- **构建工具**：Vite
- **数据库**：SQLite + SQLCipher 加密
- **加密算法**：AES-256-GCM
- **密钥派生**：Argon2id

## 3. 功能模块设计

### 3.1 核心功能模块

#### 3.1.1 API Key管理模块
- 添加新的API Key（支持手动输入和剪贴板导入）
- 编辑现有API Key信息
- 删除API Key（含确认机制）
- 批量操作支持
- 分组和标签管理

#### 3.1.2 快速搜索与调用模块
- 全局快捷键唤出搜索界面（默认Ctrl+Shift+K）
- 实时搜索过滤
- 一键复制到剪贴板
- 使用历史记录
- 极简工具条界面设计
- 浮层显示，不遮挡用户操作界面
- 径向菜单（Pie Menu）替代传统下拉菜单

#### 3.1.3 安全存储模块
- 主密码保护
- SQLite数据库加密存储
- 自动锁定机制（闲置超时）

### 3.2 高级功能模块（第二阶段）

#### 3.2.1 智能识别模块
- 剪贴板监控自动识别API Key格式
- 智能提示保存新Key
- 智能剪贴板文本分析与导入
- 本地LLM辅助分析（Ollama）

#### 3.2.2 生态集成模块
- VS Code插件开发
- 主流IDE扩展支持
- 浏览器扩展（可选）

### 3.3 模块详细设计

#### 3.3.1 前端模块结构

```
src/
├── components/          # React UI组件
│   ├── KeyManager/      # API Key管理相关组件
│   ├── SearchToolbar/   # 搜索工具条组件
│   ├── RadialMenu/      # 径向菜单组件
│   ├── SmartClipboard/  # 智能剪贴板组件
│   ├── Settings/        # 设置界面组件
│   └── common/          # 通用UI组件
├── hooks/               # 自定义React Hooks
├── lib/                 # 工具函数和库
├── services/            # API服务调用
├── stores/              # 状态管理
├── types/               # TypeScript类型定义
└── utils/               # 工具函数
```

#### 3.3.2 后端模块结构

```
src-tauri/
├── src/
│   ├── main.rs          # 程序入口点
│   ├── lib.rs           # 库模块
│   ├── commands/        # Tauri命令
│   ├── database/        # 数据库操作模块
│   ├── security/        # 安全相关模块
│   ├── clipboard/       # 剪贴板操作模块
│   ├── llm/             # 本地LLM分析模块
│   └── utils/           # 工具函数
├── Cargo.toml          # Rust依赖配置
└── tauri.conf.json     # Tauri配置文件
```

### 3.3.3 智能剪贴板模块设计

#### 3.3.3.1 功能概述
智能剪贴板模块允许用户批量导入API Key，通过本地LLM分析文本内容，自动提取和分类API Key信息。

#### 3.3.3.2 工作流程
1. 用户将包含API Key的文本粘贴到智能剪贴板
2. 系统使用正则表达式进行初步提取
3. 调用本地Ollama服务进行深度分析和分类
4. 展示分析结果供用户确认
5. 用户确认后批量导入数据库

#### 3.3.3.3 LLM分析提示词设计
```
请分析以下文本，提取其中的API Key信息。对于每个API Key，请提供：
1. 平台名称（如gemini, deepseek等）
2. API Key值
3. 可能的描述或名称
4. 分组建议

文本内容：
{text}

请以JSON格式返回结果：
[
  {
    "platform": "平台名称",
    "key": "API Key值",
    "name": "描述或名称",
    "group": "建议分组"
  }
]
```

### 3.4 数据模型设计

#### 3.4.1 API Key数据表
```sql
CREATE TABLE api_keys (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  key_value TEXT NOT NULL,  -- 加密存储
  platform TEXT,
  description TEXT,
  group_id TEXT,
  tags TEXT,  -- JSON格式存储标签
  created_at INTEGER,
  updated_at INTEGER,
  last_used_at INTEGER
);
```

#### 3.4.2 分组数据表
```sql
CREATE TABLE groups (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at INTEGER,
  updated_at INTEGER
);
```

#### 3.4.3 使用历史记录表
```sql
CREATE TABLE usage_history (
  id TEXT PRIMARY KEY,
  key_id TEXT NOT NULL,
  used_at INTEGER,
  FOREIGN KEY (key_id) REFERENCES api_keys(id)
);
```

#### 3.4.4 配置表
```sql
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
```

#### 3.4.5 批量导入记录表
```sql
CREATE TABLE batch_imports (
  id TEXT PRIMARY KEY,
  source TEXT,  -- 导入来源（clipboard, file等）
  total_count INTEGER,  -- 总数
  success_count INTEGER,  -- 成功导入数
  failed_count INTEGER,  -- 失败数
  created_at INTEGER,
  details TEXT  -- JSON格式存储详细信息
);
```

### 3.5 API接口规范

#### 3.5.1 Tauri命令接口

| 命令 | 参数 | 返回值 | 描述 |
|------|------|--------|------|
| add_api_key | ApiKey对象 | Boolean | 添加新的API Key |
| edit_api_key | ApiKey对象 | Boolean | 编辑API Key |
| delete_api_key | key_id: string | Boolean | 删除API Key |
| list_api_keys | 无 | ApiKey[] | 获取API Key列表 |
| search_api_keys | keyword: string | ApiKey[] | 搜索API Key |
| copy_to_clipboard | key_id: string | Boolean | 复制API Key到剪贴板 |
| get_clipboard_content | 无 | string | 获取剪贴板内容 |
| set_master_password | password: string | Boolean | 设置主密码 |
| verify_master_password | password: string | Boolean | 验证主密码 |
| register_shortcut | shortcut: string | Boolean | 注册全局快捷键 |
| analyze_clipboard_text | text: string | AnalyzedKey[] | 分析剪贴板文本 |
| import_analyzed_keys | keys: AnalyzedKey[] | Boolean | 导入分析的API Key |
| check_ollama_status | 无 | Boolean | 检查Ollama服务状态 |

## 4. 开发实施计划

### 4.1 第一阶段：MVP开发（2-3周）

#### 第1周：技术验证和基础搭建
- [x] 使用`create-tauri-app`初始化项目，选择React + TypeScript模板
- [x] 创建项目目录结构
- [x] 创建前端目录结构
- [x] 创建基础前端文件
- [x] 创建组件目录结构
- [x] 创建Tauri后端目录结构
- [x] 创建基础配置文件
- [x] 创建前端入口文件
- [x] 创建主应用组件
- [x] 创建前端入口点
- [x] 配置Tailwind CSS样式框架
- [x] 创建Tailwind配置文件
- [x] 创建全局样式文件
- [x] 集成shadcn/ui组件库
- [x] 创建Tauri配置文件
- [x] 创建Rust配置文件
- [x] 创建Tauri主程序文件
- [x] 创建Tauri库文件
- [x] 配置开发环境和构建脚本

#### 第2周：核心功能实现
- [x] 实现API Key的增删改查界面
- [x] 集成SQLite数据库（使用SQLCipher加密）
- [x] 实现主密码设置和验证功能（使用Argon2算法）
- [x] 开发API Key数据模型和存储逻辑
- [x] 创建API Key TypeScript接口
- [x] 创建API Key服务
- [x] 创建前端API Key管理组件
- [x] 实现基础的数据验证和错误处理

#### 第3周：用户体验优化
- [x] 实现全局快捷键功能（Ctrl+Shift+K唤出搜索界面）
- [x] 开发搜索和一键复制到剪贴板功能
- [x] 实现基础设置页面
- [x] 添加使用历史记录功能
- [x] 优化界面交互和视觉效果
- [x] 实现极简搜索工具条界面
- [x] 添加磨砂玻璃质感和渐变色彩效果
- [x] 优化工具条的浮层显示和位置管理
- [x] 实现径向菜单（Pie Menu）功能
- [x] 创建搜索工具条组件
- [x] 创建径向菜单组件
- [x] 创建剪贴板模块

### 4.2 第二阶段：功能完善（2-3周）

#### 第4周：高级功能
- [x] 实现剪贴板监控和智能识别API Key格式
  - 使用Tauri剪贴板插件定期检查剪贴板内容
  - 实现正则表达式匹配常见API Key格式
  - 开发智能提示保存新Key功能
- [x] 开发分组和标签管理功能
- [x] 完善使用历史记录功能
- [x] 实现自动锁定机制（闲置超时）
  - 实现闲置检测机制
  - 设置可配置的超时时间
  - 自动锁定时清除敏感数据
- [x] 实现智能剪贴板文本分析与导入功能
  - 开发文本解析和API Key提取功能
  - 集成本地LLM分析能力（Ollama）
  - 实现批量导入界面
- [x] 创建智能剪贴板组件
- [x] 创建本地LLM分析模块
- [x] 实现基础的数据验证和错误处理

#### 第5周：界面优化
- [x] 开发完整的设置页面
- [x] 实现数据导入导出功能
- [x] 添加主题切换支持
- [x] 优化响应式设计和跨平台兼容性
- [x] 优化搜索工具条的交互体验
- [x] 完善工具条的视觉设计效果
- [x] 添加自定义位置和大小设置
- [x] 完善径向菜单的动画效果和交互体验

#### 第6周：测试和发布
- [x] 进行跨平台测试（Windows、macOS、Linux）
- [x] 执行性能优化
- [x] 编写单元测试和集成测试
- [x] 准备发布版本和文档
- [x] 配置CI/CD流水线
- [x] 制定发布策略和版本管理
- [x] 准备用户安装包（MSI、DMG、AppImage等）

### 4.3 第三阶段：生态扩展（后续）
- [x] 开发VS Code插件
- [x] 开发浏览器扩展
- [x] 考虑移动端应用开发

## 5. 项目总结

### 5.1 项目完成情况
API Key Manager项目已按计划完成所有功能开发，包括：

1. 核心功能：
   - API Key的增删改查管理
   - 安全的本地加密存储
   - 全局快捷键快速访问
   - 搜索工具条和径向菜单界面

2. 高级功能：
   - 智能剪贴板文本分析与导入
   - 本地LLM辅助分析（Ollama）
   - 自动锁定机制
   - 分组和标签管理

3. 生态扩展：
   - VS Code插件
   - 浏览器扩展
   - 移动端应用架构设计

### 5.2 技术实现亮点
- 使用Tauri框架实现轻量级桌面应用
- 集成SQLCipher确保数据安全
- 采用Argon2id算法进行密码哈希
- 实现现代化的UI设计（磨砂玻璃效果、径向菜单等）
- 集成本地LLM分析能力，保护用户隐私

### 5.3 项目成果
- 完整的功能实现
- 全面的测试覆盖
- 跨平台兼容性
- 良好的用户体验
- 完善的文档

## 6. 未来规划

### 6.1 功能优化
- 持续优化性能和用户体验
- 增强本地LLM分析能力
- 扩展支持更多AI平台

### 6.2 生态扩展
- 发布VS Code插件到市场
- 开发更多IDE扩展
- 完善移动端应用

### 6.3 社区发展
- 建立用户反馈机制
- 创建社区文档和教程
- 收集用户需求进行迭代

### 4.4 安全实现细节

#### 4.4.1 数据加密方案
- 使用SQLCipher对SQLite数据库进行透明加密
- 主密码使用Argon2id算法进行哈希处理
- API Key在存储时使用AES-256-GCM算法加密
- 加密密钥通过主密码派生

#### 4.4.2 安全存储架构
```
主密码 (用户输入)
    ↓
Argon2id哈希
    ↓
加密密钥
    ↓
SQLCipher数据库密钥
    ↓
加密存储API Key
```

### 4.4.3 本地LLM安全规范
- 仅使用本地部署的Ollama服务（localhost:11434）
- 所有分析数据保留在本地，不上传到任何外部服务
- 用户可选择是否启用LLM分析功能
- 提供纯正则表达式分析作为备选方案

### 4.5 性能优化策略
- 启动时间优化：懒加载非核心模块
- 内存占用优化：及时释放不需要的资源
- 搜索性能优化：建立索引，使用高效搜索算法
- 数据库性能优化：合理设计表结构和查询语句
- 工具条响应优化：确保快捷键响应时间小于50ms
- 界面渲染优化：优化工具条组件的渲染性能
- 径向菜单优化：确保菜单动画流畅，响应时间小于100ms
- LLM分析优化：控制分析时间在5秒以内，提供进度指示

## 5. 代码质量与测试策略

### 5.1 代码规范
- 高内聚低耦合，每个代码文件不超过500行
- 避免过度工程化，使用简单直接的开发方法
- 函数索引文档管理，避免重复开发

#### 5.1.1 错误处理规范
- 前端统一错误处理机制，使用try-catch捕获异常
- 后端Rust使用Result类型处理错误
- 用户友好的错误提示信息
- 错误日志记录和上报机制

#### 5.1.2 日志记录规范
- 前端使用console和日志库记录重要操作
- 后端使用log crate记录系统日志
- 日志级别分类：debug、info、warn、error
- 敏感信息脱敏处理

### 5.2 测试策略
- 单元测试：针对核心业务逻辑
  - 前端：使用Jest和React Testing Library测试React组件和工具函数
  - 后端：使用Rust内置测试框架测试Rust模块
  - 测试覆盖率目标：80%以上
- 集成测试：验证模块间交互
  - 测试Tauri命令与前端的交互
  - 测试数据库操作的正确性
  - 测试安全模块的加密解密功能
  - 测试剪贴板功能的正确性
  - 测试全局快捷键功能
  - 测试本地LLM分析功能
  - 测试智能剪贴板批量导入功能
- 端到端测试：模拟用户操作流程
  - 使用Cypress或Playwright进行E2E测试
  - 测试完整的用户操作流程
  - 测试不同平台的兼容性
  - 测试性能指标（启动时间、内存占用等）

### 5.3 测试环境配置
- 开发环境：本地开发机器
- 测试环境：CI/CD流水线
- 不同操作系统环境：Windows、macOS、Linux

### 5.4 测试数据管理
- 使用测试专用数据库
- 模拟数据生成策略
- 敏感数据脱敏处理

### 5.3 文档管理
- 每个开发步骤记录status文档
- 维护函数索引文档
- 每次新建函数前查证是否有现成资源可复用

### 5.4 函数索引文档规范

#### 5.4.1 前端函数索引

| 模块 | 函数名 | 功能描述 | 文件路径 |
|------|--------|----------|----------|
| KeyManager | addApiKey | 添加新的API Key | src/services/apiKeyService.ts |
| KeyManager | editApiKey | 编辑现有API Key | src/services/apiKeyService.ts |
| KeyManager | deleteApiKey | 删除API Key | src/services/apiKeyService.ts |
| KeyManager | listApiKeys | 获取API Key列表 | src/services/apiKeyService.ts |
| Search | searchKeys | 搜索API Key | src/services/searchService.ts |
| Search | showSearchToolbar | 显示搜索工具条 | src/components/SearchToolbar/SearchToolbar.tsx |
| Search | hideSearchToolbar | 隐藏搜索工具条 | src/components/SearchToolbar/SearchToolbar.tsx |
| Search | handleSearchInput | 处理搜索输入 | src/components/SearchToolbar/hooks.ts |
| RadialMenu | showRadialMenu | 显示径向菜单 | src/components/RadialMenu/RadialMenu.tsx |
| RadialMenu | hideRadialMenu | 隐藏径向菜单 | src/components/RadialMenu/RadialMenu.tsx |
| RadialMenu | calculateMenuItemPositions | 计算菜单项位置 | src/components/RadialMenu/utils.ts |
| Security | hashPassword | 使用Argon2哈希密码 | src/lib/security.ts |
| Security | verifyPassword | 验证密码 | src/lib/security.ts |
| Clipboard | readClipboard | 读取剪贴板内容 | src/lib/clipboard.ts |
| Clipboard | writeClipboard | 写入剪贴板内容 | src/lib/clipboard.ts |

#### 5.4.2 后端函数索引

| 模块 | 函数名 | 功能描述 | 文件路径 |
|------|--------|----------|----------|
| Database | initDatabase | 初始化加密数据库 | src-tauri/src/database/mod.rs |
| Database | insertApiKey | 插入API Key记录 | src-tauri/src/database/mod.rs |
| Database | updateApiKey | 更新API Key记录 | src-tauri/src/database/mod.rs |
| Database | deleteApiKey | 删除API Key记录 | src-tauri/src/database/mod.rs |
| Database | listApiKeys | 查询API Key列表 | src-tauri/src/database/mod.rs |
| Security | hashMasterPassword | 哈希主密码 | src-tauri/src/security/mod.rs |
| Security | verifyMasterPassword | 验证主密码 | src-tauri/src/security/mod.rs |
| Security | encryptData | 加密数据 | src-tauri/src/security/mod.rs |
| Security | decryptData | 解密数据 | src-tauri/src/security/mod.rs |
| Clipboard | read_clipboard | 读取剪贴板内容 | src-tauri/src/clipboard/mod.rs |
| Clipboard | write_clipboard | 写入剪贴板内容 | src-tauri/src/clipboard/mod.rs |
| Shortcut | register_shortcut | 注册全局快捷键 | src-tauri/src/main.rs |
| LLM | analyze_text_with_ollama | 使用Ollama分析文本 | src-tauri/src/llm/mod.rs |
| LLM | check_ollama_status | 检查Ollama服务状态 | src-tauri/src/llm/mod.rs |
| SmartClipboard | parse_api_keys | 解析API Key文本 | src/components/SmartClipboard/utils.ts |

## 6. 实施步骤与状态跟踪

### 6.1 开发流程
1. **需求分析**：深入理解每个功能需求
2. **技术调研**：确认技术实现方案
3. **设计文档**：编写详细设计文档
4. **编码实现**：按照设计文档编码
5. **单元测试**：编写并执行单元测试
6. **集成测试**：验证模块间交互
7. **代码审查**：确保代码质量
8. **文档更新**：更新相关文档

### 6.2 状态文档管理
- 每个功能模块需创建独立的状态文档
- 记录实现进度、遇到的问题和解决方案
- 每日更新开发状态
- 每周进行进度回顾

### 6.3 函数索引维护流程
1. **新建函数前检查**：查询函数索引文档确认无重复实现
2. **函数设计**：确定函数签名、参数和返回值
3. **函数实现**：编写函数代码
4. **函数测试**：编写单元测试
5. **索引更新**：在函数索引文档中添加新函数信息
6. **文档同步**：确保文档与代码一致

## 7. 风险评估与应对措施

### 7.1 技术风险
- **Rust学习曲线**：安排学习时间，参考官方文档
- **跨平台兼容性**：早期进行多平台测试
- **加密安全性**：使用成熟加密库，避免自研算法
- **本地LLM集成**：确保与不同版本Ollama的兼容性
- **文本分析准确性**：优化提示词和后处理逻辑

### 7.2 产品风险
- **用户接受度**：通过MVP快速验证核心价值
- **竞争压力**：专注个人使用场景，差异化设计
- **功能蔓延**：严格遵循MVP原则，优先核心功能

## 8. 界面设计规范

### 8.1 搜索工具条设计要求

#### 8.1.1 界面布局规范
- 工具条采用最小化设计，仅包含一个搜索输入框
- 搜索框高度控制在36px以内
- 整体宽度不超过400px
- 支持自定义位置，可吸附到屏幕边缘
- 采用径向菜单（Pie Menu）替代传统下拉列表

#### 8.1.2 视觉设计规范
- 采用磨砂玻璃质感（Backdrop Blur效果）
- 精细的小圆角设计（8px圆角）
- 层次分明的阴影效果（shadow-sm到shadow-lg）
- 渐变色彩背景（使用Tailwind的gradient类）
- 简洁清晰的字体（系统默认字体或Inter字体族）
- 高对比度的文字确保可读性

#### 8.1.3 交互设计规范
- 快捷键唤出时自动聚焦到搜索框
- 支持键盘导航（上下键选择，回车确认）
- 搜索结果实时更新，延迟不超过100ms
- 点击外部区域或按ESC键自动隐藏
- 复制成功后显示短暂的成功提示
- 支持鼠标悬停高亮效果
- 支持径向菜单交互（类似Mac Dock的弹出菜单）

### 8.2 组件设计示例

#### 8.2.1 搜索工具条组件
```tsx
// SearchToolbar.tsx
const SearchToolbar: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-start justify-center pt-20 pointer-events-none">
      <div className="bg-white/80 backdrop-blur-md rounded-lg shadow-xl w-full max-w-md overflow-hidden pointer-events-auto">
        <div className="p-2 border-b border-gray-200 flex items-center">
          <input
            type="text"
            placeholder="搜索API Key..."
            className="flex-1 px-3 py-2 bg-transparent border-none focus:outline-none focus:ring-0 text-sm"
            autoFocus
          />
          <button className="p-1 rounded hover:bg-gray-100">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
```

#### 8.2.2 径向菜单组件设计
径向菜单将按照弧线排列选项，但保持文本水平可读：

```tsx
// RadialMenu.tsx
const RadialMenu: React.FC = () => {
  // 径向菜单项位置计算
  // 选项按照弧线分布，但文本保持水平
  return (
    <div className="fixed pointer-events-none" style={{top: 'calc(50% - 100px)', left: 'calc(50% + 200px)'}}>
      <div className="relative w-48 h-48">
        {/* 径向菜单项 */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-md rounded-lg shadow-lg px-3 py-2 text-sm whitespace-nowrap pointer-events-auto">
          OpenAI API Key
        </div>
        <div className="absolute top-4 right-4 transform translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-md rounded-lg shadow-lg px-3 py-2 text-sm whitespace-nowrap pointer-events-auto">
          Anthropic API Key
        </div>
        <div className="absolute bottom-4 right-4 transform translate-x-1/2 translate-y-1/2 bg-white/90 backdrop-blur-md rounded-lg shadow-lg px-3 py-2 text-sm whitespace-nowrap pointer-events-auto">
          Google API Key
        </div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-white/90 backdrop-blur-md rounded-lg shadow-lg px-3 py-2 text-sm whitespace-nowrap pointer-events-auto">
          Azure API Key
        </div>
        <div className="absolute bottom-4 left-4 transform -translate-x-1/2 translate-y-1/2 bg-white/90 backdrop-blur-md rounded-lg shadow-lg px-3 py-2 text-sm whitespace-nowrap pointer-events-auto">
          HuggingFace Key
        </div>
      </div>
    </div>
  );
};
```

#### 8.2.3 径向菜单设计规范
- 选项按照弧线分布，形成半圆形或扇形布局
- 文本保持水平方向，确保可读性
- 菜单背景透明或半透明，减少视觉干扰
- 支持鼠标悬停和点击交互
- 菜单项大小适中，避免遮挡过多屏幕空间
- 动画过渡效果平滑自然

#### 8.2.4 样式实现要点
- 使用Tailwind CSS的`backdrop-blur`类实现磨砂玻璃效果
- 使用`rounded-lg`实现8px圆角
- 使用`shadow-lg`实现层次阴影
- 使用CSS Transform定位菜单项
- 使用CSS Transition实现平滑动画
- 保持组件轻量，避免复杂嵌套

### 8.3 智能剪贴板界面设计

#### 8.3.1 界面布局
- 提供文本输入区域用于粘贴API Key文本
- 展示分析结果的表格视图
- 操作按钮：分析、导入、清空
- Ollama服务状态指示器

#### 8.3.2 交互流程
1. 用户粘贴包含API Key的文本
2. 点击"分析"按钮触发本地LLM分析
3. 展示分析结果供用户确认
4. 用户可编辑分析结果
5. 点击"导入"按钮批量保存到数据库

#### 8.3.3 视觉设计
- 保持与整体应用一致的设计风格
- 分析结果表格清晰展示各项信息
- 状态指示器明确显示Ollama服务连接状态
- 错误提示友好且具体