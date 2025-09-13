# iFlow Context - API Key Manager

## 项目概述

API Key Manager 是一个轻量级、安全、现代化的个人API密钥管理桌面应用程序，专为AIGC开发者和研究人员设计。项目采用Tauri框架构建跨平台桌面应用，结合React前端和Rust后端，提供安全的API密钥存储和管理功能。

### 核心功能
- **API密钥管理**：添加、编辑、删除和组织API密钥
- **快速搜索**：通过全局快捷键(Ctrl+Shift+K)快速搜索和访问API密钥
- **智能剪贴板**：批量导入API密钥，支持本地LLM分析(Ollama)
- **安全存储**：使用AES-256-GCM加密和Argon2id密码哈希保护数据
- **现代化界面**：具有磨砂玻璃效果和渐变色彩的美观界面
- **径向菜单**：创新的Pie Menu界面替代传统下拉菜单

## 技术架构

### 前端技术栈
- **框架**：React 18 + TypeScript
- **样式**：Tailwind CSS 4.x + PostCSS
- **构建工具**：Vite 7.x
- **测试**：Vitest + React Testing Library
- **状态管理**：React Hooks (自定义状态管理)

### 后端技术栈
- **框架**：Tauri 2.x (Rust)
- **数据库**：SQLite + SQLCipher (加密数据库)
- **加密**：AES-256-GCM + Argon2id
- **异步运行时**：Tokio
- **HTTP客户端**：reqwest

### 项目结构
```
src/                          # React前端代码
├── components/               # UI组件
│   ├── KeyManager/          # API密钥管理组件
│   ├── SmartClipboard/      # 智能剪贴板组件
│   ├── FloatingToolbar/     # 浮动工具条组件
│   └── RadialMenu/          # 径向菜单组件
├── services/                # API服务层
├── types/                   # TypeScript类型定义
├── hooks/                   # 自定义React Hooks
└── utils/                   # 工具函数

src-tauri/                   # Tauri后端代码
├── src/
│   ├── commands/            # Tauri命令处理
│   ├── database/            # 数据库操作模块
│   ├── security/            # 安全相关模块
│   ├── clipboard/           # 剪贴板操作模块
│   └── llm/                 # 本地LLM分析模块
└── Cargo.toml              # Rust依赖管理
```

## 开发指南

### 环境要求
- Node.js 16+
- Rust工具链
- Windows 10/11, macOS 10.15+, 或 Linux

### 常用命令

#### 开发环境
```bash
# 安装依赖
npm install

# 运行开发服务器
npm run tauri dev

# 运行测试
npm run test

# 运行测试UI
npm run test:ui
```

#### 构建和部署
```bash
# 构建生产版本
npm run tauri build

# 构建前端
npm run build

# 预览构建结果
npm run preview
```

### 开发约定

#### 代码风格
- 使用TypeScript进行类型安全的开发
- 遵循React函数组件和Hooks模式
- 使用Tailwind CSS进行样式设计
- 组件文件使用PascalCase命名
- 工具函数文件使用camelCase命名

#### 安全实践
- 所有API密钥在存储前必须加密
- 使用Argon2id进行密码哈希
- 实现适当的输入验证和错误处理
- 遵循最小权限原则

#### 测试要求
- 使用Vitest进行单元测试
- 使用React Testing Library进行组件测试
- 测试文件使用`.test.ts`或`.test.tsx`后缀
- 测试配置位于`vitest.config.ts`

### 核心模块说明

#### API密钥服务 (`src/services/apiKeyService.ts`)
提供API密钥的CRUD操作，包括添加、编辑、删除、搜索和复制功能。所有操作都通过Tauri命令与后端通信。

#### 安全服务 (`src/services/securityService.ts`)
处理加密解密操作，使用AES-256-GCM算法保护API密钥数据。

#### 数据库模块 (`src-tauri/src/database/`)
使用SQLx进行SQLite数据库操作，支持加密存储和高效查询。

#### 剪贴板服务 (`src-tauri/src/clipboard/`)
提供系统剪贴板访问功能，支持智能分析和批量导入。

### 配置说明

#### Tauri配置 (`src-tauri/tauri.conf.json`)
- 应用标识符：`com.hongyu-li.api-key-manager`
- 窗口尺寸：800x600
- 安全策略：CSP配置允许本地Ollama连接
- 全局快捷键：Ctrl+Shift+K

#### 构建配置
- 支持所有平台构建（Windows、macOS、Linux）
- 使用Vite进行前端构建优化
- 支持生产环境代码压缩和优化

### 扩展功能

#### 本地LLM集成
- 支持Ollama本地LLM服务
- 提供智能剪贴板分析功能
- 自动识别和提取API密钥格式

#### 全局快捷键
- 注册系统级快捷键Ctrl+Shift+K
- 快速呼出搜索工具条
- 支持跨应用使用

## 注意事项

1. **安全性**：项目涉及敏感数据存储，必须确保加密实现正确
2. **跨平台**：测试需要在Windows、macOS和Linux上验证
3. **性能**：数据库查询需要优化以支持大量API密钥
4. **用户体验**：界面响应速度和交互流畅性是关键

## 相关文档

- [Tauri官方文档](https://tauri.app/)
- [React官方文档](https://react.dev/)
- [Tailwind CSS文档](https://tailwindcss.com/)
- [Rust官方文档](https://doc.rust-lang.org/)