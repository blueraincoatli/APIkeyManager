# API Key Manager

一个轻量、现代、安全的本地 API Key 管理桌面应用。支持快速搜索、分组/平台分类、Excel 批量导入与可视化预览等功能，帮助你把分散在各处的 Key 系统性地管理起来。

## ✨ 功能特性（最新）

- 核心能力
  - API Key 管理：新增/编辑/删除，按平台分类展示
  - 快速搜索与过滤：名称、平台关键词过滤，支持浮动工具条内直接搜索
  - 分组/平台视图：径向菜单（Radial Menu）按平台聚合，滚轮分页
- 批量导入（Excel）
  - 支持 .xlsx/.xls，从第一张工作表读取
  - 预览窗口：在导入前以独立窗口展示待导入数据
  - 重复检测与删除：
    - 与数据库已存在数据比对（按 keyValue）
    - 同一批 Excel 内部重复检测
    - 重复项以红色标识，支持逐行 × 删除；保留或删除由你决定
  - 粘贴容错清理：自动去除零宽字符/BOM/控制字符等隐形字符，避免误判
  - 详细校验提示：明确指出“哪个字符不合法/为何失败”，便于修正
- 交互与界面
  - 浮动工具栏：始终置顶，快速搜索/新增入口
  - 径向菜单：每屏 6 项，支持滚轮与上下小三角指示；仅在可继续滚动时对边缘两项做“轻度渐隐”提示
  - 现代化 UI：浅/深色主题适配

## 🧰 技术栈

- 前端：React 19 + TypeScript + Vite 7
- 桌面端：Tauri 2（Rust）
- 数据：SQLite（sqlx 驱动）
- 其它：xlsx 解析、全局快捷键/文件对话框/FS 等 Tauri 插件

跨平台特性：Windows / macOS / Linux（需安装 Rust 与 Node 环境）。

安全特性：

- 输入规范化（normalize）与格式校验，自动清理隐形字符
- 拦截可疑片段（如 XSS/脚本片段、路径穿越、命令注入字符）
- 仅在本地运行与存储，避免把 Key 发送到远端服务

## 🚀 安装与运行

### 前置条件

- Node.js 18+
- Rust 稳定版工具链（包含 cargo）
- npm（或兼容的包管理器）

### 获取代码并安装依赖

```bash
git clone https://github.com/blueraincoatli/APIkeyManager.git
cd APIkeyManager
npm install
```

### 开发调试

```bash
npm run tauri:dev     # 等价于 tauri dev，会先启动 Vite 再启动 Tauri
```

### 生产构建

```bash
npm run tauri:build   # 产出各平台安装包/可执行文件
```

## 🛠 使用说明

### 基本操作
1. 启动应用后会出现“浮动工具栏”，可直接输入关键词进行搜索
2. 点击 + 按钮可新增 API Key
3. 在搜索结果/列表中点击复制即可快速复制 Key

### 批量导入（Excel）

1. 在“新增/导入”入口选择“批量导入（Excel）”
2. 选择 .xlsx/.xls 文件后，应用会解析首个工作表并打开“预览窗口”
3. 在预览窗口中：
   - 重复项会被红色标识（含数据库重复与本批重复）
   - 可点击右侧“×”删除某一行，列表会自动重新校验并更新标红
   - 确认无误后点击“确认导入”

Excel 表头要求（第一行，必须完全匹配）：

- 名称 | API Key | 提供商 | 描述

示例（仅作为格式参考）：

- 名称：OpenAI GPT-4
- API Key：sk-xxxxxxxx…
- 提供商：OpenAI
- 描述：用于 GPT-4 访问

> 提示：空行将被跳过；必须至少包含“名称”和“API Key”。

### 径向菜单

- 在平台聚合视图中，每屏显示 6 个项目
- 使用鼠标滚轮切换上一屏/下一屏
- 右侧有上/下小三角提示可滚动
- 仅当还可以继续滚动时，最上/最下两项会轻微变淡作为“还有更多”的提示

## 🧭 项目结构（概要）

```text
src/
├─ components/
│  ├─ FloatingToolbar/         # 浮动工具栏
│  ├─ RadialMenu/              # 径向菜单
│  ├─ AddApiKey/               # 新增/批量导入对话框
│  └─ SearchResults/           # 搜索结果与列表
├─ services/
│  ├─ apiKeyService.ts         # 与后端命令交互、批量导入封装
│  ├─ inputValidation.ts       # 规范化与验证（含详细错误提示）
│  └─ excelService.ts          # Excel 解析/校验/模板生成
└─ ...

src-tauri/
├─ src/
│  ├─ commands/
│  │  ├─ api_key_commands.rs       # 单条增删改查、查重等命令
│  │  └─ batch_import_commands.rs  # 批量导入命令
│  ├─ database/                    # SQLite 访问（sqlx）
│  └─ lib.rs / main.rs             # Tauri 应用入口
└─ tauri.conf.json                 # Tauri 配置
```

## 👩‍💻 开发者指南

- 常用脚本
  - 开发：`npm run tauri:dev`
  - 构建：`npm run tauri:build`
  - 单元测试：`npm run test`
- 代码风格：TypeScript + React 组件化；前后端接口统一使用 camelCase（如 `keyValue`）
- 批量导入接口：后端 `import_api_keys_batch(keys)`（字段：`name`, `keyValue`, `platform`, `description`）

## 📷 截图

如仓库包含截图，可在此处补充（images/ 目录）。

## 🤝 贡献

欢迎提交 Issue / PR，一起完善产品体验与稳定性。

## 📄 许可证

MIT License
