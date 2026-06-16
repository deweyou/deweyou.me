---
id: ai-share-2026-05-21
title: "Prefill 和 Decode 是两种计算"
date: 2026-05-21
type: daily-share
tags: [AI]
source_path: "/Users/deweyou/Library/Mobile Documents/iCloud~md~obsidian/Documents/Dewey Ou/学习/每日分享/AI/2026-05-21 - Prefill 和 Decode 是两种计算.md"
---

LLM 推理的 prefill 和 decode 计算模式完全不同，混为一谈会导致延迟估算与容量规划出错。

一次推理分两阶段——prefill 一次性并行处理全部输入 token，算力密集；decode 逐个生成 token，每次只处理一个新 token 却要反复读整个 KV cache，变成内存带宽瓶颈。

理解了就能解释：长 prompt 为什么 prefill 慢、高并发时为什么 decode 先崩、FlashAttention（加速 prefill）和推测解码（加速 decode）为什么解决不同问题。

4K 输入请求，prefill 占 1-2 秒，之后每个 token 只需几十毫秒。但 50 个并发用户同时在 decode，显存带宽被多份 KV cache 的反复读取塞满，每个用户都会变慢。

别用「总延迟 = token 数 × 单 token 耗时」估算——prefill 和 decode 每 token 成本差数十倍。增大 batch size 对 prefill 近乎免费，对 decode 线性增加 KV cache 占用。

如果把 **Prefill 和 Decode 是两种计算** 当成检查题，你的系统里哪一段还只是靠默认假设在运转，而没有被设计成可观测、可验证、可回退的工程机制？
