# API Key Manager

一个轻量、简洁、安全的个人API Key管理桌面软件，专为AIGC开发者和研究人员设计。

## 📊 开发状态

**Phase 3 质量改进 - 已完成 ✅**

最近完成了重要的代码质量改进：
- ✅ 类型安全增强：完整的TypeScript类型定义
- ✅ 标准化错误处理：统一的错误处理机制
- ✅ 代码去重：消除重复代码，提高可维护性
- ✅ 现代化通知系统：替换alert()调用为Toast通知
- ✅ 配置管理：建立统一的常量管理系统
- ✅ 错误边界：完善的错误处理和用户反馈
- ✅ 国际化准备：统一使用英文命名和界面文本
- ✅ 完整文档：为所有公共函数和组件添加JSDoc文档

## 功能特性

- **API Key管理**：添加、编辑、删除和组织您的API Keys
- **快速搜索**：通过全局快捷键（Ctrl+Shift+K）快速搜索和访问API Keys
- **智能剪贴板**：批量导入API Keys，支持本地LLM分析（Ollama）
- **安全存储**：使用AES-256-GCM加密和Argon2id密码哈希保护您的数据
- **现代化界面**：具有磨砂玻璃效果和渐变色彩的美观界面
- **径向菜单**：创新的Pie Menu界面替代传统下拉菜单

## 技术架构

- **前端**：React 18 + TypeScript + Tailwind CSS
- **后端**：Tauri (Rust)
- **数据库**：SQLite + SQLCipher
- **加密**：AES-256-GCM + Argon2id
- **构建工具**：Vite

## 安装

### 系统要求

- Windows 10/11, macOS 10.15+, 或 Linux
- Node.js 16+
- Rust工具链

### 开发环境搭建

1. 克隆项目：
   ```bash
   git clone <repository-url>
   cd api-key-manager
   ```

2. 安装依赖：
   ```bash
   npm install
   ```

3. 运行开发服务器：
   ```bash
   npm run tauri dev
   ```

### 构建生产版本

```bash
npm run tauri build
```

## 使用说明

### 基本操作

1. **添加API Key**：在"API Keys"页面点击"添加新Key"按钮
2. **搜索API Key**：按下Ctrl+Shift+K快捷键打开搜索工具条
3. **复制API Key**：在搜索结果或API Keys列表中点击"复制"按钮

### 智能剪贴板

1. 将包含API Keys的文本复制到剪贴板
2. 打开"智能剪贴板"页面
3. 点击"获取剪贴板内容"按钮
4. 点击"分析文本"按钮
5. 确认分析结果后点击"导入API Keys"

### 安全设置

1. 在"设置"页面设置主密码
2. 主密码将用于加密存储您的API Keys

## 开发指南

### 项目结构

```
src/
├── components/          # React UI组件
│   ├── ErrorBoundary/   # 错误边界组件
│   ├── KeyManager/      # API Key管理主组件
│   ├── FloatingToolbar/ # 浮动工具条
│   ├── Toast/           # 通知组件
│   └── VirtualScroll/   # 虚拟滚动组件
├── hooks/               # 自定义React Hooks
│   ├── useToast.ts      # Toast通知Hook
│   ├── useApiKey.ts     # API Key数据管理Hook
│   └── useClipboard.ts  # 剪贴板操作Hook
├── services/            # API服务调用
│   ├── apiKeyService.ts # API Key业务逻辑
│   ├── toastService.ts  # 通知服务
│   ├── errors.ts        # 错误处理类型
│   └── secureLogging.ts # 安全日志记录
├── types/               # TypeScript类型定义
│   └── apiKey.ts        # API Key相关类型
├── constants/           # 应用常量配置
├── contexts/            # React Context
└── utils/               # 工具函数

src-tauri/
├── src/
│   ├── commands/        # Tauri命令
│   ├── database/        # 数据库操作模块
│   ├── security/        # 安全相关模块
│   ├── clipboard/       # 剪贴板操作模块
│   ├── llm/             # 本地LLM分析模块
│   └── utils/           # 工具函数
```

### 贡献

欢迎提交Issue和Pull Request来改进这个项目。

## 许可证

MIT License