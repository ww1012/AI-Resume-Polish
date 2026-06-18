# AI Resume SaaS Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Initialize a runnable Next.js 14 App Router project for an AI resume optimization SaaS with a homepage, dashboard workspace, and Markdown result display.

**Architecture:** Use a minimal App Router structure with focused page files and reusable shadcn-style UI primitives. Keep AI behavior mocked locally so the dashboard can later swap the mock result state for Vercel AI SDK streaming output without restructuring the UI.

**Tech Stack:** Next.js 14, React 18, TypeScript, Tailwind CSS, shadcn-style components, `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`, `react-markdown`.

## Global Constraints

- Current repository is empty except for Git metadata and the approved spec.
- Implement a complete Next.js 14 + TypeScript + Tailwind CSS base project.
- Use App Router under `app/`.
- Create shadcn-style `Button`, `Textarea`, and `Card` primitives.
- Create `app/page.tsx` with a Hero Section and “开始诊断” button linking to `/dashboard`.
- Create `app/dashboard/page.tsx` with resume input, JD input, responsive “开始优化” button, and result area.
- Support Markdown rendering for the result area using `react-markdown`.
- Do not connect API routes or real AI calls in this implementation.
- Do not implement authentication, billing, persistence, or database storage.
- Do not commit changes unless the user explicitly asks for commits.

---

## File Structure

- Create `package.json` — project scripts and runtime/dev dependencies.
- Create `tsconfig.json` — TypeScript configuration and `@/*` path alias.
- Create `next-env.d.ts` — Next.js TypeScript environment declarations.
- Create `next.config.mjs` — Next.js config.
- Create `.eslintrc.json` — Next.js lint config.
- Create `.gitignore` — ignore build artifacts, dependencies, local env files.
- Create `postcss.config.mjs` — Tailwind PostCSS setup.
- Create `tailwind.config.ts` — Tailwind content paths and design tokens.
- Create `app/globals.css` — Tailwind layers and theme CSS variables.
- Create `app/layout.tsx` — root metadata and layout shell.
- Create `lib/utils.ts` — `cn()` className merge helper used by UI components.
- Create `components/ui/button.tsx` — shadcn-style Button primitive.
- Create `components/ui/textarea.tsx` — shadcn-style Textarea primitive.
- Create `components/ui/card.tsx` — shadcn-style Card primitives.
- Create `components/markdown-stream.tsx` — Markdown result renderer with empty state.
- Create `app/page.tsx` — homepage Hero Section.
- Create `app/dashboard/page.tsx` — client-side dashboard workspace.

---

### Task 1: Scaffold Next.js project foundation

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next-env.d.ts`
- Create: `next.config.mjs`
- Create: `.eslintrc.json`
- Create: `.gitignore`
- Create: `postcss.config.mjs`
- Create: `tailwind.config.ts`
- Create: `app/globals.css`
- Create: `app/layout.tsx`
- Create: `lib/utils.ts`

**Interfaces:**
- Consumes: no code from earlier tasks.
- Produces:
  - `cn(...inputs: ClassValue[]): string` from `lib/utils.ts`.
  - Root App Router layout from `app/layout.tsx`.
  - Tailwind theme variables and utility classes available to all pages/components.

- [ ] **Step 1: Create dependency and script configuration**

Create `package.json` with this exact content:

```json
{
  "name": "ai-resume-polish",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@radix-ui/react-slot": "^1.1.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "lucide-react": "^0.468.0",
    "next": "14.2.5",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-markdown": "^9.0.1",
    "tailwind-merge": "^2.5.2",
    "tailwindcss-animate": "^1.0.7"
  },
  "devDependencies": {
    "@types/node": "^20.14.10",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "autoprefixer": "^10.4.19",
    "eslint": "^8.57.0",
    "eslint-config-next": "14.2.5",
    "postcss": "^8.4.39",
    "tailwindcss": "^3.4.4",
    "typescript": "^5.5.3"
  }
}
```

- [ ] **Step 2: Create TypeScript and Next.js config files**

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "es2022"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

Create `next-env.d.ts`:

```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/basic-features/typescript for more information.
```

Create `next.config.mjs`:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;
```

Create `.eslintrc.json`:

```json
{
  "extends": ["next/core-web-vitals"]
}
```

Create `.gitignore`:

```gitignore
node_modules
.next
out
.vercel
.env*.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
.DS_Store
```

- [ ] **Step 3: Create Tailwind and PostCSS configuration**

Create `postcss.config.mjs`:

```js
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;
```

Create `tailwind.config.ts`:

```ts
import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
```

- [ ] **Step 4: Create global styles, root layout, and utility helper**

Create `app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 220 33% 98%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.75rem;
  }

  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground antialiased;
  }
}
```

Create `app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 简历优化",
  description: "粘贴简历和 JD，获得针对性的 AI 优化建议。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
```

Create `lib/utils.ts`:

```ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 5: Install dependencies**

Run:

```bash
npm install
```

Expected: command exits successfully and creates `package-lock.json`.

- [ ] **Step 6: Verify foundation builds enough for linting**

Run:

```bash
npm run lint
```

Expected: PASS with no ESLint errors. If Next.js prompts to configure ESLint, the `.eslintrc.json` from Step 2 should prevent the interactive prompt.

- [ ] **Step 7: Review checkpoint**

Run:

```bash
git status --short
```

Expected: new project foundation files are listed as untracked or modified. Do not commit unless the user explicitly asks for commits.

---

### Task 2: Create shadcn-style UI primitives

**Files:**
- Create: `components/ui/button.tsx`
- Create: `components/ui/textarea.tsx`
- Create: `components/ui/card.tsx`

**Interfaces:**
- Consumes:
  - `cn(...inputs: ClassValue[]): string` from `lib/utils.ts`.
- Produces:
  - `Button` React component supporting `variant`, `size`, and `asChild` props.
  - `buttonVariants()` class variance helper.
  - `Textarea` React component.
  - `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` React components.

- [ ] **Step 1: Create Button primitive**

Create `components/ui/button.tsx`:

```tsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
```

- [ ] **Step 2: Create Textarea primitive**

Create `components/ui/textarea.tsx`:

```tsx
import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
```

- [ ] **Step 3: Create Card primitives**

Create `components/ui/card.tsx`:

```tsx
import * as React from "react";

import { cn } from "@/lib/utils";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow-sm",
      className,
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
```

- [ ] **Step 4: Verify UI primitives type-check through lint**

Run:

```bash
npm run lint
```

Expected: PASS with no ESLint errors.

- [ ] **Step 5: Review checkpoint**

Run:

```bash
git status --short
```

Expected: `components/ui/button.tsx`, `components/ui/textarea.tsx`, and `components/ui/card.tsx` are listed. Do not commit unless the user explicitly asks for commits.

---

### Task 3: Build homepage Hero Section

**Files:**
- Create: `app/page.tsx`

**Interfaces:**
- Consumes:
  - `Button` from `components/ui/button.tsx`.
- Produces:
  - `/` route with Hero Section.
  - Link target `/dashboard` through the “开始诊断” call-to-action.

- [ ] **Step 1: Create homepage**

Create `app/page.tsx`:

```tsx
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.16),_transparent_34rem)]">
      <section className="container flex min-h-screen flex-col items-center justify-center py-20 text-center">
        <div className="mb-6 inline-flex items-center rounded-full border bg-card px-4 py-2 text-sm text-muted-foreground shadow-sm">
          <Sparkles className="mr-2 h-4 w-4 text-primary" />
          AI 简历诊断 · 面向目标岗位优化
        </div>

        <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl">
          让你的简历更贴合
          <span className="text-primary">目标 JD</span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          粘贴你的简历和目标职位描述，快速获得结构化诊断、关键词补强和表达优化建议。
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="text-base">
            <Link href="/dashboard">
              开始诊断
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-base">
            <Link href="/dashboard">查看工作台</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
```

- [ ] **Step 2: Verify homepage compiles**

Run:

```bash
npm run lint
```

Expected: PASS with no ESLint errors.

- [ ] **Step 3: Verify homepage route with production build**

Run:

```bash
npm run build
```

Expected: PASS. Build output includes `/` as a route.

- [ ] **Step 4: Review checkpoint**

Run:

```bash
git status --short
```

Expected: `app/page.tsx` is listed. Do not commit unless the user explicitly asks for commits.

---

### Task 4: Build Markdown result component and dashboard workspace

**Files:**
- Create: `components/markdown-stream.tsx`
- Create: `app/dashboard/page.tsx`

**Interfaces:**
- Consumes:
  - `Button` from `components/ui/button.tsx`.
  - `Textarea` from `components/ui/textarea.tsx`.
  - `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent` from `components/ui/card.tsx`.
- Produces:
  - `MarkdownStream({ content }: { content?: string })` component.
  - `/dashboard` route with resume input, JD input, responsive optimize button, and Markdown result display.

- [ ] **Step 1: Create Markdown result renderer**

Create `components/markdown-stream.tsx`:

```tsx
import ReactMarkdown from "react-markdown";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface MarkdownStreamProps {
  content?: string;
}

export function MarkdownStream({ content }: MarkdownStreamProps) {
  return (
    <Card className="min-h-[280px]">
      <CardHeader>
        <CardTitle>优化结果</CardTitle>
        <CardDescription>
          后续接入 Vercel AI SDK 后，这里会展示实时流式输出。
        </CardDescription>
      </CardHeader>
      <CardContent>
        {content ? (
          <div className="prose prose-slate max-w-none dark:prose-invert">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        ) : (
          <div className="flex min-h-[160px] items-center justify-center rounded-lg border border-dashed bg-muted/40 p-8 text-center text-sm text-muted-foreground">
            优化结果将在这里显示。请先输入简历和 JD，然后点击“开始优化”。
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 2: Add typography plugin dependency required by Markdown styles**

Modify `package.json` by adding `@tailwindcss/typography` to `devDependencies`:

```json
{
  "devDependencies": {
    "@tailwindcss/typography": "^0.5.13",
    "@types/node": "^20.14.10",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "autoprefixer": "^10.4.19",
    "eslint": "^8.57.0",
    "eslint-config-next": "14.2.5",
    "postcss": "^8.4.39",
    "tailwindcss": "^3.4.4",
    "typescript": "^5.5.3"
  }
}
```

Modify `tailwind.config.ts` so the `plugins` entry is exactly:

```ts
plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
```

Run:

```bash
npm install
```

Expected: command exits successfully and updates `package-lock.json`.

- [ ] **Step 3: Create dashboard page**

Create `app/dashboard/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
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

const MOCK_RESULT = `## 简历优化诊断

### 1. 总体匹配度
你的简历已经覆盖了部分岗位要求，但需要更明确地突出和 JD 相关的项目成果、技术栈和业务影响。

### 2. 建议补强的关键词
- Next.js / React / TypeScript
- AI 产品化经验
- SaaS 增长指标
- 数据驱动优化

### 3. 表达优化示例
原表达：负责前端页面开发。

建议改为：主导核心工作台页面开发，使用 Next.js 和 Tailwind CSS 搭建可复用组件体系，将关键操作路径缩短 30%。

### 4. 下一步建议
1. 将项目经历按“动作 + 技术 + 结果”重写。
2. 把 JD 中重复出现的能力要求映射到简历 bullet point。
3. 用量化结果替换笼统描述。`;

export default function DashboardPage() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState("");

  function handleOptimize() {
    setResult(MOCK_RESULT);
  }

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="container py-8">
        <Button asChild variant="ghost" className="mb-6 px-0 text-muted-foreground hover:text-foreground">
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
              <CardDescription>粘贴你的原始简历，建议包含项目经历和技能栈。</CardDescription>
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
            <Button onClick={handleOptimize} size="lg" className="w-full gap-2 lg:w-auto">
              <Wand2 className="h-4 w-4" />
              开始优化
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>目标 JD</CardTitle>
              <CardDescription>粘贴目标职位描述，便于分析关键词和能力匹配。</CardDescription>
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

        <section className="mt-6">
          <MarkdownStream content={result} />
        </section>
      </div>
    </main>
  );
}
```

- [ ] **Step 4: Verify dashboard compiles**

Run:

```bash
npm run lint
```

Expected: PASS with no ESLint errors.

- [ ] **Step 5: Verify full project build**

Run:

```bash
npm run build
```

Expected: PASS. Build output includes `/` and `/dashboard` routes.

- [ ] **Step 6: Manually verify routes in browser**

Run:

```bash
npm run dev
```

Expected: local development server starts, usually at `http://localhost:3000`.

Open `/` and verify:

- Hero Section is visible.
- “开始诊断” button navigates to `/dashboard`.

Open `/dashboard` and verify:

- Left Textarea accepts resume input.
- Right Textarea accepts JD input.
- “开始优化” button is centered between inputs on desktop and full width on narrower layouts.
- Clicking “开始优化” renders Markdown headings, lists, and numbered steps in the result Card.

- [ ] **Step 7: Review checkpoint**

Run:

```bash
git status --short
```

Expected: all planned files and `package-lock.json` are listed. Do not commit unless the user explicitly asks for commits.

---

## Self-Review

### 1. Spec coverage

- Complete Next.js 14 + TypeScript + Tailwind project foundation: Task 1.
- shadcn-style Button, Textarea, Card components: Task 2.
- Homepage Hero Section and “开始诊断” route to dashboard: Task 3.
- Dashboard with resume Textarea, JD Textarea, responsive optimize button: Task 4.
- Markdown result renderer and mock result state: Task 4.
- No API, auth, billing, persistence, or database work: enforced in Global Constraints and task scope.

### 2. Placeholder scan

No `TBD`, `TODO`, “implement later”, or ambiguous placeholder steps remain. Every code-producing step includes exact file content or exact replacement instructions.

### 3. Type consistency

- `cn()` is produced by Task 1 and consumed by Task 2.
- `Button`, `Textarea`, and `Card` exports are produced by Task 2 and consumed by Tasks 3 and 4.
- `MarkdownStream({ content }: { content?: string })` is produced and consumed in Task 4 with matching prop shape.
