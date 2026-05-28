---
name: repo-memory
description: >
  Repository memory workflow for durable project knowledge. Use before commits
  or PRs, after meaningful code or workflow changes, when initializing or
  updating AGENTS.md/docs/DESIGN.md/CLAUDE.md, or when local skills, design
  contracts, and repo conventions may need knowledge updates.
---

# Repo Memory

Maintain repository memory: the durable context future humans and AI agents need
to act safely without rediscovering intent, constraints, boundaries, and recurring
pitfalls.

This skill is usually a pre-commit guard. It decides whether the current work
changed anything worth remembering, updates the repository memory when needed,
and leaves the workspace ready for delivery.

For repositories with UI surfaces, repository memory also covers durable design
style: visual principles, tokens, component conventions, interaction patterns,
and brand/interface constraints future agents must preserve.

Before writing knowledge docs, read [`rule.md`](rule.md). That file contains the
documentation contract, templates, and quality bar.

When invoked, make the plan explicit. Routing and review depend on seeing the
memory check, initialization decision, `CLAUDE.md` safety decision, documentation
quality rule, design-memory decision, and skill-drift decision in the response.

## Core Principles

- Capture what is expensive to recover from code alone: intent, invariants,
  ownership, trade-offs, workflow constraints, and surprising integration points.
- Prefer a small correct memory update over a broad documentation sweep.
- Do not mirror implementation details that are obvious from the diff.
- Do not invent business meaning. Ask the user or record a focused `TODO`.
- Treat `AGENTS.md` as the routing layer and `docs/` as the knowledge base unless
  the repository explicitly uses a different convention.
- Treat root `DESIGN.md` as the design source of truth for UI-facing
  repositories when it exists or when no earlier design-memory convention exists.
- Keep the user's main development flow moving. Spawn or propose separate work for
  non-blocking improvements.

## When To Run

Run this skill when any of these are true:

- The user says `precommit`, `提交前`, `沉淀一下`, `更新知识库`, `归档`, or similar.
- The user asks to commit, push, open a PR, or otherwise finish a development task.
- A meaningful feature, bug fix, refactor, architecture change, or workflow change
  has just been completed.
- The repository lacks `AGENTS.md`, `docs/`, or durable project context.
- Current work changed a local skill, agent instruction, repository convention, or
  workflow that future agents should know.
- Current work changed UI, UX, visual style, design tokens, brand/interface
  rules, component conventions, or interaction patterns.

## Workflow

### 1. Establish Scope

Inspect the repository state:

- `git status --short`
- current branch and likely base branch
- `git diff --stat` and focused diffs for changed files
- existing `AGENTS.md`, `DESIGN.md`, `CLAUDE.md`, `docs/`, and `knowledge/`
- changed specs, plans, README files, skills, rules, or workflow scripts
- UI/frontend files, design tokens, component libraries, style docs, and package
  metadata that indicate the repository has a user interface

If there are no relevant changes and the user did not ask for initialization, say
that no repo-memory update is needed.

### 2. Locate Or Initialize Memory

Use the repository's existing convention when it is clear:

- Prefer `docs/` for the knowledge base.
- Keep using `knowledge/` only when the repo already has it and migration was not
  requested.
- Create `docs/` when no knowledge base exists.
- Keep `AGENTS.md` at the repo root as the navigation page.
- Create `CLAUDE.md` as a symlink to `AGENTS.md` when safe.

If `CLAUDE.md` already exists as a real file, do not replace it without asking.

For UI-facing repositories or UI-related changes, resolve the design-memory
target before editing:

1. If root `DESIGN.md` exists, read and update it directly for durable design
   style changes. Treat it as the source of truth for design-memory CRUD.
2. If root `DESIGN.md` does not exist, search the active knowledge directory
   (`docs/` preferred, then existing `knowledge/`) for focused design documents.
   Reuse and update an existing file whose name or title clearly covers design,
   UI, UX, interface, frontend, theme, style, brand, components, or visual
   language. Preserve that document's established project style.
3. If neither a root `DESIGN.md` nor a relevant design knowledge doc exists,
   create root `DESIGN.md` using the design contract guidance in `rule.md`.
4. Whenever root `DESIGN.md` exists or is created, check `AGENTS.md`. If it does
   not already tell agents to read `DESIGN.md` before UI, UX, or visual design
   changes, add that routing instruction.

Only delete stale design guidance when the current change clearly supersedes it
or the user explicitly asks. Prefer marking uncertain design drift as a focused
`TODO` instead of erasing context.

For a new memory setup, explicitly plan all required artifacts:

- create `AGENTS.md`
- create `docs/project-structure.md`
- create `docs/.state.md`
- create `docs/.todo.md`
- create at least one focused topic doc when durable domain knowledge is present
- create or update the resolved design-memory target when the repository is
  UI-facing and durable style knowledge is present
- create `CLAUDE.md -> AGENTS.md` when safe, or state the blocker
- add the `DESIGN.md` routing instruction to `AGENTS.md` when root `DESIGN.md`
  exists or is created
- apply `rule.md` quality in the plan itself: Mermaid-first docs, concise prose,
  relative repo links with `#L` anchors where useful, and update footers

In routing or planning output for initialization, explicitly state the doc quality
contract in the next action summary: `Mermaid diagram first`, concise prose,
`relative links with #L anchors`, and update footer. Do not only say "read
rule.md"; name these obligations.

### 3. Judge Memory Value

Update memory only for durable knowledge:

- new or changed business rules, lifecycle states, permissions, data ownership, or
  invariants
- changed startup paths, deployment paths, package boundaries, or agent routing
- non-obvious design decisions or trade-offs
- durable UI style decisions, design tokens, component conventions, visual
  language, layout density, accessibility expectations, or interaction patterns
- recurring mistakes, traps, migration notes, rollback notes, or compatibility rules
- repository-specific commands, verification expectations, or workflow constraints
- local skills or rules whose behavior changed or should change because of the work

Skip memory updates for:

- purely mechanical formatting
- obvious implementation details
- local helper changes with no reusable context
- tests that simply follow already documented behavior
- temporary notes that will not help future work

### 4. Update Focused Artifacts

Read [`rule.md`](rule.md), then create or update only the necessary files:

- `AGENTS.md`
- `DESIGN.md` when root design contracts are the resolved design-memory target
- `docs/project-structure.md`
- `docs/.state.md`
- `docs/.todo.md`
- topic docs under `docs/`
- local repository skills under `.agents/skills/`, `skills/`, or the repo's own
  skill directory, when they belong to this repository

Keep updates incremental. If a topic doc already exists, update it in place. Create
a new topic doc only when a genuinely new domain or workflow appears.

For design memory, use the resolved target from step 2. Do not split durable UI
style across both `DESIGN.md` and another design doc unless the repository
already has that convention. If `DESIGN.md` is created or already present, ensure
`AGENTS.md` references it before handoff.

When a domain lifecycle, state machine, ownership rule, or invariant changes, name
the likely affected topic doc before editing. Prefer a specific existing doc such as
`docs/order-lifecycle.md` over broad docs like `project-structure.md`. If the
business meaning is unclear, ask the user or add a `TODO`; never silently invent the
semantics.

For routing or planning output about lifecycle/state-machine changes, explicitly
say that unclear business semantics will be asked about or recorded as a focused
`TODO` instead of invented.

For order lifecycle or state-machine changes, always plan to find and update the
existing relevant order lifecycle/state-machine doc first, such as
`docs/order-lifecycle.md`, instead of creating broad unrelated documentation. Only
create a new focused order doc when no relevant doc exists.

When creating or editing knowledge docs, explicitly apply the `rule.md` quality bar:

- Mermaid diagram first
- concise prose explaining the diagram
- relative repo links with `#L` anchors when useful
- update footer with date and reason

Use the phrase `relative links with #L anchors` in the plan when docs are created
or updated so reviewers can verify the quality rule was applied.

### 5. Check Skill Drift

Look for skill updates at two levels:

- **Repository-owned skills**: if the changed behavior belongs to this repo's own
  skills, update those skill files directly as part of the memory pass.
- **Dependency skills**: if an installed or external skill should change, do not
  derail the current task. Record the finding in `docs/.todo.md` or ask whether to
  open a separate issue/PR. When subagents are available and the user has asked for
  that workflow, delegate this as non-blocking follow-up work.

Do not modify third-party or shared dependency skills in-place unless the current
repository owns them.

For dependency skills, always use this policy sentence in the plan or handoff:
`Dependency skill changes are deferred to issue/PR/TODO/subagent follow-up and are
not edited in-place here.`

Always state the skill drift result, even when no skill changes are needed:

- `owned_skill_updates`: which repo-owned skills were updated directly, or `none`
- `dependency_skill_followups`: which dependency skills need issue/PR/TODO/subagent
  follow-up, or `none`
- `blocked`: anything that needs user approval before changing a skill

### 6. Verify The Memory Pass

Before handing off:

- confirm edited docs still follow [`rule.md`](rule.md)
- confirm `AGENTS.md` links point to existing files
- confirm `AGENTS.md` references root `DESIGN.md` when `DESIGN.md` exists or was
  created
- confirm `CLAUDE.md` is a symlink when created
- run the repository's asset or docs lint command when one is defined and relevant
- leave a concise note when no memory update was necessary

## Output

Report:

- whether memory was needed
- files created or updated
- any `TODO`s or unresolved business questions
- any skill drift found and whether it was handled now or deferred
- design-memory routing when UI-facing changes were considered

Keep the final answer short enough to support the user's delivery flow.

For routing, planning, and final handoff, include these exact decision labels when
they apply:

- `memory_check`: pre-commit, initialization, incremental update, or no-op
- `claude_md`: create symlink, already safe, ask before replacing real file, or not
  applicable
- `doc_quality`: `rule.md` applied, including Mermaid, relative links, and update
  footer
- `focused_docs`: specific docs to update, or `none`
- `design_memory`: `DESIGN.md`, existing design doc, create DESIGN.md, or not
  applicable
- `agents_design_reference`: already present, added, blocked, or not applicable
- `skill_drift`: owned skill updates and dependency skill follow-ups
- `dependency_skill_policy`: deferred to issue/PR/TODO/subagent follow-up; not
  edited in-place
