# DeepSeek 简历优化 API 接入设计

## 背景

当前项目已经完成 AI 简历优化 SaaS 的前端基础骨架，但 Dashboard 仍使用本地 mock Markdown 结果。`text/api.md` 要求实现 `/api/optimize` 接口，使用 DeepSeek 大模型和 Vercel AI SDK 进行流式生成。

## 范围

本次实现包含：

- 新增 `/api/optimize` API Route。
- 使用 Vercel AI SDK 的 `createOpenAI` 创建 DeepSeek 兼容客户端。
- 使用 `streamText` 进行流式生成。
- 从环境变量 `DEEPSEEK_API_KEY` 读取 API Key。
- 前端 Dashboard 使用 Vercel AI SDK 的 `useCompletion` 连接 API。
- 将模型返回的 JSON 文本格式化为 Markdown 后复用现有 `MarkdownStream` 展示。
- 增加 loading、error 和基础输入校验状态。

本次不包含：

- 用户登录。
- 数据库存储。
- 历史记录。
- 计费和用量限制。
- 文件上传或导出。
- 结构化卡片式结果页面。

## 后端设计

新增文件：

```text
app/api/optimize/route.ts
```

职责：

1. 只处理 `POST` 请求。
2. 从请求体读取：
   - `resume: string`
   - `jobDescription: string`
3. 校验输入：
   - `resume` 和 `jobDescription` 至少有一个非空。
4. 校验环境变量：
   - 缺少 `DEEPSEEK_API_KEY` 时返回 500 JSON 错误。
5. 创建 DeepSeek 客户端：
   - Base URL: `https://api.deepseek.com/v1`
   - Model Name: `deepseek-chat`
6. 使用 `streamText` 生成结果。
7. 返回 `result.toDataStreamResponse()`。

## Prompt 设计

使用 `text/api.md` 中的要求构造 system prompt，并将用户输入嵌入上下文。

模型角色：

- 10 年经验资深技术招聘专家。
- 精通 ATS 筛选规则。

任务：

- 分析候选人简历与 JD 的匹配度。
- 给出优化后的简历内容。

要求：

1. 使用 STAR 法则改写经历。
2. 从 JD 中提取关键词并自然融入简历。
3. 将成果量化。
4. 语气专业、自信、客观。

输出格式要求模型返回 JSON：

```json
{
  "score": 0,
  "missing_keywords": ["..."],
  "analysis": "...",
  "optimized_content": "..."
}
```

## 前端设计

修改文件：

```text
app/dashboard/page.tsx
```

职责变化：

- 移除本地 mock 结果。
- 引入 `useCompletion`。
- 点击“开始优化”时调用 `/api/optimize`。
- 请求体包含：
  - `resume`
  - `jobDescription`
- 使用 `isLoading` 控制按钮文案和禁用状态。
- 展示 `error` 信息。
- 将 completion 文本转换为 Markdown 后传给 `MarkdownStream`。

## JSON 到 Markdown 转换

前端新增函数：

```ts
function formatOptimizationResult(content: string): string
```

逻辑：

1. 如果 `content` 为空，返回空字符串。
2. 尝试 `JSON.parse(content)`。
3. 解析成功时，转换为 Markdown：
   - `## 简历优化结果`
   - `### 匹配度评分`
   - `### 缺失关键词`
   - `### 分析`
   - `### 优化后的简历内容`
4. 解析失败时返回原始 `content`，保证流式生成过程中仍可显示文本。

## 用户体验

- 用户必须至少填写简历或 JD 之一才能请求 API。
- 请求中按钮显示“优化中...”。
- 请求中按钮禁用，避免重复提交。
- 错误时在结果区上方展示错误文案。
- 结果区继续使用现有 Markdown 视觉风格。

## 环境变量

需要用户在本地或部署环境配置：

```bash
DEEPSEEK_API_KEY=your_api_key_here
```

建议新增 `.env.local.example`，说明环境变量名称，但不写真实密钥。

## 依赖

新增运行时依赖：

- `ai`
- `@ai-sdk/openai`

## 验证

实现后需要验证：

- `npm install` 成功。
- `npm run lint` 通过。
- `npm run build` 通过。
- 未配置 `DEEPSEEK_API_KEY` 时，API 返回清晰错误。
- 配置 `DEEPSEEK_API_KEY` 后，Dashboard 点击“开始优化”可发起流式请求。
- 返回 JSON 完整时能格式化成 Markdown 展示。
- 流式未完成或 JSON 不完整时不会崩溃，展示原始文本。
