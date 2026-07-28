---
id: daily-share-2026-07-28-mcp-sdk-v2-stateless-discovery
title: MCP SDK v2落地：server/discover探针与stateless双协议自动协商
date: 2026-07-28
type: daily-share
tags: [AI]
source_path: "/Users/deweyou/Library/Mobile Documents/iCloud~md~obsidian/Documents/Dewey Ou/学习/每日分享/AI/2026-07-28 - MCP SDK v2落地：server/discover探针与stateless双协议自动协商.md"
---
MCP 从 sessionful（2025-11-25 稳定版）走向 stateless（2026-07-28 RC）不再只是 spec 层面的方向——昨天 MCP TypeScript SDK v2.0.0 beta 和 Cloudflare Agents 0.20.0 同日落地了实际工程实现，且 McpAgent 被正式标记为 deprecated。

核心机制是 `server/discover` 探针。client 连接后先发一条 `server/discover` 请求问 server "你支持 stateless 吗？"——如果 server 回复 discovery 数据，就走 stateless 路径，request 自描述、不依赖连接生命周期；如果 server 不认识这条消息或返回错误，client 在同一 TCP 连接上自动 fallback 到 legacy `initialize` handshake。不需要额外配置、不需要双端口、不需要版本协商逻辑。

McpAgent（Cloudflare 的 sessionful 实现）被标记为 deprecated 和 feature-frozen。新 server 的标准入口变为 `agents/mcp/server` 的 `createMcpHandler`，它基于 SDK v2 的 web-standard transport，不依赖 WorkerTransport、McpAgent、RPC 或多 agent 运行时——MCP-only 的应用不再需要安装 Codemode。保留的 v1 兼容层 `createLegacyMcpHandler` 也被降格为显式迁移桥。

SDK v2 的 OAuth 行为也随之变化：OAuth reauthorization 会丢弃 redirect-scoped discovery 数据并在 token 发出后重新发现，防止复用旧 issuer 的凭据。Stored HTTP session IDs 来自旧 Agents 版本的连接会被 discarding 并重新连接，不会 unsafe 地 resume 一个 upstream 已经不认识的会话。

对 OPC 类平台的启示：如果你在设计 Agent 平台的 MCP 接入层，现在有了一个经过生产验证的 probe+fallback 模式可以抄。stateless 意味着 server 不能依赖连接级别的隐式状态——request 必须携带完整的 resource handle、scope 和 auth info——这对多租户、serverless 部署和水平扩展有直接影响。deprecation 信号值得跟踪：当 Cloudflare 的主力 MCP 实现都转向 stateless 时，你的新服务从哪里开始拆 session？

你的 MCP server 今天是有状态的还是无状态的？切换到 stateless 后，当前的 auth session token、resource handle 和工具执行假设中有哪些会在第一轮 `server/discover` 后失效？
