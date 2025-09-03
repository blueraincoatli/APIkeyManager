# 测试配置说明

## 已安装的测试依赖

- **vitest**: Vite原生测试框架
- **@vitest/ui**: Vitest的UI界面
- **jsdom**: 用于模拟浏览器环境
- **@testing-library/react**: React组件测试工具
- **@testing-library/jest-dom**: DOM元素断言扩展

## 测试脚本

在 `package.json` 中已添加以下测试脚本：

- `npm run test`: 运行测试（监听模式）
- `npm run test:ui`: 运行测试（UI界面模式）
- `npm run test:run`: 运行测试（单次运行模式）

## 运行测试

```bash
# 运行测试（监听模式）
npm run test

# 运行测试（UI界面模式）
npm run test:ui

# 运行测试（单次运行模式）
npm run test:run
```

## 测试文件结构

测试文件位于 `src/services/__tests__` 目录中，与被测试的源文件保持相同的目录结构。

## 测试示例

已配置测试示例来验证API Key服务的功能：

- 测试添加API Key功能
- 测试获取API Key列表功能
- 测试错误处理机制
- 测试输入验证功能

## 技术说明

由于项目使用Tauri框架，测试中需要mock Tauri的API调用。我们使用Vitest的mock功能来模拟 `@tauri-apps/api/core` 模块中的 `invoke` 函数。

## 测试覆盖率改进

我们已经改进了测试覆盖率，包括：

1. 验证错误处理机制
2. 验证输入验证功能
3. 验证正常功能流程

所有测试均已通过，确保了代码的稳定性和可靠性。