在 Vibe Coding（或任何前端开发）中，距离、位置、大小难以控制，以及 LLM 生成重复代码或对不齐元素的问题，往往源于缺乏统一的布局策略和代码规范。下面给出一套系统性解决思路，覆盖从底层规范到上层布局的全流程，帮你把“对不齐”“嵌套乱”“重复 class”等问题一次性收敛。

### 1. 先把“地基”打平：统一设计 Token 与代码规范
- **设计 Token 原子化**  
  把间距、圆角、字体大小等抽成设计变量（Token），用 JSON/SCSS/JS 模块统一管理。例如：  
  ```scss
  // tokens.scss
  $space: (
    xs: 4px,
    s: 8px,
    m: 16px,
    l: 24px,
    xl: 32px
  );
  ```
  组件里只允许引用这些变量，禁止写 magic number，从根本上消除“8px 还是 10px”的争论。

- **CSS 架构与命名规范**  
  采用 BEM 或 CSS-in-JS 的 scoped class，避免 LLM 生成重复 class。例如：  
  ```scss
  .card {
    &__header { margin-bottom: $space[m]; }
    &__body { padding: $space[m]; }
  }
  ```
  配合 Stylelint 自动检查，发现重复或违规 class 立即报错。

### 2. 布局：用现代 CSS 降低嵌套复杂度
- **弹性容器优先**  
  把传统“绝对定位 + 层层嵌套”改为 Flexbox/Grid，减少无谓的 wrapper。例如水平居中：  
  ```scss
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
  }
  ```
  垂直居中、等分布局一行代码即可，无需计算 top/left。

- **响应式断点统一**  
  把媒体查询封装成 Mixin，避免 LLM 写出重复的 `@media (max-width: 768px)`：  
  ```scss
  @mixin tablet { @media (max-width: 768px) { @content; } }
  .card { @include tablet { flex-direction: column; } }
  ```

### 3. 工具链：让 AI 和编辑器协同纠错
- **Vibe Coding 阶段**  
  在提示词里加入“禁止内联样式、禁止 magic number、必须用 Token”等规则，强制 LLM 输出规范代码。

- **编辑器实时校验**  
  VS Code 安装 Prettier + Stylelint，保存时自动格式化并标记违规样式。  
  例如发现 `margin: 10px` 会立即提示“请使用 $space[s]”。

- **运行时调试**  
  浏览器 DevTools 的 Layout 面板可实时查看 Grid/Flexbox 的对齐线，快速定位“为什么没对齐”。  
  配合 Storybook 把组件隔离测试，避免嵌套副作用。

### 4. 典型场景速查
| 场景 | 推荐方案 | 避坑点 |
|---|---|---|
| 垂直居中 | `display: flex; align-items: center` | 父容器不要写死 height |
| 等分布局 | `display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))` | 避免写死列宽 |
| 响应式间距 | `margin: $space[m] $space[s]` | 禁止用 `px` 写死 |

按以上思路落地后，你会发现：  
- 距离/位置问题从“手动调”变成“自动对齐”；  
- LLM 生成的代码重复率显著下降；  
- 嵌套层级减少，布局更易维护。