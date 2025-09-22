# API Key Manager | API 密钥管理器

一个轻量、现代、安全的本地 API Key 管理桌面应用。支持快速搜索、分组/平台分类、Excel 批量导入与可视化预览等功能，帮助你把分散在各处的 Key 系统性地管理起来。

[🇨🇳 中文版本](README_CN.md) | [English](README.md)

## ✨ 功能特性

### 核心能力
- **API Key 管理**: 新增/编辑/删除，按平台分类展示
- **快速搜索与过滤**: 名称、平台关键词过滤，支持浮动工具条内直接搜索
- **分组/平台视图**: 径向菜单按平台聚合，滚轮分页
- **🌍 多语言国际化支持**: 支持9种语言，包括简体中文、英语、繁体中文、葡萄牙语、西班牙语、法语、意大利语、日语、俄语

### 批量导入（Excel）
- **格式支持**: 支持 .xlsx/.xls，从第一张工作表读取
- **预览窗口**: 在导入前以独立窗口展示待导入数据
- **🌐 多语言表头智能匹配**: 自动识别Excel文件语言，支持多语言表头格式
- **重复检测与删除**: 
  - 与数据库已存在数据比对（按 keyValue）
  - 同一批 Excel 内部重复检测
  - 重复项以红色标识，支持逐行 × 删除；保留或删除由你决定
- **粘贴容错清理**: 自动去除零宽字符/BOM/控制字符等隐形字符，避免误判
- **详细校验提示**: 明确指出"哪个字符不合法/为何失败"，便于修正

### 交互与界面
- **浮动工具栏**: 始终置顶，快速搜索/新增入口
- **径向菜单**: 每屏 6 项，支持滚轮与上下小三角指示；仅在可继续滚动时对边缘两项做"轻度渐隐"提示
- **现代化 UI**: 浅/深色主题适配
- **🎨 自适应背景渐变**: 根据当前主题和时间动态生成背景渐变效果
- **🚀 主题切换性能优化**: 使用requestAnimationFrame和CSS变量实现流畅的主题切换

## 📷 使用指南 (AVIF动画演示)

### 1. 系统快捷键激活
![系统快捷键](https://raw.githubusercontent.com/blueraincoatli/APIkeyManager/main/ref/SystemShortcut.avif)
*使用 Ctrl+Shift+K 全局快捷键激活浮动工具条*

### 2. 浮动工具条快速搜索
![搜索关键词](https://raw.githubusercontent.com/blueraincoatli/APIkeyManager/main/ref/SearchKeyWords.avif)
*使用浮动工具条按名称或平台快速搜索API密钥*

### 3. 添加新API密钥
![添加新API密钥](https://raw.githubusercontent.com/blueraincoatli/APIkeyManager/main/ref/AddNewAPIkey.avif)
*点击+按钮添加新API密钥并填写详细信息*

### 4. 平台径向菜单
![径向菜单](https://raw.githubusercontent.com/blueraincoatli/APIkeyManager/main/ref/RadialMenu.avif)
*使用鼠标滚轮在径向菜单中浏览不同平台*

### 5. Excel批量导入
![批量导入](https://raw.githubusercontent.com/blueraincoatli/APIkeyManager/main/ref/BatchImport.avif)
*从Excel文件批量导入API密钥，支持多语言表头*

### 6. 删除API密钥
![删除密钥](https://raw.githubusercontent.com/blueraincoatli/APIkeyManager/main/ref/DeleteKey.avif)
*通过确认对话框轻松删除API密钥*

### 7. 主题和语言切换
![切换主题和语言](https://raw.githubusercontent.com/blueraincoatli/APIkeyManager/main/ref/ChangeThemeAndLang.avif)
*在浅色/深色主题和9种不同语言之间即时切换*

## 🧰 技术栈

### 前端
- **框架**: React 19 + TypeScript + Vite 7
- **样式**: Tailwind CSS + PostCSS
- **构建工具**: Vite 7
- **图标**: Lucide React

### 后端
- **框架**: Tauri 2 (Rust)
- **数据库**: SQLite (sqlx 驱动)
- **加密**: AES-256-GCM + Argon2id
- **插件**: 全局快捷键、文件对话框、FS 等

### 跨平台特性
Windows / macOS / Linux（需安装 Rust 与 Node 环境）

### 安全特性
- 输入规范化与格式校验，自动清理隐形字符
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

## 📋 Excel模板要求

### 支持的表头格式

**中文格式:**
```
名称 | API Key | 提供商 | 描述
```

**英文格式:**
```
Name | API Key | Platform | Description
```

**其他语言格式:**
- 简体中文: 名称 | API Key | 提供商 | 描述
- 英语: Name | API Key | Platform | Description  
- 繁体中文: 名稱 | API Key | 提供商 | 描述
- 葡萄牙语: Nome | API Key | Plataforma | Descrição
- 西班牙语: Nombre | API Key | Plataforma | Descripción
- 法语: Nom | API Key | Plateforme | Description
- 意大利语: Nome | API Key | Piattaforma | Descrizione
- 日语: 名前 | API Key | プラットフォーム | 説明
- 俄语: Название | API Key | Платформа | Описание

### 示例
```
名称: OpenAI GPT-4
API Key: sk-xxxxxxxx...
提供商: OpenAI
描述: 用于 GPT-4 访问
```

> 提示: 空行将被跳过；必须至少包含"名称"和"API Key"；系统会自动识别表头语言格式

## 🧭 项目结构

```
src/
├─ components/
│  ├─ FloatingToolbar/         # 浮动工具栏
│  ├─ RadialMenu/              # 径向菜单
│  ├─ AddApiKey/               # 新增/批量导入对话框
│  ├─ SearchResults/           # 搜索结果与列表
│  ├─ VirtualScroll/           # 虚拟滚动组件
│  └─ ThemeToggle/             # 主题切换组件
├─ services/
│  ├─ apiKeyService.ts         # 与后端命令交互、批量导入封装
│  ├─ inputValidation.ts       # 规范化与验证（含详细错误提示）
│  ├─ excelService.ts          # Excel 解析/校验/模板生成（支持多语言）
│  ├─ searchOptimizationService.ts  # 搜索优化服务
│  ├─ securityService.ts       # 安全服务
│  └─ toastService.ts          # 通知服务
├─ contexts/
│  ├─ ThemeContext.tsx         # 主题上下文
│  └─ LocaleContext.tsx        # 国际化上下文
├─ hooks/
│  ├─ useSearch.ts             # 搜索功能Hook
│  ├─ useAdaptiveTheme.ts      # 自适应主题Hook
│  ├─ useBackgroundGradient.ts # 背景渐变Hook
│  └─ useThemeTransition.ts    # 主题切换性能优化Hook
├─ i18n/
│  └─ languages/               # 多语言翻译文件
│      ├─ zh-CN.ts             # 简体中文
│      ├─ en-US.ts             # 英语
│      └─ ... (其他8种语言)
├─ styles/
│  ├─ theme.css                # 主题样式
│  └─ tokens.css               # 设计令牌
└─ ...

public/
├─ preview.html                # 独立预览窗口（支持多语言）
├─ preview-i18n.js             # 预览窗口国际化支持
└─ templates/
    └─ api_key_template.xlsx   # Excel模板（多语言）

src-tauri/
├─ src/
│  ├─ commands/
│  │  ├─ api_key_commands.rs       # 单条增删改查、查重等命令
│  │  ├─ batch_import_commands.rs  # 批量导入命令
│  │  └─ window_commands.rs        # 窗口管理命令（支持多语言）
│  ├─ database/                    # SQLite 访问（sqlx）
│  ├─ security/                     # 安全模块
│  └─ lib.rs / main.rs             # Tauri 应用入口
└─ tauri.conf.json                 # Tauri 配置
```

## 👩‍💻 开发者指南

### 常用脚本
- 开发: `npm run tauri:dev`
- 构建: `npm run tauri:build`
- 单元测试: `npm run test`
- 测试UI: `npm run test:ui`

### 代码风格
TypeScript + React 组件化；前后端接口统一使用 camelCase（如 `keyValue`）

### 批量导入接口
后端: `import_api_keys_batch(keys)`（字段：`name`, `keyValue`, `platform`, `description`）

### 多语言开发指南

#### 添加新语言
1. 在 `src/i18n/languages/` 目录下创建新的语言文件（如 `de-DE.ts`）
2. 参考现有语言文件格式，翻译所有文本
3. 在 `src/i18n/index.ts` 中注册新语言
4. 在 `public/preview-i18n.js` 中添加对应的翻译
5. 在 `get_preview_window_title` 函数中添加窗口标题翻译

#### 独立窗口多语言支持
- 预览窗口使用独立的国际化系统（`preview-i18n.js`）
- 支持通过 `data-i18n` 属性标记需要翻译的元素
- 窗口标题通过后端命令动态设置

#### Excel表头多语言支持
- 在 `src/services/excelService.ts` 中定义 `COLUMN_HEADERS` 映射
- 系统会自动检测当前语言并匹配对应的表头格式
- 支持智能容错，当找不到对应语言时会回退到默认语言

## 🌍 多语言支持

API Key Manager 支持以下9种语言：

| 语言 | 代码 | 状态 |
|------|------|------|
| 简体中文 | zh-CN | ✅ 完整支持 |
| 英语 | en-US | ✅ 完整支持 |
| 繁体中文 | zh-TW | ✅ 完整支持 |
| 葡萄牙语 | pt-BR | ✅ 完整支持 |
| 西班牙语 | es-ES | ✅ 完整支持 |
| 法语 | fr-FR | ✅ 完整支持 |
| 意大利语 | it-IT | ✅ 完整支持 |
| 日语 | ja-JP | ✅ 完整支持 |
| 俄语 | ru-RU | ✅ 完整支持 |

### 语言切换
- 在设置面板中选择所需语言
- 界面会立即更新为所选语言
- 独立预览窗口也会同步更新语言
- Excel导入功能会根据当前语言智能匹配表头

## 🤝 贡献

欢迎提交 Issue / PR，一起完善产品体验与稳定性。

### 特别感谢
- 感谢所有为多语言翻译做出贡献的开发者
- 感谢提供bug反馈和功能建议的用户

## 📄 许可证

MIT License

---

**项目状态**: 🌟 多语言国际化支持已完成 - 2025-09-22

**最新版本**: v0.1.0，MSI安装包位于 `src-tauri/target/release/bundle/msi/`