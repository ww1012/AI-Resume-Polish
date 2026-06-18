# AI Resume Polish 开发日志

## 1. 项目概览

### 项目目标

构建一个 AI 简历优化 SaaS：用户输入自己的简历和目标岗位 JD，系统输出面向岗位的简历诊断、关键词补强、表达优化建议和后续修改方向。

当前阶段目标是先搭建前端基础结构，不接入真实 AI API。

### 技术栈

- Next.js 14，使用 App Router
- React 18
- TypeScript
- Tailwind CSS
- shadcn 风格 UI 组件
- `react-markdown` 用于 Markdown 渲染
- 后续计划使用 Vercel AI SDK 做流式输出

### 当前实现范围

已完成：

1. 首页 `app/page.tsx`
   - Hero Section
   - “开始诊断”按钮
   - 跳转到 `/dashboard`

2. 工作台 `app/dashboard/page.tsx`
   - 左侧简历输入 Textarea
   - 右侧目标 JD 输入 Textarea
   - 中间自适应“开始优化”按钮
   - 点击按钮后展示本地 mock Markdown 结果

3. Markdown 结果展示
   - `components/markdown-stream.tsx`
   - 有内容时渲染 Markdown
   - 无内容时展示空状态

4. UI 基础组件
   - `components/ui/button.tsx`
   - `components/ui/textarea.tsx`
   - `components/ui/card.tsx`

5. 基础工程配置
   - `package.json`
   - `tsconfig.json`
   - `tailwind.config.ts`
   - `postcss.config.mjs`
   - `next.config.mjs`
   - `.eslintrc.json`
   - `.gitignore`

### 当前未实现范围

暂未实现：

- 真实 AI API 调用
- Vercel AI SDK `useCompletion` 或 `streamText` 接入
- API Route
- 用户登录
- 简历历史记录
- 数据库存储
- 计费系统
- 文件上传
- 简历导出

这些能力应在后续迭代中按模块逐步加入。

---

## 2. 当前架构与文件职责

### 目录结构

```text
app/
  globals.css
  layout.tsx
  page.tsx
  dashboard/
    page.tsx
components/
  markdown-stream.tsx
  ui/
    button.tsx
    card.tsx
    textarea.tsx
lib/
  utils.ts
```

### App Router 页面

#### `app/layout.tsx`

Root Layout，负责：

- 引入全局样式 `app/globals.css`
- 设置 HTML 语言为 `zh-CN`
- 设置基础 metadata：标题和描述

#### `app/page.tsx`

首页，负责产品首屏展示：

- Hero Section
- 产品价值说明
- CTA 按钮跳转 `/dashboard`

该页面是 Server Component，不包含客户端状态。

#### `app/dashboard/page.tsx`

核心工作台页面，使用 `"use client"`，负责：

- 管理简历输入状态 `resume`
- 管理 JD 输入状态 `jobDescription`
- 管理结果状态 `result`
- 点击“开始优化”时写入本地 mock Markdown 结果
- 组合输入区、按钮和 Markdown 展示区

当前数据流：

```text
用户输入简历/JD
      ↓
点击“开始优化”
      ↓
setResult(MOCK_RESULT)
      ↓
<MarkdownStream content={result} />
      ↓
react-markdown 渲染结果
```

后续接入 Vercel AI SDK 时，`setResult(MOCK_RESULT)` 可替换为 `useCompletion` 或自定义 streaming hook。

### 组件层

#### `components/ui/button.tsx`

shadcn 风格按钮组件：

- 使用 `class-variance-authority` 管理 variant 和 size
- 支持 `asChild`，可与 Next.js `Link` 组合
- 暴露 `Button` 和 `buttonVariants`

#### `components/ui/textarea.tsx`

shadcn 风格 Textarea：

- 使用 `React.forwardRef`
- 支持原生 `textarea` 属性
- 通过 `cn()` 合并 className

#### `components/ui/card.tsx`

shadcn 风格 Card 组件集合：

- `Card`
- `CardHeader`
- `CardTitle`
- `CardDescription`
- `CardContent`
- `CardFooter`

用于工作台输入区和结果区。

#### `components/markdown-stream.tsx`

结果展示组件：

- 接收 `content?: string`
- 有内容：用 `react-markdown` 渲染 Markdown
- 无内容：显示空状态
- 使用 `Card` 作为容器

虽然当前还没有真正 streaming，但组件接口已经按“接收持续更新的字符串内容”设计，后续可直接绑定 AI SDK 的流式结果。

### 样式系统

#### `app/globals.css`

负责：

- Tailwind base/components/utilities 引入
- shadcn 风格 CSS variables
- light/dark 两套颜色变量
- 全局 body 背景、文字和抗锯齿样式

#### `tailwind.config.ts`

负责：

- App、components、lib 的 Tailwind content 扫描
- container 配置
- shadcn CSS variable 颜色映射
- typography 插件支持 Markdown `prose` 样式
- `tailwindcss-animate` 插件

### 工具函数

#### `lib/utils.ts`

提供：

```ts
cn(...inputs: ClassValue[]): string
```

内部使用：

- `clsx`
- `tailwind-merge`

用于安全合并 Tailwind className。

---

## 3. 本轮开发记录

### 日期

2026-06-17

### 开发目标

搭建 AI 简历优化 SaaS 的前端基础骨架：

- 初始化 Next.js 14 + TypeScript + Tailwind 项目
- 创建 shadcn 风格基础 UI 组件
- 创建首页 Hero Section
- 创建 Dashboard 工作台
- 创建 Markdown 结果展示区
- 暂不连接真实 API

### 实现过程摘要

#### 1. 设计阶段

先确认了产品当前阶段只做最小可运行前端原型，不做登录、计费、数据库或真实 AI 调用。

设计文档已沉淀在：

```text
docs/superpowers/specs/2026-06-17-ai-resume-saas-foundation-design.md
```

实现计划已沉淀在：

```text
docs/superpowers/plans/2026-06-17-ai-resume-saas-foundation.md
```

#### 2. 工程初始化

创建了项目基础文件：

- `package.json`
- `tsconfig.json`
- `next-env.d.ts`
- `next.config.mjs`
- `.eslintrc.json`
- `.gitignore`
- `postcss.config.mjs`
- `tailwind.config.ts`
- `app/globals.css`
- `app/layout.tsx`
- `lib/utils.ts`

安装依赖后执行：

```bash
npm run lint
```

结果：通过。

#### 3. UI 组件

创建了：

- `components/ui/button.tsx`
- `components/ui/textarea.tsx`
- `components/ui/card.tsx`

review 中发现 `CardTitle` 的 ref 类型最初为 `HTMLParagraphElement`，实际渲染 `<h3>`，已修正为 `HTMLHeadingElement`。

#### 4. 首页

创建 `app/page.tsx`：

- 居中 Hero Section
- Badge 文案：`AI 简历诊断 · 面向目标岗位优化`
- 主 CTA：`开始诊断`
- 跳转目标：`/dashboard`

执行：

```bash
npm run lint
npm run build
```

结果：通过。

#### 5. Dashboard 与 Markdown 结果区

创建：

- `components/markdown-stream.tsx`
- `app/dashboard/page.tsx`

新增依赖：

- `@tailwindcss/typography`

Dashboard 当前行为：

- 用户可输入简历和 JD
- 点击“开始优化”后显示 mock Markdown 结果
- 结果通过 `react-markdown` 渲染

执行：

```bash
npm run lint
npm run build
```

结果：通过。

#### 6. 最终 review 后修正

最终 review 后修复了两项低风险问题：

1. `app/globals.css`
   - 增加 `.dark` 颜色变量，避免未来启用 dark class 时颜色异常。

2. `.gitignore`
   - 增加 `.claude/`
   - 增加 `tsconfig.tsbuildinfo`

未采纳的 review 建议：

- 空输入仍可点击生成 mock：保留，因为当前 spec 明确原型阶段暂不阻止点击。
- `MarkdownStream` 命名：保留，因为该组件是为后续流式输出预留接口。
- 首页两个 CTA 都指向 `/dashboard`：保留，因为当前没有其他页面，作为 Hero 主/次入口。
- 更严格 ESLint 和自定义字体：暂不引入，避免超出基础骨架范围。

### 当前验证结果

最终执行：

```bash
npm run lint
npm run build
```

结果：全部通过。

构建路由包含：

```text
/
/dashboard
```

### 注意事项

当前仓库还没有初始 commit。本轮实现按照用户要求未提交 commit。

如需保存当前状态，可执行：

```bash
git add .
git commit -m "feat: scaffold AI resume polish frontend"
```

---

## 4. 后续接入 Vercel AI SDK 指南

当前版本只使用本地 mock Markdown 结果。下一步可以接入 Vercel AI SDK，实现真实 AI 简历优化和流式输出。

### 推荐接入目标

用户点击“开始优化”后：

1. 将简历内容和 JD 发送到 API Route。
2. API Route 调用模型生成优化建议。
3. 前端以流式方式显示 Markdown。
4. `MarkdownStream` 继续负责展示内容，不负责 API 调用。

### 推荐文件新增

```text
app/api/optimize/route.ts
```

职责：

- 接收前端传入的 `resume` 和 `jobDescription`
- 构造 prompt
- 调用 Vercel AI SDK 的流式能力
- 返回 streaming response

### 前端建议改造点

当前 `app/dashboard/page.tsx` 中：

```ts
function handleOptimize() {
  setResult(MOCK_RESULT);
}
```

后续可替换为 Vercel AI SDK hook，例如：

```ts
const { completion, complete, isLoading, error } = useCompletion({
  api: "/api/optimize",
});
```

然后：

```ts
async function handleOptimize() {
  await complete(JSON.stringify({
    resume,
    jobDescription,
  }));
}
```

并将：

```tsx
<MarkdownStream content={result} />
```

替换为：

```tsx
<MarkdownStream content={completion} />
```

具体 API 形态需要以后根据 Vercel AI SDK 当前版本确认。

### Prompt 设计建议

后端 prompt 可以要求模型输出稳定 Markdown 格式，例如：

```text
你是资深招聘顾问和简历优化专家。
请根据用户简历和目标 JD，输出 Markdown 格式的优化建议。

输出结构必须包含：
1. 总体匹配度
2. JD 关键词提取
3. 简历当前问题
4. 可直接替换的 bullet point 改写建议
5. 下一步修改清单

要求：
- 不要编造用户没有提供的经历
- 如果信息不足，明确说明需要补充什么
- 建议要具体、可执行
```

### 需要新增的 UI 状态

接入真实 API 后建议补充：

- loading 状态：按钮显示“优化中...”并禁用
- error 状态：展示错误信息和重试入口
- 输入校验：简历和 JD 至少填写一项，建议两项都填写
- 取消生成：支持 abort 当前请求
- 结果复制：一键复制 Markdown

### 后续产品模块建议

按优先级建议：

1. 接入真实 AI 流式输出
2. 增加输入校验和 loading/error 状态
3. 增加“复制结果”按钮
4. 增加简历优化前后对照
5. 增加历史记录
6. 增加登录与用户数据隔离
7. 增加计费与用量限制
8. 增加文件上传和导出 PDF/Markdown

### 当前组件边界保持建议

继续保持：

- `DashboardPage` 管理业务状态和 API 调用
- `MarkdownStream` 只负责展示 Markdown 内容
- UI primitives 只做通用样式组件，不包含业务逻辑

这样可以避免后续接入 API 时组件职责混乱。

---

## 5. DeepSeek API 接入记录

### 日期

2026-06-17

### 实现内容

新增 `/api/optimize` 接口，使用 DeepSeek + Vercel AI SDK 生成简历优化结果。

后端：

- 新增 `app/api/optimize/route.ts`
- 使用 `createOpenAI` 指向 DeepSeek Base URL：`https://api.deepseek.com/v1`
- 使用模型：`deepseek-chat`
- 从环境变量 `DEEPSEEK_API_KEY` 读取 API Key
- 使用 `streamText` 返回流式结果
- 缺少 API Key 时返回 500 错误
- 简历和 JD 都为空时返回 400 错误

前端：

- `app/dashboard/page.tsx` 改为使用 `useCompletion`
- 点击“开始优化”后请求 `/api/optimize`
- 请求中按钮显示“优化中...”并禁用
- 支持基础输入校验和错误提示
- DeepSeek 返回 JSON 文本后，前端解析并转换为 Markdown 展示
- 流式过程中 JSON 不完整时展示原始文本，避免页面崩溃

新增环境变量示例：

```bash
DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

### 验证命令

```bash
npm run lint
npm run build
```
