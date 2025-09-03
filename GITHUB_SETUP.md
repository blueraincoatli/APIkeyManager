# GitHub 仓库设置指南

## 仓库信息

- **仓库名称**: APIkeyManager
- **仓库地址**: https://github.com/blueraincoatli/APIkeyManager.git
- **默认分支**: main

## 项目设置步骤

### 1. 克隆仓库
```bash
git clone https://github.com/blueraincoatli/APIkeyManager.git
cd APIkeyManager
```

### 2. 安装依赖
```bash
npm install
```

### 3. 安装开发工具

#### Rust 工具链
```bash
# Windows (使用 PowerShell)
winget install --id Rustlang.Rustup

# macOS/Linux
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

#### Tauri CLI
```bash
npm install -g @tauri-apps/cli
```

### 4. 运行开发服务器
```bash
# 启动前端开发服务器
npm run dev

# 启动 Tauri 应用（在新终端中运行）
npm run tauri dev
```

### 5. 构建应用
```bash
# 构建前端
npm run build

# 构建 Tauri 应用
npm run tauri build
```

## 项目结构说明

```
APIkeyManager/
├── docs/                # 项目文档
│   ├── STATUS.md        # 项目状态文档
│   ├── FUNCTION_INDEX.md # 函数索引文档
│   └── 代码审查报告.md    # 代码审查报告
├── src/                 # 前端 React 应用源码
├── src-tauri/           # Tauri 后端源码（Rust）
├── package.json         # 项目依赖配置
├── tauri.conf.json      # Tauri 应用配置
├── vite.config.ts       # Vite 构建配置
└── vitest.config.ts     # Vitest 测试配置
```

## 开发规范

### 代码规范
- 使用 TypeScript 严格模式
- 遵循 React 最佳实践
- 保持函数在500行代码以内

### 测试规范
- 使用 Vitest 进行单元测试
- 测试文件位于 `src/services/__tests__/` 目录
- 运行测试：`npm run test`

### 安全规范
- 启用 CSP 策略
- 移除生产环境调试日志
- 验证所有用户输入

## 文档说明

### STATUS.md
项目状态文档，跟踪开发进度和完成标记。

### FUNCTION_INDEX.md
函数索引文档，记录所有重要函数和方法，避免重复开发并促进代码重用。

### 代码审查报告.md
代码审查报告，包含对项目的详细审查和改进建议。

## 历史修改记录

### 2025-09-03
- 修复代码审查报告中提出的问题：
  - 启用CSP策略提高应用安全性
  - 改进错误处理机制，返回更详细的错误信息
  - 优化数据更新方式，避免不必要的重新获取所有数据
  - 完善RadialMenu功能，实现编辑、删除和详情功能
  - 移除调试控制台日志
  - 添加输入验证机制
  - 解决"问题"标签页下的所有报错
- 创建项目状态文档和函数索引文档

### 2025-09-02
- 添加 GitHub 设置指南
- 完善项目文档结构

### 2025-09-01
- 初始化项目基础结构
- 配置 Tauri + React + TypeScript 开发环境
- 创建需求文档并进行详细计划