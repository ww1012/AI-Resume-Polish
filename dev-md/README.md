# AI Resume Polish 开发文档

本目录沉淀当前 AI 简历优化 SaaS 的开发上下文，便于后续继续接入 API、完善产品功能和协作开发。

## 文档索引

- [开发日志](./03-development-log.md)

## 当前状态

当前版本是一个可运行的前端基础骨架：

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- shadcn 风格基础组件
- 首页 Hero Section
- Dashboard 简历/JD 输入工作台
- Markdown 优化结果展示区
- 暂不连接真实 API，使用本地 mock 结果

## 常用命令

```bash
npm install
npm run dev
npm run lint
npm run build
```

本轮已验证：

- `npm run lint` 通过
- `npm run build` 通过
