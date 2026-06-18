import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";

interface OptimizeRequestBody {
  resume?: string;
  jobDescription?: string;
}

function isOptimizeRequestBody(value: unknown): value is OptimizeRequestBody {
  if (!value || typeof value !== "object") {
    return false;
  }

  const body = value as Record<string, unknown>;

  return (
    (body.resume === undefined || typeof body.resume === "string") &&
    (body.jobDescription === undefined || typeof body.jobDescription === "string")
  );
}

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
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    return Response.json(
      { error: "Missing DEEPSEEK_API_KEY environment variable." },
      { status: 500 },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "请求体必须是有效的 JSON。" }, { status: 400 });
  }

  if (!isOptimizeRequestBody(body)) {
    return Response.json(
      { error: "请求体格式错误，resume 和 jobDescription 必须是字符串。" },
      { status: 400 },
    );
  }

  const resume = body.resume?.trim() ?? "";
  const jobDescription = body.jobDescription?.trim() ?? "";

  if (!resume && !jobDescription) {
    return Response.json(
      { error: "请先输入简历内容或目标 JD。" },
      { status: 400 },
    );
  }

  const deepseek = createOpenAI({
    baseURL: "https://api.deepseek.com/v1",
    apiKey,
  });

  const result = streamText({
    model: deepseek("deepseek-chat"),
    system: buildSystemPrompt(resume, jobDescription),
    prompt: "请根据 System Prompt 中的简历和 JD，返回严格 JSON 格式的优化结果。",
    temperature: 0.2,
  });

  return result.toDataStreamResponse();
}
