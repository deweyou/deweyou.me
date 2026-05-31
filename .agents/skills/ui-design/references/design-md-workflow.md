# DESIGN.md Workflow

Use this reference when a UI task involves project style, user style, visual
direction, design-system persistence, or a request to create or update a design
contract.

## What DESIGN.md Is

`DESIGN.md` is the design source of truth for a repository or product. It sits
beside project instructions such as `AGENTS.md`, but it answers a different
question:

- `AGENTS.md`: how agents should work in the repository.
- `rules/*.md`: passive coding or process preferences.
- `skills/*/SKILL.md`: active workflows agents should run.
- `DESIGN.md`: how the interface should look, feel, compose, and behave.

Treat `DESIGN.md` as a project-level design contract: part design rule, part
token map, part component guidance.

## Discovery Order

Before applying visual style, look for design contracts in this order:

1. User-provided design instructions in the current request.
2. A project-local `DESIGN.md` at the repository root.
3. A product-local `DESIGN.md` near the app or package being edited.
4. A documented design convention in `AGENTS.md` or project docs.
5. the bundled design contract, when the user
   asks for "my style", "my style", or similar and no closer project design
   contract exists.

If a project-local `DESIGN.md` conflicts with user style, follow the local
project design contract unless the user explicitly asks to use the user's personal
style. If the request is ambiguous, ask which design contract should win.

## Recommended Structure

Use YAML frontmatter for machine-readable tokens and Markdown for judgment,
examples, and component guidance.

```markdown
---
name: Product Design System
description: One-sentence design identity.
version: 1
tokens:
  color:
    canvas: "#..."
    surface: "#..."
    text: "#..."
    border: "#..."
    primary: "#..."
    danger: "#..."
  typography:
    control: "..."
    content: "..."
  spacing:
    rhythm: "4px"
  radius:
    sm: "..."
    md: "..."
---

# Product Design System

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
```

Keep `DESIGN.md` opinionated enough to guide decisions, but not so rigid that
every page becomes identical.

## When To Create Or Update

Create or update `DESIGN.md` when:

- the user asks to make a durable design system or style guide
- a project repeatedly needs the same visual rules
- user style is being applied to a repository that does not yet have a design
  contract
- a UI implementation introduces new tokens, component conventions, or style
  decisions that future work should preserve

Do not update `DESIGN.md` for one-off visual experiments unless the user wants
the experiment to become the design direction.

## Applying DESIGN.md

When designing or reviewing:

1. Read the relevant `DESIGN.md`.
2. Extract tokens, principles, and do/don't constraints.
3. Resolve UX structure before styling.
4. Map visual decisions to tokens and component guidance.
5. Call out any conflict between current UI and `DESIGN.md`.
6. If implementing, verify rendered output against the contract.

For reviews, cite `DESIGN.md` rules as the source of truth when a finding is
about visual drift.
