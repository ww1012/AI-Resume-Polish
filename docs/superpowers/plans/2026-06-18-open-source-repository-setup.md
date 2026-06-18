# Open Source Repository Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Configure the repository as a lightweight product-focused open source project with README, MIT License, GitHub metadata guidance, and a development log.

**Architecture:** This is a documentation and repository metadata change only. Local repository files communicate project value and usage; GitHub CLI metadata is applied remotely when `gh` is available, with a copy-paste fallback command when it is not.

**Tech Stack:** Markdown, MIT License text, GitHub CLI (`gh`), existing Next.js 14 / React / TypeScript / Tailwind CSS / Vercel AI SDK / DeepSeek project context.

## Global Constraints

- Repository positioning: product-focused open source project for AI resume optimization.
- README language: Chinese-first, keep the English project name.
- License: MIT License, year `2026`, author `ww1012`.
- GitHub description: `AI-powered resume optimization tool that tailors resumes to target job descriptions.`
- GitHub topics: `ai`, `resume`, `resume-builder`, `job-search`, `career`, `nextjs`, `react`, `typescript`, `tailwindcss`, `vercel-ai-sdk`, `deepseek`, `saas`.
- Scope excludes `.github/ISSUE_TEMPLATE`, `.github/pull_request_template.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, GitHub Actions CI, page/API behavior changes, and dependency changes.
- Project instruction: every completed feature must be documented in `C:\Users\86133\Desktop\AI-Resume-Polish\dev-md`.

---

## File Structure

- Create `README.md`: public-facing product README with overview, features, stack, quick start, environment variables, structure, roadmap, and license.
- Create `LICENSE`: MIT License text for `ww1012`.
- Create `dev-md/2026-06-18-open-source-repository-setup.md`: development log for this repository setup feature.
- Remote GitHub metadata: apply through `gh repo edit ww1012/AI-Resume-Polish` when available; otherwise report the exact command for the user to run after installing GitHub CLI.

---

### Task 1: Add Product README

**Files:**
- Create: `README.md`

**Interfaces:**
- Consumes: Existing project facts from `package.json`, `dev-md/03-development-log.md`, and `fix-md/2026-06-18-env-deepseek-validation.md`.
- Produces: Root `README.md` for GitHub visitors and later metadata/log tasks.

- [ ] **Step 1: Create `README.md`**

Write this exact content to `README.md`:

```markdown
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
```

- [ ] **Step 2: Verify README exists and mentions key project facts**

Run:

```bash
python - <<'PY'
from pathlib import Path
text = Path('README.md').read_text(encoding='utf-8')
required = [
    '# AI Resume Polish',
    'AI 简历优化工具',
    'Next.js 14',
    'Vercel AI SDK',
    'DeepSeek',
    'DEEPSEEK_API_KEY',
    'MIT License',
]
missing = [item for item in required if item not in text]
if missing:
    raise SystemExit(f'Missing README content: {missing}')
print('README verification passed')
PY
```

Expected output:

```text
README verification passed
```

- [ ] **Step 3: Commit README**

```bash
git add README.md
git commit -m "docs: add product README"
```

---

### Task 2: Add MIT License

**Files:**
- Create: `LICENSE`

**Interfaces:**
- Consumes: Global constraint `License: MIT License, year 2026, author ww1012`.
- Produces: Root `LICENSE` referenced by `README.md`.

- [ ] **Step 1: Create `LICENSE`**

Write this exact content to `LICENSE`:

```text
MIT License

Copyright (c) 2026 ww1012

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

- [ ] **Step 2: Verify LICENSE content**

Run:

```bash
python - <<'PY'
from pathlib import Path
text = Path('LICENSE').read_text(encoding='utf-8')
required = ['MIT License', 'Copyright (c) 2026 ww1012', 'THE SOFTWARE IS PROVIDED "AS IS"']
missing = [item for item in required if item not in text]
if missing:
    raise SystemExit(f'Missing LICENSE content: {missing}')
print('LICENSE verification passed')
PY
```

Expected output:

```text
LICENSE verification passed
```

- [ ] **Step 3: Commit LICENSE**

```bash
git add LICENSE
git commit -m "docs: add MIT license"
```

---

### Task 3: Configure or Report GitHub Metadata Command

**Files:**
- No local file changes in this task.

**Interfaces:**
- Consumes: Remote repository `ww1012/AI-Resume-Polish`, GitHub CLI availability, approved description/topics.
- Produces: Either updated GitHub repository metadata or a verified command for the user to run.

- [ ] **Step 1: Check GitHub CLI availability**

Run:

```bash
command -v gh && gh --version
```

Expected output if available:

```text
/path/to/gh
gh version ...
```

Expected output if unavailable:

```text
```

with non-zero exit status.

- [ ] **Step 2: Apply metadata if `gh` is available**

Run this only if Step 1 found `gh`:

```bash
gh repo edit ww1012/AI-Resume-Polish \
  --description "AI-powered resume optimization tool that tailors resumes to target job descriptions." \
  --add-topic ai \
  --add-topic resume \
  --add-topic resume-builder \
  --add-topic job-search \
  --add-topic career \
  --add-topic nextjs \
  --add-topic react \
  --add-topic typescript \
  --add-topic tailwindcss \
  --add-topic vercel-ai-sdk \
  --add-topic deepseek \
  --add-topic saas
```

Expected output:

```text
```

`gh repo edit` normally succeeds with no output.

- [ ] **Step 3: Verify metadata if `gh` is available**

Run this only if Step 2 ran:

```bash
gh repo view ww1012/AI-Resume-Polish --json description,repositoryTopics --jq '{description, topics: [.repositoryTopics[].name]}'
```

Expected output includes:

```json
{
  "description": "AI-powered resume optimization tool that tailors resumes to target job descriptions.",
  "topics": [
    "ai",
    "resume",
    "resume-builder",
    "job-search",
    "career",
    "nextjs",
    "react",
    "typescript",
    "tailwindcss",
    "vercel-ai-sdk",
    "deepseek",
    "saas"
  ]
}
```

- [ ] **Step 4: Record fallback command if `gh` is unavailable**

If Step 1 fails, include this exact command in the final response and development log:

```bash
gh repo edit ww1012/AI-Resume-Polish \
  --description "AI-powered resume optimization tool that tailors resumes to target job descriptions." \
  --add-topic ai \
  --add-topic resume \
  --add-topic resume-builder \
  --add-topic job-search \
  --add-topic career \
  --add-topic nextjs \
  --add-topic react \
  --add-topic typescript \
  --add-topic tailwindcss \
  --add-topic vercel-ai-sdk \
  --add-topic deepseek \
  --add-topic saas
```

- [ ] **Step 5: Commit if no files changed**

No commit is required for remote-only metadata. If `gh` is unavailable, no commit is required in this task because the fallback command is documented in Task 4.

---

### Task 4: Add Development Log

**Files:**
- Create: `dev-md/2026-06-18-open-source-repository-setup.md`

**Interfaces:**
- Consumes: Results from Tasks 1-3.
- Produces: Required project development log for the completed repository setup feature.

- [ ] **Step 1: Create development log**

Write this exact content if `gh` was unavailable:

```markdown
# 开发日志：开源仓库轻量配置

**日期**：2026-06-18  
**类型**：仓库文档 / 开源配置  
**影响范围**：`README.md`、`LICENSE`、GitHub 仓库元数据建议

## 背景

本次配置目标是将 AI Resume Polish 以产品型开源项目的方式对外呈现，让访问 GitHub 仓库的用户能够快速理解项目价值、技术栈、启动方式和开源协议。

## 完成内容

### 1. 新增 README

新增根目录 `README.md`，内容包含：

- 项目简介。
- 功能特性。
- 技术栈。
- 快速开始。
- 环境变量 `DEEPSEEK_API_KEY`。
- 常用脚本。
- 项目结构。
- Roadmap。
- License。

README 使用中文为主，保留英文项目名，定位为产品型开源项目。

### 2. 新增 MIT License

新增根目录 `LICENSE`，采用 MIT License：

- 年份：2026。
- 作者：ww1012。

### 3. GitHub 仓库元数据建议

建议 GitHub description：

```text
AI-powered resume optimization tool that tailors resumes to target job descriptions.
```

建议 GitHub topics：

```text
ai, resume, resume-builder, job-search, career, nextjs, react, typescript, tailwindcss, vercel-ai-sdk, deepseek, saas
```

当前环境未检测到 GitHub CLI：

```text
gh: command not found
```

因此远程仓库元数据尚未在本次会话中自动写入。安装并登录 GitHub CLI 后，可以执行：

```bash
gh repo edit ww1012/AI-Resume-Polish \
  --description "AI-powered resume optimization tool that tailors resumes to target job descriptions." \
  --add-topic ai \
  --add-topic resume \
  --add-topic resume-builder \
  --add-topic job-search \
  --add-topic career \
  --add-topic nextjs \
  --add-topic react \
  --add-topic typescript \
  --add-topic tailwindcss \
  --add-topic vercel-ai-sdk \
  --add-topic deepseek \
  --add-topic saas
```

## 验证结果

- `README.md` 已包含项目定位、功能、技术栈、启动方式和 License 说明。
- `LICENSE` 已使用 MIT License。
- GitHub CLI 当前不可用，远程元数据配置提供了可执行命令作为降级方案。
```

If `gh` was available and metadata was successfully applied, write this exact content instead:

```markdown
# 开发日志：开源仓库轻量配置

**日期**：2026-06-18  
**类型**：仓库文档 / 开源配置  
**影响范围**：`README.md`、`LICENSE`、GitHub 仓库元数据

## 背景

本次配置目标是将 AI Resume Polish 以产品型开源项目的方式对外呈现，让访问 GitHub 仓库的用户能够快速理解项目价值、技术栈、启动方式和开源协议。

## 完成内容

### 1. 新增 README

新增根目录 `README.md`，内容包含：

- 项目简介。
- 功能特性。
- 技术栈。
- 快速开始。
- 环境变量 `DEEPSEEK_API_KEY`。
- 常用脚本。
- 项目结构。
- Roadmap。
- License。

README 使用中文为主，保留英文项目名，定位为产品型开源项目。

### 2. 新增 MIT License

新增根目录 `LICENSE`，采用 MIT License：

- 年份：2026。
- 作者：ww1012。

### 3. 配置 GitHub 仓库元数据

已通过 GitHub CLI 配置 description：

```text
AI-powered resume optimization tool that tailors resumes to target job descriptions.
```

已配置 topics：

```text
ai, resume, resume-builder, job-search, career, nextjs, react, typescript, tailwindcss, vercel-ai-sdk, deepseek, saas
```

## 验证结果

- `README.md` 已包含项目定位、功能、技术栈、启动方式和 License 说明。
- `LICENSE` 已使用 MIT License。
- GitHub description/topics 已通过 `gh repo view` 验证。
```

- [ ] **Step 2: Verify development log exists and includes GitHub metadata**

Run:

```bash
python - <<'PY'
from pathlib import Path
path = Path('dev-md/2026-06-18-open-source-repository-setup.md')
text = path.read_text(encoding='utf-8')
required = [
    '开源仓库轻量配置',
    'README.md',
    'LICENSE',
    'AI-powered resume optimization tool that tailors resumes to target job descriptions.',
    'vercel-ai-sdk',
    'deepseek',
]
missing = [item for item in required if item not in text]
if missing:
    raise SystemExit(f'Missing development log content: {missing}')
print('development log verification passed')
PY
```

Expected output:

```text
development log verification passed
```

- [ ] **Step 3: Commit development log**

```bash
git add dev-md/2026-06-18-open-source-repository-setup.md
git commit -m "docs: record repository setup log"
```

---

### Task 5: Final Verification

**Files:**
- Read/verify only: `README.md`, `LICENSE`, `dev-md/2026-06-18-open-source-repository-setup.md`

**Interfaces:**
- Consumes: Deliverables from Tasks 1-4.
- Produces: Final status summary for the user.

- [ ] **Step 1: Run combined local verification**

```bash
python - <<'PY'
from pathlib import Path
checks = {
    'README.md': ['# AI Resume Polish', 'DEEPSEEK_API_KEY', 'MIT License'],
    'LICENSE': ['MIT License', 'Copyright (c) 2026 ww1012'],
    'dev-md/2026-06-18-open-source-repository-setup.md': ['开源仓库轻量配置', 'GitHub', 'topics'],
}
for file, required in checks.items():
    text = Path(file).read_text(encoding='utf-8')
    missing = [item for item in required if item not in text]
    if missing:
        raise SystemExit(f'{file} missing {missing}')
print('local repository setup verification passed')
PY
```

Expected output:

```text
local repository setup verification passed
```

- [ ] **Step 2: Check git status**

```bash
git status --short
```

Expected output if every task committed separately:

```text
```

If the plan document or spec document remains uncommitted because the user did not request commits, report the exact uncommitted files instead of hiding them.

- [ ] **Step 3: Report outcome**

Final response must include:

```markdown
完成：
- 已新增 `README.md`。
- 已新增 `LICENSE`（MIT）。
- 已新增开发日志 `dev-md/2026-06-18-open-source-repository-setup.md`。

GitHub CLI：
- 如果已执行：说明 description/topics 已配置并验证。
- 如果未执行：说明当前环境没有 `gh`，并给出可复制的 `gh repo edit` 命令。

验证：
- `local repository setup verification passed`
- Git 工作区状态。
```

---

## Self-Review

- Spec coverage: README, MIT License, GitHub description/topics, `gh` fallback, and `dev-md` development log are each covered by a task.
- Placeholder scan: the plan contains no TBD/TODO placeholders and no vague implementation steps.
- Type consistency: this plan is documentation/CLI focused and defines no code interfaces; file paths and metadata values match the approved spec.
