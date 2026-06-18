# 开源仓库轻量配置设计

## 背景

当前项目是一个产品型开源项目：AI Resume Polish，面向求职者提供基于目标岗位 JD 的 AI 简历优化能力。仓库已经有 Next.js 14、React、TypeScript、Tailwind CSS、Vercel AI SDK 与 DeepSeek OpenAI-compatible API 相关实现和记录，但根目录尚未提供正式 `README.md`、`LICENSE`，GitHub 仓库也需要补充 description 与 topics，方便访问者快速理解项目用途。

## 目标

本次配置目标是让 GitHub 仓库以“产品型开源项目”的方式对外呈现，轻量补齐必要开源信息：

- 新增根目录 `README.md`，面向用户和开发者说明项目价值、功能、技术栈和启动方式。
- 新增根目录 `LICENSE`，采用 MIT License。
- 使用 GitHub CLI 配置仓库 description 与 topics；如果当前环境没有 `gh`，提供可直接执行的命令。
- 根据项目指令，在 `dev-md` 中记录本次开发日志。

## 非目标

本次不包含：

- `.github/ISSUE_TEMPLATE`。
- `.github/pull_request_template.md`。
- `CONTRIBUTING.md`。
- `CODE_OF_CONDUCT.md`。
- GitHub Actions CI。
- 修改页面功能、API 行为或依赖版本。

## README 设计

`README.md` 使用中文为主，保留英文项目名，结构如下：

1. 项目标题与一句话简介。
2. 核心能力：
   - 粘贴简历内容。
   - 粘贴目标岗位 JD。
   - 获取岗位匹配优化建议。
   - Markdown 格式结果展示。
3. 技术栈：
   - Next.js 14 App Router。
   - React 18。
   - TypeScript。
   - Tailwind CSS。
   - shadcn 风格 UI。
   - Vercel AI SDK。
   - DeepSeek OpenAI-compatible API。
4. 快速开始：
   - 安装依赖。
   - 配置 `.env.local`。
   - 启动开发服务。
5. 环境变量说明：
   - `DEEPSEEK_API_KEY`。
6. 项目结构概览。
7. Roadmap。
8. License。

README 不宣传尚未完成的能力为已完成能力；未完成内容放入 Roadmap。

## LICENSE 设计

新增 MIT License：

- 年份：2026。
- 作者：`ww1012`。

## GitHub 元数据设计

仓库远程地址为：

```text
https://github.com/ww1012/AI-Resume-Polish.git
```

建议 description：

```text
AI-powered resume optimization tool that tailors resumes to target job descriptions.
```

建议 topics：

```text
ai, resume, resume-builder, job-search, career, nextjs, react, typescript, tailwindcss, vercel-ai-sdk, deepseek, saas
```

如果 `gh` 可用，使用：

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

当前环境检测到 `gh` 不可用时，不阻塞本地文件配置；最终结果中明确提示用户安装 GitHub CLI 后执行上述命令，或让用户在当前会话中通过 `! gh auth login` / 安装后重试。

## 开发日志设计

根据项目指令，本次功能完成后新增或更新 `dev-md` 下的开发日志，记录：

- 新增 README。
- 新增 MIT LICENSE。
- GitHub description/topics 建议值。
- `gh` 可用性与是否已执行远程配置。

## 验证方式

完成后检查：

- `README.md` 存在，内容与当前项目实现一致。
- `LICENSE` 存在，协议为 MIT，作者为 `ww1012`。
- 开发日志已写入 `dev-md`。
- 如 `gh` 可用，验证 GitHub description/topics 已生效；如不可用，输出可执行命令。

## 自检

- 无 TBD/TODO 占位。
- 范围保持轻量配置，不包含用户未选择的 issue/PR 模板。
- README 只把已实现能力写成当前能力，把未来能力写入 Roadmap。
- GitHub CLI 不可用时有明确降级方案。
