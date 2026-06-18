# DeepSeek Optimize API Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a DeepSeek-backed `/api/optimize` streaming API and connect the Dashboard to it with Vercel AI SDK while preserving the current Markdown result display.

**Architecture:** The backend exposes a focused App Router API route that validates input, creates a DeepSeek-compatible OpenAI provider, calls `streamText`, and returns a data stream response. The frontend uses `useCompletion` to send resume/JD input and formats the streamed JSON text into Markdown for the existing `MarkdownStream` component.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript, Tailwind CSS, Vercel AI SDK `ai`, `@ai-sdk/openai`, DeepSeek `deepseek-chat`, `react-markdown`.

## Global Constraints

- New API route path must be `app/api/optimize/route.ts`.
- DeepSeek Base URL must be `https://api.deepseek.com/v1`.
- DeepSeek Model Name must be `deepseek-chat`.
- API Key must be read from environment variable `DEEPSEEK_API_KEY`.
- Backend must use Vercel AI SDK `createOpenAI` and `streamText`.
- Frontend must connect with Vercel AI SDK `useCompletion`.
- Model output is JSON text with `score`, `missing_keywords`, `analysis`, and `optimized_content`.
- Frontend must convert completed/parseable JSON into Markdown for the existing `MarkdownStream` display.
- Frontend must tolerate incomplete streaming JSON by showing raw streamed content instead of crashing.
- Add loading, error, and basic input validation states.
- Do not implement authentication, database storage, history, billing, file upload, export, or a structured card result page.
- Do not commit changes unless the user explicitly asks for commits.

---

## File Structure

- Modify `package.json` — add `ai` and `@ai-sdk/openai` runtime dependencies.
- Modify `package-lock.json` — update via `npm install`.
- Create `.env.local.example` — document `DEEPSEEK_API_KEY` without a real secret.
- Create `app/api/optimize/route.ts` — DeepSeek streaming API route.
- Modify `app/dashboard/page.tsx` — replace mock result with `useCompletion`, input validation, loading/error UI, and JSON-to-Markdown formatting.
- Modify `dev-md/03-development-log.md` — append API integration notes after implementation.

---

### Task 1: Add Vercel AI SDK dependencies and environment example

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `.env.local.example`

**Interfaces:**
- Consumes: existing npm project configuration.
- Produces:
  - Runtime dependencies `ai` and `@ai-sdk/openai` available to API route and Dashboard.
  - `.env.local.example` documenting `DEEPSEEK_API_KEY=your_deepseek_api_key_here`.

- [ ] **Step 1: Add dependencies to `package.json`**

Modify the `dependencies` object in `package.json` so it includes these entries:

```json
{
  "dependencies": {
    "@ai-sdk/openai": "^1.3.23",
    "@radix-ui/react-slot": "^1.1.0",
    "ai": "^4.3.16",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "lucide-react": "^0.468.0",
    "next": "14.2.5",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-markdown": "^9.0.1",
    "tailwind-merge": "^2.5.2",
    "tailwindcss-animate": "^1.0.7"
  }
}
```

- [ ] **Step 2: Create `.env.local.example`**

Create `.env.local.example`:

```dotenv
DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

- [ ] **Step 3: Install dependencies**

Run:

```bash
npm install
```

Expected: command exits successfully and updates `package-lock.json`.

- [ ] **Step 4: Verify dependency installation**

Run:

```bash
npm run lint
```

Expected: PASS with no ESLint errors.

---

### Task 2: Implement `/api/optimize` DeepSeek streaming route

**Files:**
- Create: `app/api/optimize/route.ts`

**Interfaces:**
- Consumes:
  - `DEEPSEEK_API_KEY` from `process.env`.
  - POST request body shaped as `{ resume?: string; jobDescription?: string }`.
  - `createOpenAI` from `@ai-sdk/openai`.
  - `streamText` from `ai`.
- Produces:
  - `POST(request: Request): Promise<Response>`.
  - 400 JSON response when both inputs are empty.
  - 500 JSON response when `DEEPSEEK_API_KEY` is missing.
  - Data stream response from `streamText` when valid.

- [ ] **Step 1: Create API route**

Create `app/api/optimize/route.ts`:

```ts
import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";

interface OptimizeRequestBody {
  resume?: string;
  jobDescription?: string;
}

const deepseek = createOpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY,
});

function buildSystemPrompt(resume: string, jobDescription: string) {
  return `# Role
你是一位拥有 10 年经验的资深技术招聘专家 (Tech Recruiter)，精通 ATS (Application Tracking System) 筛选规则。

# Context
候选人简历内容：
${resume || "用户未提供简历内容。"}

目标职位 JD：
${jobDescription || "用户未提供目标职位 JD。"}

# Task
请分析候选人简历与 JD 的匹配度，并给出优化后的简历内容。

# Requirements
1. **STAR 法则**：将经历改写为 Situation, Task, Action, Result 格式。
2. **关键词植入**：从 JD 中提取高频关键词，自然融入简历。
3. **量化成果**：将"提升了性能"改为"性能提升 50%"。
4. **语气**：专业、自信、客观。

# Output Format
请只返回 JSON，不要返回 Markdown，不要使用代码块包裹。
{
  "score": 0-100,
  "missing_keywords": ["..."],
  "analysis": "...",
  "optimized_content": "..."
}`;
}

export async function POST(request: Request) {
  if (!process.env.DEEPSEEK_API_KEY) {
    return Response.json(
      { error: "Missing DEEPSEEK_API_KEY environment variable." },
      { status: 500 },
    );
  }

  const body = (await request.json()) as OptimizeRequestBody;
  const resume = body.resume?.trim() ?? "";
  const jobDescription = body.jobDescription?.trim() ?? "";

  if (!resume && !jobDescription) {
    return Response.json(
      { error: "请先输入简历内容或目标 JD。" },
      { status: 400 },
    );
  }

  const result = streamText({
    model: deepseek("deepseek-chat"),
    system: buildSystemPrompt(resume, jobDescription),
    prompt: "请根据 System Prompt 中的简历和 JD，返回严格 JSON 格式的优化结果。",
    temperature: 0.2,
  });

  return result.toDataStreamResponse();
}
```

- [ ] **Step 2: Verify API route compiles**

Run:

```bash
npm run lint
```

Expected: PASS with no ESLint errors.

- [ ] **Step 3: Verify production build catches route type errors**

Run:

```bash
npm run build
```

Expected: PASS. Build output includes `/api/optimize` under route handlers or no TypeScript errors for the route.

---

### Task 3: Connect Dashboard to `/api/optimize`

**Files:**
- Modify: `app/dashboard/page.tsx`

**Interfaces:**
- Consumes:
  - `useCompletion` from `ai/react`.
  - API route `/api/optimize` accepting `{ resume: string; jobDescription: string }`.
  - Existing `MarkdownStream({ content?: string })`.
- Produces:
  - `formatOptimizationResult(content: string): string`.
  - Dashboard button that calls `complete("", { body: { resume, jobDescription } })`.
  - Input validation message when both inputs are empty.
  - Error message when `useCompletion` returns an error.
  - Loading button state.

- [ ] **Step 1: Replace dashboard implementation**

Replace the full content of `app/dashboard/page.tsx` with:

```tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useCompletion } from "ai/react";
import { ArrowLeft, Wand2 } from "lucide-react";

import { MarkdownStream } from "@/components/markdown-stream";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface OptimizationResult {
  score?: number;
  missing_keywords?: string[];
  analysis?: string;
  optimized_content?: string;
}

function stripJsonCodeFence(content: string) {
  return content
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```$/i, "")
    .trim();
}

function formatOptimizationResult(content: string) {
  if (!content.trim()) {
    return "";
  }

  try {
    const parsed = JSON.parse(stripJsonCodeFence(content)) as OptimizationResult;
    const keywords = parsed.missing_keywords?.length
      ? parsed.missing_keywords.map((keyword) => `- ${keyword}`).join("\n")
      : "暂无明显缺失关键词。";

    return `## 简历优化结果

### 匹配度评分
${typeof parsed.score === "number" ? `${parsed.score}/100` : "模型未返回评分。"}

### 缺失关键词
${keywords}

### 分析
${parsed.analysis || "模型未返回分析。"}

### 优化后的简历内容
${parsed.optimized_content || "模型未返回优化后的简历内容。"}`;
  } catch {
    return content;
  }
}

export default function DashboardPage() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [validationError, setValidationError] = useState("");

  const { completion, complete, error, isLoading } = useCompletion({
    api: "/api/optimize",
  });

  const formattedResult = useMemo(
    () => formatOptimizationResult(completion),
    [completion],
  );

  async function handleOptimize() {
    if (!resume.trim() && !jobDescription.trim()) {
      setValidationError("请先输入简历内容或目标 JD。");
      return;
    }

    setValidationError("");
    await complete("", {
      body: {
        resume,
        jobDescription,
      },
    });
  }

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="container py-8">
        <Button
          asChild
          variant="ghost"
          className="mb-6 px-0 text-muted-foreground hover:text-foreground"
        >
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回首页
          </Link>
        </Button>

        <section className="mb-8">
          <p className="text-sm font-medium text-primary">AI Resume Workspace</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            简历优化工作台
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            在左侧粘贴你的简历，在右侧粘贴目标岗位 JD，系统会生成面向岗位的 Markdown 优化建议。
          </p>
        </section>

        <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-stretch">
          <Card>
            <CardHeader>
              <CardTitle>简历内容</CardTitle>
              <CardDescription>
                粘贴你的原始简历，建议包含项目经历和技能栈。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={resume}
                onChange={(event) => setResume(event.target.value)}
                placeholder="例如：3 年前端开发经验，熟悉 React、Next.js..."
                className="min-h-[320px] resize-none"
              />
            </CardContent>
          </Card>

          <div className="flex items-center justify-center py-2 lg:px-2">
            <Button
              onClick={handleOptimize}
              disabled={isLoading}
              size="lg"
              className="w-full gap-2 lg:w-auto"
            >
              <Wand2 className="h-4 w-4" />
              {isLoading ? "优化中..." : "开始优化"}
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>目标 JD</CardTitle>
              <CardDescription>
                粘贴目标职位描述，便于分析关键词和能力匹配。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={jobDescription}
                onChange={(event) => setJobDescription(event.target.value)}
                placeholder="例如：岗位要求熟悉 Next.js、具备 AI 产品经验..."
                className="min-h-[320px] resize-none"
              />
            </CardContent>
          </Card>
        </section>

        {(validationError || error) && (
          <div className="mt-6 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {validationError || error?.message || "优化失败，请稍后重试。"}
          </div>
        )}

        <section className="mt-6">
          <MarkdownStream content={formattedResult} />
        </section>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Verify Dashboard compiles**

Run:

```bash
npm run lint
```

Expected: PASS with no ESLint errors.

- [ ] **Step 3: Verify full build**

Run:

```bash
npm run build
```

Expected: PASS. Build output includes `/`, `/dashboard`, and no API route type errors.

---

### Task 4: Update development documentation

**Files:**
- Modify: `dev-md/03-development-log.md`

**Interfaces:**
- Consumes: completed API implementation details.
- Produces: updated development log noting `/api/optimize`, DeepSeek config, frontend `useCompletion`, JSON-to-Markdown behavior, required env var, and validation commands.

- [ ] **Step 1: Append API integration note**

Append this section to `dev-md/03-development-log.md`:

```md

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
```

- [ ] **Step 2: Verify docs and code status**

Run:

```bash
git status --short
```

Expected: API implementation files and docs are listed as uncommitted changes. Do not commit unless the user explicitly asks for commits.

---

## Self-Review

### 1. Spec coverage

- `/api/optimize` route: Task 2.
- DeepSeek Base URL/model/env var: Task 2.
- `createOpenAI` and `streamText`: Task 2.
- Frontend `useCompletion`: Task 3.
- JSON-to-Markdown conversion: Task 3.
- Incomplete JSON fallback: Task 3.
- loading, error, input validation states: Task 3.
- `.env.local.example`: Task 1.
- dependencies `ai` and `@ai-sdk/openai`: Task 1.
- development documentation update: Task 4.
- excluded auth/database/history/billing/upload/export/card result page: Global Constraints.

### 2. Placeholder scan

No `TBD`, `TODO`, “implement later”, or vague placeholder steps remain. Every code-producing step includes exact file content or exact replacement instructions.

### 3. Type consistency

- API route consumes `{ resume?: string; jobDescription?: string }` and Dashboard sends `{ resume, jobDescription }`.
- Dashboard produces `formatOptimizationResult(content: string): string` and passes its result to `MarkdownStream({ content?: string })`.
- `OptimizationResult` fields match the requested JSON keys: `score`, `missing_keywords`, `analysis`, and `optimized_content`.
