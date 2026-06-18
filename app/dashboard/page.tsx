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
