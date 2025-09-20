# API Key Manager

## Project Overview

This is a secure, lightweight desktop application for managing API keys, designed for developers and researchers. It is built with [Tauri](https://tauri.app/), using a modern web frontend and a Rust backend.

**Key Technologies:**

*   **Frontend:** React 18, TypeScript, Tailwind CSS
*   **Backend:** Rust, Tauri
*   **Database:** SQLite with SQLCipher for encryption
*   **Build Tool:** Vite
*   **Testing:** Vitest

**Core Features:**

*   Secure API key storage with AES-256-GCM encryption and Argon2id password hashing.
*   Quick search functionality with a global shortcut.
*   "Smart Clipboard" for batch importing keys, with local LLM analysis capabilities.
*   A modern, themeable user interface with a radial menu for actions.

## Building and Running

### Prerequisites

*   Node.js 16+
*   Rust toolchain

### Development

1.  **Install dependencies:**
    ```bash
    npm install
    ```
2.  **Run the development server:**
    ```bash
    npm run tauri:dev
    ```

### Production Build

```bash
npm run tauri:build
```

### Testing

*   **Run all tests:**
    ```bash
    npm run test
    ```
*   **Run tests with UI:**
    ```bash
    npm run test:ui
    ```

## Development Conventions

*   **Code Style:** The project uses TypeScript for type safety and follows standard React best practices.
*   **Component-Based Architecture:** The UI is built with reusable React components located in `src/components`.
*   **State Management:** React Hooks (`useState`, `useContext`, and custom hooks in `src/hooks`) are used for state management.
*   **Styling:** Tailwind CSS is used for styling, with custom themes defined in `src/styles`.
*   **Backend Logic:** Rust is used for all backend operations, including database interactions and security features. Tauri commands are defined in `src-tauri/src/commands`.
*   **Documentation:** JSDoc is used for documenting public functions and components.
