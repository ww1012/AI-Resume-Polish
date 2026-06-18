# AI 简历优化 SaaS 基础页面设计

## 背景

当前仓库为空 Git 仓库。本次目标是初始化一个可运行的 Next.js 14 App Router 项目，并搭建 AI 简历优化 SaaS 的最小前端基础结构。暂不连接后端 API，也不实现真实 AI 调用。

## 范围

本次实现包含：

- Next.js 14 + TypeScript + Tailwind CSS 基础项目结构。
- shadcn 风格的基础 UI 组件：Button、Textarea、Card。
- 首页 Hero Section。
- Dashboard 工作台页面。
- 支持 Markdown 渲染的结果展示区。
- 本地 mock 文本，用于模拟优化结果。

本次不包含：

- 用户登录、权限、计费。
- 数据库存储。
- Vercel AI SDK API 路由。
- 真实流式模型调用。

## 页面设计

### 首页 `app/page.tsx`

首页用于承接用户进入产品的第一步：

- 居中 Hero Section。
- 主标题突出 AI 简历优化价值。
- 副标题说明用户可以粘贴简历和 JD，获得针对性修改建议。
- “开始诊断”按钮跳转到 `/dashboard`。

### 工作台 `app/dashboard/page.tsx`

工作台是核心页面：

- 顶部展示页面标题和简短说明。
- 主输入区响应式布局：
  - 桌面端为三列：左侧简历输入，中间操作按钮，右侧 JD 输入。
  - 移动端上下堆叠，按钮在输入区之间或下方自然排列。
- 左侧 Textarea 输入简历内容。
- 右侧 Textarea 输入目标职位 JD。
- 中间“开始优化”按钮根据页面宽度自适应。
- 点击按钮后展示 mock Markdown 优化结果。

### 结果展示区

结果区位于工作台下方：

- 使用 Card 包裹，保持清晰层级。
- 通过 `react-markdown` 渲染 Markdown。
- 空状态显示“优化结果将在这里显示”。
- 预留后续接入 Vercel AI SDK streaming 的内容形态：组件接收字符串 content，未来可直接绑定流式结果。

## 组件设计

### UI 基础组件

- `components/ui/button.tsx`
- `components/ui/textarea.tsx`
- `components/ui/card.tsx`

这些组件采用 shadcn 风格实现，依赖 `class-variance-authority`、`clsx`、`tailwind-merge` 和 `lib/utils.ts`。

### Markdown 展示组件

- `components/markdown-stream.tsx`

职责：

- 接收 `content?: string`。
- 有内容时用 `react-markdown` 渲染。
- 无内容时展示空状态。
- 不负责调用 API，不持有业务状态。

## 数据流

当前版本只使用本地状态：

1. 用户在 Dashboard 输入简历与 JD。
2. 用户点击“开始优化”。
3. 页面将 mock Markdown 文本写入结果状态。
4. Markdown 展示组件渲染结果。

后续接入 Vercel AI SDK 时，可将第 3 步替换为 `useCompletion` 或类似 hook 的流式输出。

## 错误处理

当前无外部 API，错误面较小：

- 输入为空时暂不阻止点击，保持原型简单。
- 后续接入 API 时再加入 loading、error、disabled、重试等状态。

## 测试与验证

实现后需要验证：

- 项目可安装依赖并启动。
- 首页 `/` 能正常展示 Hero。
- “开始诊断”跳转到 `/dashboard`。
- Dashboard 在桌面与移动宽度下布局合理。
- 点击“开始优化”后出现 Markdown 渲染结果。
- TypeScript 与 lint 检查通过。
