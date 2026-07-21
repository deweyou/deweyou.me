---
id: daily-share-2026-07-21-crash-recovery-protocol
title: 可恢复运行的 Crash Recovery 协议
type: daily-share
tags: [AI]
date: 2026-07-21
source_path: "/Users/deweyou/Library/Mobile Documents/iCloud~md~obsidian/Documents/Dewey Ou/学习/每日分享/AI/2026-07-21 - 可恢复运行的 Crash Recovery 协议.md"
---

Agent runtime 的持久化不能只做到「运行中写 checkpoint」，还要能做到「重启后主动发现并恢复所有本该运行中的循环」。否则一个 deploy、一次 OOM、一个 kill，所有 in-flight agent 会永远卡在 RUNNING 状态里，用户看不到错误、也等不到下一个响应。

Mastra 1.51.0 的 Durable Agent Crash Recovery 把这从隐式保障变成了显式协议。核心管道是 discover → recover → stream：`DurableAgent.listActiveRuns()`从持久化存储（默认 Postgres/libSQL）枚举所有标记为 RUNNING 的快照行；`recover(runId)`把非序列化状态（MessageList、model 实例、tools、memory、SaveQueueManager、processors、request context、agent span、BackgroundTaskManager）从 worklow snapshot 重建，重新订阅 pubsub topic，重新驱动 agentic loop，最后返回和 `stream()` / `resume()` 完全一致的 `{ output, fullStream, runId }` 形状。HTTP 层暴露 `POST /agents/:agentId/recover`，client-js 暴露 `agent.recover({ runId })`，响应以 SSE 流式输出剩余响应。

几个值得关注的工程决策。第一，snapshot 写入有 guard：running 快照不会覆盖同一 run 的 suspended 快照，这样 suspend→crash→restart 后优先恢复 suspended 而非 running。第二，background task 重连机制：recovery 发现 `BackgroundTaskManager` 中有一个与前 crash 同 id 的 running task 时，不走 dispatch duplicate 而走 `restart()`，避免已交付出结果的工具重复执行。第三，auto-recovery 默认关闭：因为 recover 会重新发 LLM 调用（实打实的 token 成本）并重跑工具调用（必须幂等），多实例部署时不做 lease/lock 前所有副本会同时恢复同一批 run。

这对 OPC 类平台的启发不止是「启动时扫一遍 running」。Crash recovery 应该建模为一个可编排的协议阶段：discovery 接入口（storage query + filter）、recovery 路由（per-agent / per-run / bulk）、流式输出投影（client reattach）、中间状态封口（running → recovered / failed / tombstone）、幂等保护（lease / dedup key / budget）。把 crash 从运维事件变成运行时契约，才能在 deploy、扩容、缩容、故障切换时不丢用户正在等的响应。

如果你的 Agent 平台今天重启了，怎么知道哪些工作线还没完成、该接上哪一步继续跑？listActiveRuns 这种问题在 crash 之前就该想清楚。
