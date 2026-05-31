---
name: spec-driven-coding
description: >
  Enforce the repository's spec-driven coding workflow for new features, behavior changes,
  and multi-step implementation work. Use this skill when starting a requirement,
  feature, refactor with behavior impact, or ambiguous coding task. It requires
  Superpowers brainstorming/spec/plan/task flow before coding, defaults plan
  execution to subagent-driven development unless blocked, and still requires TDD,
  verification, and spec updates when requirements change.
---

# Spec-Driven Coding

Use this skill to keep implementation aligned before code changes begin.

## Scope Decision

Classify the task before editing:

- **Full spec flow**: new features, behavior changes, ambiguous requirements,
  multi-step implementation, user-facing workflows, architecture changes, or
  anything likely to need design agreement.
- **Lightweight bugfix flow**: narrow bugfixes with clear expected behavior and a
  small blast radius.
- **No coding flow**: questions, read-only analysis, or review-only requests.

When uncertain, choose the full spec flow.

## Superpowers Gate

Before implementation, check whether Superpowers skills are available:

- brainstorming
- writing-plans
- subagent-driven-development
- test-driven-development
- systematic-debugging
- verification-before-completion

If Superpowers are missing and the environment supports installing them, tell the
user and ask them to install or enable Superpowers before continuing with strict
SDD. If installation is not possible, continue with the equivalent fallback steps
in this skill and state that fallback clearly.

In routing or planning output for full spec flow, explicitly mention this
Superpowers gate and list the required skills to check before implementation.

## Full Spec Flow

Do not write implementation code until the spec is aligned.

1. Use Superpowers brainstorming to explore the requirement.
2. Write the design/spec artifact required by the active workflow.
3. Get user approval for the spec.
4. Use Superpowers writing-plans to produce the implementation plan and task list.
5. Execute the plan with Superpowers subagent-driven-development by default.
6. Only then begin coding.

Keep the spec focused. If the request grows into multiple independent systems,
split it before implementation.

## Plan Execution Default

After an approved spec and implementation plan exist, default to
`superpowers:subagent-driven-development`. If `writing-plans` offers a choice
between subagent-driven and inline execution, select subagent-driven without
asking the user again when the subagent skill is available and the plan's tasks
can be dispatched independently.

Do not choose inline execution by default. Use `superpowers:executing-plans` only
when one of these is true:

- the user explicitly asks for inline execution
- subagent-driven-development is unavailable in the current environment
- the plan is so tightly coupled that fresh subagents cannot work task-by-task
  without losing essential context

If inline execution is needed for one of those reasons, state the blocker or user
preference explicitly before using it.

## Coding Flow

During implementation:

- Use TDD when behavior can be tested first.
- Add or update unit tests for changed behavior.
- Preserve or improve coverage thresholds; never lower them to pass.
- Prefer focused integration or smoke checks when unit tests cannot cover the risk.
- Keep code changes scoped to the approved spec and plan.
- If requirements change during coding, decide whether the spec must be updated
  before continuing. Update it when the change affects behavior, architecture,
  scope, user expectations, or future task routing.

## Lightweight Bugfix Flow

For simple bugfixes:

1. Use systematic debugging to reproduce and understand the failure.
2. Add a regression test first when practical.
3. Fix the smallest responsible boundary.
4. Run targeted verification.
5. Update the spec or repo memory only when the bug reveals durable behavior,
   assumptions, or constraints.

## Completion Gate

Before claiming the work is done:

- run verification-before-completion when available
- run relevant tests, typecheck, lint, build, or coverage commands
- run repo-memory when the work changed durable context
- hand off to git-delivery when the user wants to ship

## Output

Report:

- which flow was used
- spec/plan artifacts created or updated
- plan execution mode: subagent-driven by default, or the explicit inline
  fallback reason
- tests added or skipped with reason
- verification commands and results
- whether repo memory or spec updates were needed after coding
