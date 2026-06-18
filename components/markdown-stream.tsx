import ReactMarkdown from "react-markdown";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface MarkdownStreamProps {
  content?: string;
}

export function MarkdownStream({ content }: MarkdownStreamProps) {
  return (
    <Card className="min-h-[280px]">
      <CardHeader>
        <CardTitle>优化结果</CardTitle>
        <CardDescription>
          这里会实时展示 AI 返回的简历优化结果。
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
