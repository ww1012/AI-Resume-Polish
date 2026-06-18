# AI Resume Polish

AI Resume Polish 是一个面向求职者的 AI 简历优化工具。你可以粘贴自己的简历内容和目标岗位 JD，系统会基于岗位要求输出结构化的简历诊断与优化建议，帮助你更快调整简历表达、补齐关键词并突出岗位匹配度。

## 功能特性

- **简历内容输入**：粘贴现有简历文本，快速进入优化流程。
- **目标 JD 输入**：粘贴目标岗位描述，让优化建议更贴合具体岗位。
- **AI 优化建议**：基于简历与 JD 生成岗位匹配分析、关键词补强和表达优化建议。
- **Markdown 结果展示**：优化结果以 Markdown 形式渲染，便于阅读和后续整理。
- **SaaS 原型结构**：采用 Next.js App Router，方便后续扩展登录、历史记录、支付、导出等能力。

## 技术栈

- [Next.js 14](https://nextjs.org/) App Router
- [React 18](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- shadcn 风格 UI 组件
- [Vercel AI SDK](https://sdk.vercel.ai/)
- DeepSeek OpenAI-compatible API

## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/ww1012/AI-Resume-Polish.git
cd AI-Resume-Polish
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

在项目根目录创建 `.env.local`：

```env
DEEPSEEK_API_KEY=your_deepseek_api_key
```

当前接口实际读取的环境变量是 `DEEPSEEK_API_KEY`。

### 4. 启动开发服务

```bash
npm run dev
```

浏览器访问：

```text
http://localhost:3000
```

## 常用脚本

```bash
npm run dev    # 启动开发服务
npm run build  # 构建生产版本
npm run start  # 启动生产服务
npm run lint   # 运行 lint 检查
```

## 项目结构

```text
app/
  api/
    optimize/        # AI 简历优化接口
  dashboard/         # 简历优化工作台页面
  globals.css        # 全局样式
  layout.tsx         # Root Layout 与页面 metadata
  page.tsx           # 首页 Hero 与入口
components/
  markdown-stream.tsx
  ui/                # shadcn 风格基础组件
lib/
  utils.ts           # Tailwind className 工具函数
dev-md/              # 开发日志
fix-md/              # 修复日志
```

## Roadmap

- [ ] 优化 DeepSeek API 错误提示与前端展示。
- [ ] 支持流式输出状态、loading 和重试。
- [ ] 增加简历历史记录。
- [ ] 支持文件上传与解析。
- [ ] 支持优化结果导出。
- [ ] 增加用户登录、额度和计费能力。

## License

本项目基于 [MIT License](./LICENSE) 开源。
