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
