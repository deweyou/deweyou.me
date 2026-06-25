---
id: daily-share-2026-06-25-harness-session-runtime
title: "Harness 退为工厂，Session 成为运行时主体"
date: 2026-06-25
type: daily-share
tags: [AI]
topic: "Harness 退为工厂，Session 成为运行时主体"
source: "Mastra @mastra/core@1.46.0"
source_path: "/Users/deweyou/Library/Mobile Documents/iCloud~md~obsidian/Documents/Dewey Ou/学习/每日分享/AI/2026-06-25 - Harness 退为工厂 Session 成为运行时主体.md"
---
Mastra 1.46.0（2026年6月24日发布）把 Harness 从一个带状态的运行时彻底重构成了纯工厂：createSession() 返回的 Session 才是真正的 identity、state、event bus、权限和 run control 的载体。这不是增量重构——Harness 上原有的 sendMessage、abort、model.switch、subscribe、OM accessor 和 thread lifecycle 全被删除，强制迁移到 session.* 命名空间。如果你之前写 harness.sendMessage()，升级后直接编译失败，必须改成 harness.createSession(resourceId).sendMessage()。设计意图很清楚：把"单例假象"从 API 表面彻底剥离。

工程意义有几个层次。第一层是隔离性：两个 concurrent user 通过同一个 Harness 创建不同 Session，它们的 event subscriber 互不干扰（session.subscribe 返回的是 session-scoped 的 event emitter），state 读写不会交叉，permissions 各自生效。这意味着底层不再需要在 Harness 层做锁或 routing，Session 本身就是 fault boundary。第二层是跨进程：配套的 LeaseProvider（内存/Redis Streams 两种实现）保证多实例部署中只有一台 worker 拥有某个 thread run 的租约，信号投递时 LeaseProvider 返回一个 discriminated routing decision（wake/deliver/persist/discard），避免双发或丢消息。第三层是投影到 HTTP 协议：Mastra 新加了 harness-scoped 的 server routes，客户端可以通过 GET /harness/:id/session/:resourceId/sendMessage 远程控制远端 Session，JS client 也有一等公民的 client.getHarness(id).session(resourceId) API。

一个值得注意的取舍是：createSession 不是 spawn，而是 get-or-create by resourceId。同一个 resourceId 返回同一个 Session——这意味着 caller 必须自己保证 resourceId 的全局唯一性。在多租户场景下，resourceId 的设计（比如 userId:threadId 的复合键、还是 UUID、还是业务自然键）直接影响并发控制和数据亲缘性，Mastra 把这个问题交给上层而不做内置约束。另一个隐含代价是 session 级事件总线挂掉的隔离：每个 Session 持有一个独立 EventEmitter，订阅者和 listener 数量会随 session 数线性增长，大租户场景下需要关注 listener 泄漏和 backpressure 治理。

如果你的 Agent 平台已经或计划支持多用户并发，一个值得立即检查的问题是：你的"Harness"层现在持有和用户会话耦合的状态吗？如果 state、event bus、permissions 还挂在全局 factory 上而不是每次 interaction 的开始就获得一个隔离的 Session 句柄，1.46 的这个重构给出了一个可复用的模式——把 factory 做薄到只负责资源创建和共享基础设施（agent 定义、模型注册），把一切可变状态放进按 resourceId 隔离的 Session。
