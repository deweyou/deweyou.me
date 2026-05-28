# Repo Memory Documentation Rule

Use this rule whenever `repo-memory` creates or updates repository knowledge.

## Directory Contract

Use `docs/` as the default knowledge directory. Detect `knowledge/` only for
backward compatibility:

- If `docs/` exists, use it.
- Else if `knowledge/` exists, keep using it unless the user wants migration.
- Else create `docs/`.

Required files for a newly initialized repository:

```text
docs/
├── .state.md
├── .todo.md
├── project-structure.md
└── <topic>.md

repo root/
├── AGENTS.md
├── DESIGN.md              optional for UI-facing repositories
└── CLAUDE.md -> AGENTS.md
```

### File Purposes

- `AGENTS.md`: repo-root routing document under 200 lines.
- `DESIGN.md`: root design contract for UI-facing repositories when present or
  when no earlier design-memory convention exists.
- `project-structure.md`: top-level layout, startup path, and ownership map.
- `.state.md`: last reviewed commit, iteration, covered areas, and open risks.
- `.todo.md`: prioritized memory backlog and unresolved questions.
- `<topic>.md`: domain or workflow knowledge organized by problem space.

## Quality Bar

Every knowledge document must:

- start with a Mermaid diagram, then explain the diagram in prose
- include at least one Mermaid diagram
- link critical files with relative repo paths and `#L` anchors when useful
- make its covered module, boundary, workflow, or invariant obvious
- stay concise and decision-oriented
- avoid copying function bodies, SQL internals, call-by-call traces, or local helper
  details unless they are essential to the invariant
- end with an update footer:
  `*Last updated: YYYY-MM-DD | Reason: <why this changed>*`

Root `DESIGN.md` is a design contract, not a Mermaid-first knowledge doc. Apply
the Design Memory Contract below instead of forcing Mermaid diagrams into it.

## Mermaid Guidance

Choose the simplest diagram that explains the memory:

- Business flow or request chain: `flowchart` or `sequenceDiagram`
- State transitions or lifecycle rules: `stateDiagram-v2`
- Architecture and module relationships: `graph TD`
- Class or interface relationships: `classDiagram`
- Cross-service timing or handoffs: `sequenceDiagram`

Keep node labels short. Split large flows into multiple diagrams. Highlight the
critical path instead of styling everything.

## Link Guidance

- Use repo-relative links such as `docs/order-lifecycle.md` or `src/server.ts#L1`.
- Prefer line anchors for source references when they are stable enough to help.
- Never use machine-local absolute paths.
- Never handwrite full Git hosting URLs.

## Design Memory Contract

Use this contract when the repository has UI surfaces or the current work changes
UI, UX, visual style, design tokens, brand/interface rules, component
conventions, accessibility expectations, or interaction patterns.

Resolve the design-memory target in this order:

1. Root `DESIGN.md`, when it exists. Read and update it directly.
2. An existing focused design doc in `docs/` or, for legacy repos, `knowledge/`.
   Match clear names or titles such as design, UI, UX, interface, frontend,
   theme, style, brand, components, or visual language. Preserve that file's
   existing structure and project style.
3. New root `DESIGN.md`, when no existing design-memory target exists.

When root `DESIGN.md` exists or is created, ensure `AGENTS.md` tells agents to
read it before UI, UX, or visual design changes. Do not duplicate the same design
guidance across both `DESIGN.md` and another knowledge doc unless the repository
already has that split.

When creating root `DESIGN.md`:

- include YAML frontmatter with `name`, `description`, and `version`
- include the design thesis, tokens or token guidance, principles, typography,
  color, layout, components, interaction, accessibility, do/don't guidance, and
  an update footer
- record known style from the existing UI; mark uncertain brand intent as `TODO`
  instead of inventing it
- keep durable rules concise and avoid copying full component implementations

## Initialization Steps

When initializing memory:

1. Inspect `README`, manifests, package/workspace files, entry points, and recent
   history.
2. Identify how the application starts or how the package is entered.
3. Separate code-derived facts from business intent that needs user confirmation.
4. Create `AGENTS.md`, `docs/project-structure.md`, `docs/.state.md`,
   `docs/.todo.md`, and at least one focused topic doc when a topic is known.
5. For UI-facing repositories, resolve or create the design-memory target and
   add the `DESIGN.md` routing instruction to `AGENTS.md` when applicable.
6. Create `CLAUDE.md -> AGENTS.md` only when safe.

## Incremental Update Steps

When updating existing memory:

1. Read `AGENTS.md` first.
2. Read the relevant docs or design-memory target before editing them.
3. Compare the current changes against the last reviewed commit in `.state.md`
   when available.
4. Update only affected docs.
5. For UI-facing changes, ensure `AGENTS.md` references root `DESIGN.md` when
   root `DESIGN.md` exists or is created.
6. Update `.state.md` and `.todo.md` when coverage or unknowns changed.

If code changed but the memory value filter finds nothing durable, do not force a
doc edit.

## Templates

### AGENTS.md

```markdown
# <Project Name>

<1-2 sentences: what this codebase does and who uses it>

## Knowledge Base

| Document | What it covers |
|----------|----------------|
| [docs/project-structure.md](docs/project-structure.md) | Top-level structure and how the app boots |
| [docs/<topic>.md](docs/<topic>.md) | <description> |

## Hard Constraints

- <constraint>

## Task Routing

- If you're making UI, UX, or visual design changes and root [DESIGN.md](DESIGN.md)
  exists, read it first.
- If you're modifying <domain X>, read [docs/<topic>.md](docs/<topic>.md) first.
```

### DESIGN.md

```markdown
---
name: <project-design-name>
description: <one-sentence design identity>
version: 1
tokens:
  color:
    canvas: <token-or-value>
    surface: <token-or-value>
    text: <token-or-value>
    primary: <token-or-value>
  typography:
    control: <font-or-system-stack>
    content: <font-or-system-stack>
  spacing:
    rhythm: <base unit>
---

# <Project> Design

<1-2 sentences describing the durable interface style.>

## Design Thesis
## Principles
## Typography
## Color
## Layout
## Components
## Interaction
## Accessibility
## Do
## Don't

---
*Last updated: YYYY-MM-DD | Reason: <why this changed>*
```

### project-structure.md

````markdown
# Project Structure

```mermaid
flowchart TD
    A[Entry point] --> B[Bootstrap]
    B --> C[Core modules]
```

<1 sentence: what this repo is and how it is organized>

## Directory Layout

```text
src/                    application code
scripts/                developer tooling
docs/                   repository memory
```

## Startup Path

- <how useful work begins>

## Key Files

- [src/main.ts#L1](../src/main.ts#L1) - entry point

---
*Last updated: YYYY-MM-DD | Reason: initial memory setup*
````

### Topic Doc

````markdown
# <Question this document answers>

```mermaid
flowchart TD
    A[Concept] --> B[Decision]
    B --> C[Boundary]
```

<1-2 sentences of context>

## Key Rules

- <rule or invariant>
- <pitfall>

## Key Files

- [src/<path>.ts#L1](../src/<path>.ts#L1) - <why it matters>

## Open Questions

- TODO: <unknown that needs confirmation>

---
*Last updated: YYYY-MM-DD | Reason: <why this was written or updated>*
````

### .state.md

```markdown
# Memory State

- Last reviewed commit: `<sha>`
- Iteration: `1`
- Last run: `init`
- Covered areas: `<area>`, `<area>`
- Open risks: `<risk>`
```

### .todo.md

```markdown
# Memory TODO

- [ ] Trace refund lifecycle from API request to settlement job
- [ ] Confirm ownership boundary between billing and order state transitions
```
