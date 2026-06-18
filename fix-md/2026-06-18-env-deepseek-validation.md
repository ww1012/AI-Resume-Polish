# 修复日志：环境变量与 DeepSeek 配置有效性验证

**日期**：2026-06-18  
**类型**：配置验证 / 运行时问题定位  
**影响范围**：`/api/optimize` 简历优化接口、`.env.local` 环境变量配置

## 背景

本次检查目标是确认当前项目配置和环境变量是否有效，重点验证 AI 调用相关配置能否支撑 `/api/optimize` 接口正常工作。

项目当前接口实现位于：

- `app/api/optimize/route.ts`

接口使用 Vercel AI SDK 的 OpenAI 兼容适配器连接 DeepSeek：

- `@ai-sdk/openai`
- `ai`
- DeepSeek OpenAI-compatible endpoint

## 验证过程

### 1. 检查项目环境变量使用情况

代码实际读取的环境变量为：

```ts
process.env.DEEPSEEK_API_KEY
```

对应位置：

- `app/api/optimize/route.ts:53`

代码中目前写死了 DeepSeek 请求配置：

```ts
baseURL: "https://api.deepseek.com/v1"
model: deepseek("deepseek-chat")
```

对应位置：

- `app/api/optimize/route.ts:87-93`

因此，当前实际生效的环境变量只有：

```env
DEEPSEEK_API_KEY
```

`.env.local` 中的以下变量目前不会被代码读取：

```env
DEEPSEEK_BASE_URL
DEEPSEEK_MODEL_ID
```

### 2. 检查 `.env.local` 是否被 Next.js 加载

启动开发服务后，Next.js 输出：

```text
Local: http://localhost:3002
Environments: .env.local
```

结论：`.env.local` 已被 Next.js 成功识别和加载。

### 3. 通过项目接口进行真实调用验证

请求 `/api/optimize` 后，接口返回：

```text
STATUS 200
CONTENT_TYPE text/plain; charset=utf-8
BODY:
3:"An error occurred."
```

该结果说明：接口链路进入了 AI SDK 的流式响应流程，但底层模型调用发生错误，被包装成通用错误信息。

### 4. 直接调用 DeepSeek 最小请求定位原因

使用 `.env.local` 中的 `DEEPSEEK_API_KEY`，直接请求 DeepSeek OpenAI-compatible `/chat/completions` 接口，返回：

```json
{
  "error": {
    "message": "Insufficient Balance",
    "type": "unknown_error",
    "param": null,
    "code": "invalid_request_error"
  }
}
```

HTTP 状态码：

```text
402
```

结论：当前 API Key 能被读取，但 DeepSeek 账户余额不足，导致真实模型调用失败。

## 问题结论

本次验证发现 3 个配置层面的结论：

1. **`.env.local` 加载有效**  
   Next.js 已成功加载 `.env.local`。

2. **`DEEPSEEK_API_KEY` 存在，但账户不可用**  
   当前密钥不是缺失问题，而是 DeepSeek 返回 `Insufficient Balance`，需要充值或更换可用 Key。

3. **部分环境变量未被代码使用**  
   当前代码没有读取 `DEEPSEEK_BASE_URL` 和 `DEEPSEEK_MODEL_ID`，即使这两个变量写在 `.env.local` 中，也不会影响实际请求。

另外，检查过程中发现 `DEEPSEEK_MODEL_ID` 当前值疑似格式异常，值前面存在多余的 `=`，需要修正。

## 建议修复方案

### 方案一：恢复当前接口可用性

优先处理 DeepSeek 账户余额问题：

- 为当前 DeepSeek 账户充值；或
- 更换一个有余额、权限正常的 `DEEPSEEK_API_KEY`。

这是当前 `/api/optimize` 能否真实工作的首要阻塞点。

### 方案二：让 `.env.local` 中的模型配置真正生效

如果希望通过环境变量控制 DeepSeek base URL 和模型 ID，建议后续将接口改为：

```ts
const apiKey = process.env.DEEPSEEK_API_KEY;
const baseURL = process.env.DEEPSEEK_BASE_URL ?? "https://api.deepseek.com/v1";
const modelId = process.env.DEEPSEEK_MODEL_ID ?? "deepseek-chat";
```

并在创建模型时使用：

```ts
const deepseek = createOpenAI({
  baseURL,
  apiKey,
});

const result = streamText({
  model: deepseek(modelId),
  ...
});
```

### 方案三：修正示例环境变量

建议扩展 `.env.local.example`，明确列出项目支持的配置项：

```env
DEEPSEEK_API_KEY=your_deepseek_api_key_here
DEEPSEEK_BASE_URL=https://api.deepseek.com/v1
DEEPSEEK_MODEL_ID=deepseek-chat
```

同时注意不要提交真实 `.env.local`，当前 `.gitignore` 已包含：

```gitignore
.env*.local
```

## 当前状态

- 环境变量文件加载：已验证，通过。
- API Key 存在性：已验证，通过。
- DeepSeek 真实调用：已验证，失败。
- 失败原因：DeepSeek 账户余额不足。
- 是否暴露真实密钥：否，本日志未记录任何真实密钥内容。

## 后续建议

1. 充值或更换 DeepSeek API Key 后，重新调用 `/api/optimize` 做一次端到端验证。
2. 后续可单独做一次小修复，让 `DEEPSEEK_BASE_URL` 和 `DEEPSEEK_MODEL_ID` 从环境变量读取，避免配置写了但不生效。
3. 可增强 `/api/optimize` 的错误处理，将 DeepSeek 返回的错误类型转成更明确的服务端日志或前端提示，避免用户只看到 `An error occurred.`。
