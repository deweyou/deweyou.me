---
id: daily-share-2026-07-20-session-scope-second-key
title: Session Scope 要成为第二主键
type: daily-share
tags: [AI]
date: 2026-07-20
source_path: "/Users/deweyou/Library/Mobile Documents/iCloud~md~obsidian/Documents/Dewey Ou/学习/每日分享/AI/2026-07-20 - Session Scope 要成为第二主键.md"
sources:
  - https://github.com/mastra-ai/mastra/releases/tag/%40mastra/core%401.51.0
  - https://github.com/mastra-ai/mastra/pull/19357
---

Agent 的 session identity 不能只靠 userId、repoId 或 threadId；当同一个资源上允许多个 agent 并行工作时，scope 应该成为和 resourceId 并列的第二主键。否则“恢复同一个会话”和“隔离一条新执行线”会被混成一个动作。

Mastra 1.51.0 的 scoped AgentController session 很能说明这个边界：过去 createSession/getSession 主要围绕 resourceId 做 get-or-create；在 Git worktree 场景里，同一个 GitHub project 下开两个 worktree，第二个 agent run 会复用同一 server-side session，导致 workspace 被重指向、stream 被打断、thread/state/model/mode 互相污染。新的 scope / sessionScope 把会话身份扩成 resourceId + scope，例如同一个 repo 下的 /worktrees/feature-a 和 /worktrees/feature-b 是两个独立 session；同一个 pair 才 resume。

这不只是 coding agent UI 的问题，而是 OPC 类平台的通用建模问题。客户、仓库、工单、浏览器 profile、Telegram topic 这些 resourceId 往往表达“业务对象”，但 agent 的执行隔离还需要表达“工作线”：一个审批分支、一个修复尝试、一个租户连接桶、一个 sandbox/worktree。把 scope 当成可选字符串随手拼在 metadata 里，后面会在锁、恢复、审计、权限、进度展示和取消语义上反复露馅。

一个实用设计是：resourceId 决定数据亲缘性和权限边界，scope 决定并行运行域；runId 是一次执行，threadId 是上下文轨迹，sandboxId / worktreePath 是资源占用。scope 应该进入 session lookup、lease key、stream resume、activity indicator、tool connection resolution 和 trace attributes，而不只进入前端路由。

如果你今天要给 OPC 的 Agent runtime 加“同一客户/同一任务下并行试三条路径”，你会把哪一个字段设计成稳定 scope：用户显式命名、系统生成的 branch id，还是底层 workspace/worktree path？
