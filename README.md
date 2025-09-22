# API Key Manager

A lightweight, modern, and secure desktop application for managing API keys locally. Supports quick search, platform categorization, Excel batch import, and visual preview to help you systematically manage scattered keys.

[🇨🇳 中文版本](README_CN.md) | [English](README.md)

## ✨ Features

### Core Capabilities
- **API Key Management**: Add/Edit/Delete API keys with platform categorization
- **Quick Search & Filtering**: Search by name and platform keywords with floating toolbar
- **Platform View**: Radial menu platform aggregation with wheel pagination
- **🌍 Multi-language Support**: Supports 9 languages including Chinese, English, Japanese, etc.

### Batch Import (Excel)
- **Format Support**: Supports .xlsx/.xls, reads from first worksheet
- **Preview Window**: Independent window displays data before import
- **🌐 Multi-language Header Matching**: Automatically recognizes Excel file language format
- **Duplicate Detection**: 
  - Compares with existing database entries (by keyValue)
  - Detects duplicates within the same batch
  - Red highlighting for duplicates with row deletion option
- **Data Cleaning**: Auto-removes invisible characters (zero-width, BOM, control chars)
- **Validation**: Clear error messages indicating invalid characters and reasons

### Interface & Interaction
- **Floating Toolbar**: Always-on-top quick search and add entry
- **Radial Menu**: 6 items per screen with wheel navigation and edge fading
- **Modern UI**: Light/dark theme adaptation
- **🎨 Adaptive Background Gradient**: Dynamic background generation based on theme and time
- **🚀 Theme Switch Performance**: Smooth theme transitions with requestAnimationFrame

## 📷 Usage Guide (AVIF Animations)

### 1. System Shortcut Activation
![System Shortcut](https://raw.githubusercontent.com/blueraincoatli/APIkeyManager/main/ref/SystemShortcut.avif)
*Activate the floating toolbar using Ctrl+Shift+K global shortcut*

### 2. Quick Search with Floating Toolbar
![Search Keywords](https://raw.githubusercontent.com/blueraincoatli/APIkeyManager/main/ref/SearchKeyWords.avif)
*Quickly search API keys by name or platform using the floating toolbar*

### 3. Add New API Key
![Add New API Key](https://raw.githubusercontent.com/blueraincoatli/APIkeyManager/main/ref/AddNewAPIkey.avif)
*Click the + button to add a new API key with detailed information*

### 4. Platform Radial Menu
![Radial Menu](https://raw.githubusercontent.com/blueraincoatli/APIkeyManager/main/ref/RadialMenu.avif)
*Navigate through platforms using the radial menu with mouse wheel interaction*

### 5. Excel Batch Import
![Batch Import](https://raw.githubusercontent.com/blueraincoatli/APIkeyManager/main/ref/BatchImport.avif)
*Import multiple API keys from Excel files with multi-language header support*

### 6. Delete API Key
![Delete Key](https://raw.githubusercontent.com/blueraincoatli/APIkeyManager/main/ref/DeleteKey.avif)
*Easily delete API keys with confirmation dialog*

### 7. Theme and Language Switching
![Change Theme and Language](https://raw.githubusercontent.com/blueraincoatli/APIkeyManager/main/ref/ChangeThemeAndLang.avif)
*Switch between light/dark themes and 9 different languages instantly*

## 🧰 Tech Stack

### Frontend
- **Framework**: React 19 + TypeScript + Vite 7
- **Styling**: Tailwind CSS + PostCSS
- **Build Tool**: Vite 7
- **Icons**: Lucide React

### Backend
- **Framework**: Tauri 2 (Rust)
- **Database**: SQLite (sqlx driver)
- **Encryption**: AES-256-GCM + Argon2id
- **Plugins**: Global hotkeys, file dialog, FS, etc.

### Cross-platform
Windows / macOS / Linux (requires Rust & Node environment)

### Security Features
- Input normalization and format validation with auto-cleanup
- Suspicious fragment interception (XSS, path traversal, command injection)
- Local-only operation and storage, no remote key transmission

## 🚀 Installation & Running

### Prerequisites
- Node.js 18+
- Rust stable toolchain (with cargo)
- npm (or compatible package manager)

### Setup
```bash
git clone https://github.com/blueraincoatli/APIkeyManager.git
cd APIkeyManager
npm install
```

### Development
```bash
npm run tauri:dev     # Equivalent to tauri dev, starts Vite then Tauri
```

### Production Build
```bash
npm run tauri:build   # Generates platform installation packages/executables
```

## 📋 Excel Template Requirements

### Supported Header Formats

**English Format:**
```
Name | API Key | Platform | Description
```

**Other Languages:**
- Chinese: 名称 | API Key | 提供商 | 描述
- Traditional Chinese: 名稱 | API Key | 提供商 | 描述
- Portuguese: Nome | API Key | Plataforma | Descrição
- Spanish: Nombre | API Key | Plataforma | Descripción
- French: Nom | API Key | Plateforme | Description
- Italian: Nome | API Key | Piattaforma | Descrizione
- Japanese: 名前 | API Key | プラットフォーム | 説明
- Russian: Название | API Key | Платформа | Описание

### Example
```
Name: OpenAI GPT-4
API Key: sk-xxxxxxxx...
Platform: OpenAI
Description: Used for GPT-4 access
```

> Note: Empty lines are skipped; at least "Name" and "API Key" are required. System automatically recognizes header language format.

## 🧭 Project Structure

```
src/
├─ components/
│  ├─ FloatingToolbar/         # Floating toolbar
│  ├─ RadialMenu/              # Radial menu
│  ├─ AddApiKey/               # Add/batch import dialog
│  ├─ SearchResults/           # Search results & list
│  ├─ VirtualScroll/           # Virtual scroll component
│  └─ ThemeToggle/             # Theme toggle component
├─ services/
│  ├─ apiKeyService.ts         # Backend command interaction
│  ├─ inputValidation.ts       # Normalization & validation
│  ├─ excelService.ts          # Excel parsing with multi-language
│  ├─ searchOptimizationService.ts  # Search optimization
│  ├─ securityService.ts       # Security services
│  └─ toastService.ts          # Notification service
├─ contexts/
│  ├─ ThemeContext.tsx         # Theme context
│  └─ LocaleContext.tsx        # Internationalization context
├─ hooks/
│  ├─ useSearch.ts             # Search functionality hook
│  ├─ useAdaptiveTheme.ts      # Adaptive theme hook
│  ├─ useBackgroundGradient.ts # Background gradient hook
│  └─ useThemeTransition.ts    # Theme transition hook
├─ i18n/
│  └─ languages/               # Multi-language translation files
│      ├─ zh-CN.ts             # Simplified Chinese
│      ├─ en-US.ts             # English
│      └─ ... (8 other languages)
├─ styles/
│  ├─ theme.css                # Theme styles
│  └─ tokens.css               # Design tokens
└─ ...

public/
├─ preview.html                # Independent preview window (multi-language)
├─ preview-i18n.js             # Preview window i18n support
└─ templates/
    └─ api_key_template.xlsx   # Excel template (multi-language)

src-tauri/
├─ src/
│  ├─ commands/
│  │  ├─ api_key_commands.rs       # CRUD operations
│  │  ├─ batch_import_commands.rs  # Batch import commands
│  │  └─ window_commands.rs        # Window management (multi-language)
│  ├─ database/                    # SQLite access (sqlx)
│  ├─ security/                     # Security module
│  └─ lib.rs / main.rs             # Tauri application entry
└─ tauri.conf.json                 # Tauri configuration
```

## 👩‍💻 Developer Guide

### Common Scripts
- Development: `npm run tauri:dev`
- Build: `npm run tauri:build`
- Unit Tests: `npm run test`
- Test UI: `npm run test:ui`

### Code Style
TypeScript + React componentization; camelCase for frontend-backend interfaces

### Batch Import Interface
Backend: `import_api_keys_batch(keys)` (fields: `name`, `keyValue`, `platform`, `description`)

### Multi-language Development Guide

#### Adding New Language
1. Create new language file in `src/i18n/languages/` (e.g., `de-DE.ts`)
2. Reference existing format and translate all text
3. Register new language in `src/i18n/index.ts`
4. Add translation in `public/preview-i18n.js`
5. Add window title translation in `get_preview_window_title` function

#### Independent Window i18n
- Preview window uses independent i18n system (`preview-i18n.js`)
- Supports `data-i18n` attribute for translatable elements
- Window titles set dynamically via backend commands

#### Excel Header Multi-language Support
- Define `COLUMN_HEADERS` mapping in `src/services/excelService.ts`
- System auto-detects current language and matches headers
- Intelligent fallback to default language when match fails

## 🌍 Multi-language Support

API Key Manager supports 9 languages:

| Language | Code | Status |
|----------|------|--------|
| Simplified Chinese | zh-CN | ✅ Full Support |
| English | en-US | ✅ Full Support |
| Traditional Chinese | zh-TW | ✅ Full Support |
| Portuguese | pt-BR | ✅ Full Support |
| Spanish | es-ES | ✅ Full Support |
| French | fr-FR | ✅ Full Support |
| Italian | it-IT | ✅ Full Support |
| Japanese | ja-JP | ✅ Full Support |
| Russian | ru-RU | ✅ Full Support |

### Language Switching
- Select desired language in settings panel
- Interface updates immediately to selected language
- Independent preview window syncs language
- Excel import matches headers based on current language

## 🤝 Contributing

Welcome to submit Issues / PRs to improve product experience and stability.

### Special Thanks
- Thanks to all developers who contributed to multi-language translations
- Thanks to users who provided bug feedback and feature suggestions

## 📄 License

MIT License

---

**Project Status**: 🌟 Multi-language internationalization support completed - 2025-09-22

**Latest Version**: v0.1.0 with MSI installer available in `src-tauri/target/release/bundle/msi/`