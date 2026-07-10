---
id: daily-share-2026-07-10-mcp-elicitation-handler-declaration
title: MCP Elicitation能力要按处理器声明
type: daily-share
tags: [AI]
date: 2026-07-10
topic: MCP Elicitation能力要按处理器声明
source_path: "/Users/deweyou/Library/Mobile Documents/iCloud~md~obsidian/Documents/Dewey Ou/学习/每日分享/AI/2026-07-10 - MCP Elicitation能力要按处理器声明.md"
sources:
  - https://github.com/cloudflare/agents/pull/1903
  - https://github.com/cloudflare/agents/pull/1910
  - https://github.com/cloudflare/agents/pull/1911
  - https://raw.githubusercontent.com/modelcontextprotocol/modelcontextprotocol/main/docs/specification/draft/client/elicitation.mdx
---
MCP 的 Elicitation 不只是“server 可以向用户追问信息”，更关键的是：client 只有在真的能把这个追问安全地呈现给用户、收集决定并回传结果时，才应该在 initialize 阶段声明这项能力。Cloudflare Agents 7 月 9 日连续合并的 MCP elicitation PR，把一个很容易被忽略的协议细节讲清楚了：能力声明不是愿望清单，而是运行时承诺。

Elicitation 有两条路径：form mode 让 server 请求结构化字段，url mode 让用户跳到外部域名完成敏感交互。这里的工程坑在于，如果 client 没有 UI / out-of-band 通道 / 审批逻辑，却仍然广告 `elicitation: {}`，符合规范的 server 会相信 client 能处理，于是放弃自己的 fallback，真正请求到来时中途失败。Cloudflare 的修复从“默认硬编码声明 elicitation”改成“有 handler 才声明；form 和 url 分别按已配置 handler 声明；没有 handler 就不声明，让 server 走非 elicitation fallback”。

对 Agent Engineer 来说，这和 tool approval、OAuth callback、human-in-the-loop 是同一类问题：协议能力必须绑定到可恢复的处理器，而不是绑定到一次性的函数参数或 prompt 约定。Cloudflare 最初考虑 Agent class method，是因为 Durable Object hibernation 之后函数 option 可能丢失；后续又把处理器挪到 MCP client manager，用 `configureElicitationHandler` 像 OAuth callback 一样在启动时注册。这说明 OPC 如果要接第三方 MCP server，不能只做“能不能连上工具”的 checklist，还要检查每个 negotiated capability 是否有跨重启、跨租户、跨话题的真实处理链路。

一个实用判断标准是：凡是 server 会因此改变行为的 capability，都应该有反向测试——声明时真的能处理，不声明时 server 能 fallback，恢复后声明仍然和 handler 一致。否则“看起来更强”的 capability advertisement，反而会把用户交互、敏感跳转和工具调用变成更隐蔽的半路失败。

如果我们给 OPC 设计 MCP client capability registry，哪些能力应该默认关闭，只有在 UI、权限、审计和恢复路径都就绪后才允许打开？
