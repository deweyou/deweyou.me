---
name: ui-design
description: >
  UX/UI design workflow for research, flow design, visual style, implementation,
  review, and AI design prompts. Use for web, mobile/H5, native apps, HarmonyOS,
  mini programs, macOS, dashboards, tools, component libraries, onboarding,
  settings, empty states, UX references, or explicit UI/UX/style requests.
---

# UI Design

Use this skill as the general UX/UI design workflow. It covers both
practical interface quality and project-level design contracts, but those layers
are not the same thing:

- UX/UI quality decides whether the flow, interaction, states, platform behavior,
  and implementation are clear and usable.
- `DESIGN.md` decides whether the surface follows the product's chosen visual
  system and component taste.

Solve the experience first, then the interface structure, then the design
contract. Do not let visual style override usability.

## When To Use

Use this skill when the user asks to research, design, implement, refine, or
review UX/UI. Relevant surfaces include web pages, component libraries,
H5/mobile web, iOS/Android, HarmonyOS, WeChat or Alipay mini programs, macOS
apps, dashboards, tools, landing pages, and AI design prompts.

Common trigger contexts include:

- Flow, interaction, usability, onboarding, settings, editors, lists, search,
  sharing, empty states, loading states, error recovery, and permission/login
  blockers.
- UX reference requests such as "别人怎么做", "有没有 UX 参考", "这个流程顺不顺",
  "审一下体验", "UX pattern research", or "review this flow".
- Visual style requests such as "我的风格", "我的设计风格", "专属于我风格",
  "优化 UI", "审一下界面", "personal interface style", or "UI design".
- Platform-specific UI requests such as "做个移动端/H5", "鸿蒙", "HarmonyOS",
  "小程序", "微信小程序", "支付宝小程序", "mac app", component-library style,
  or Sleek / AI-generated mobile app prompts.

Start with UX structure and interaction quality when the request is about flow
or usability. Apply `DESIGN.md` only when the user asks for visual style,
interface taste, component-library fidelity, visual design, implementation, or a
review against a design system.

## When Not To Use

- Do not use this skill for unrelated backend, infrastructure, CLI, or data
  debugging tasks just because the prompt mentions a UI word.
- Do not impose the active personal style when the user explicitly asks for a
  different visual direction unless they ask to reconcile it with that style.
- Use `product-design` instead when the request is about product positioning,
  feature priority, market fit, or version scope rather than interface behavior.

## Reference Map

Read only the references needed for the task:

| Reference | Use when |
| --- | --- |
| `references/ux-pattern-research-playbook.md` | The user asks how other products solve a flow, asks for UX references, or the answer depends on existing patterns. |
| `references/interface-quality-playbook.md` | Designing or reviewing flows, states, accessibility, information hierarchy, responsive behavior, or practical UX/UI quality. |
| `references/design-md-workflow.md` | The task involves project style, user style, visual direction, design-system persistence, `DESIGN.md`, component taste, tokens, typography, color, density, copy, or Sleek prompts. |
| `references/ai-design-tool-playbook.md` | The user asks for Sleek prompts, AI-generated mobile app screens, design variations, generated-screen review, or implementation handoff from generated designs. |
| `references/platform-implementation-playbook.md` | The task targets web, H5/mobile web, native mobile, HarmonyOS, mini programs, macOS, component libraries, or implementation verification. |
| `references/component-library-snapshot.md` | Working with the current React component library or needing current component-system facts. |
| `references/design-tokens.css` | Building standalone prototypes or examples that need portable CSS tokens. |

If the host repository has newer or more specific UI rules, follow the host
repository first and use these references as portable fallback guidance.

## Mode Selection

Choose the mode before designing. Use multiple modes in order when needed.

### UX Pattern Research

Use when the user asks "别人怎么做", asks for UX references, asks not to design
from scratch, or when comparable products/platform conventions could change the
answer.

Read `references/ux-pattern-research-playbook.md`. Inspect references before
proposing a solution. Inspect 3-6 relevant products, screens, or UX references
when the question asks how others solve a flow. If browsing, screenshots, or product access are
unavailable, state the limitation and mark the recommendation as lower
confidence.

### UX Flow / Interaction Design

Use when the task is about onboarding, settings, editor flows, lists, search,
sharing, empty states, permission/login blockers, error recovery, or whether a
flow feels smooth.

Read `references/interface-quality-playbook.md`. Output the flow, state model,
recovery paths, copy notes, and acceptance criteria before visual styling.
For deliberately simple first-version pages, explicitly name `what_can_wait` so
the plan does not grow into an enterprise-scale settings or workflow system.

### UI Visual Design

Use when the user asks for visual design, user style, component-library
fidelity, project `DESIGN.md`, page layout, visual hierarchy, tokens,
typography, color, or a design prompt.

Read `references/design-md-workflow.md`, then read the relevant `DESIGN.md`
according to that workflow. If the visual work also changes user flow or
interaction, handle UX structure first.

When routing or planning personal-style work, explicitly mention concrete style
checks from the design contract, such as neutral surfaces, restrained hierarchy,
bordered structure, Chinese-first compact copy, emerald primary emphasis when
present in the active design contract, token usage, and avoiding arbitrary raw
colors, shadows, radii, nested cards, generic gradients, or oversized hero
treatment in tool UIs.

For H5 or mobile-web visual design, also explicitly mention mobile checks:
safe-area handling, tap-first interactions, touch target size, responsive layout,
and viewport-height behavior.

For H5 or mobile-web personal-style work, routing or planning output must include
both of these field groups:

- `personal_style_checks`: neutral surfaces, emerald primary emphasis when
  present, bordered structure, Chinese-first compact copy, and token usage.
- `mobile_checks`: safe areas, tap-first interactions, touch targets, responsive
  layout, and viewport-height behavior.

### Implementation / Prototype

Use when editing UI code, building a prototype, generating a Sleek prompt, or
working in a platform-specific stack.

Read `references/platform-implementation-playbook.md`. For web or component
library work, also read `references/component-library-snapshot.md` when relevant.
For Sleek or another AI design tool, read
`references/ai-design-tool-playbook.md`.

For mini programs, explicitly check capsule/menu safe area, page stack
navigation, startup performance, and native component availability. For mobile
or generated-app prompts, explicitly mention safe areas, navigation, fonts,
icons, generated source handoff, and post-generation screenshot or rendered
output inspection.

For Sleek or AI-generated mobile app prompts, routing or planning output must
also mention workflow/state requirements, not only visual adjectives. Include
the generated-source handoff and post-generation screenshot or rendered-output
inspection in the next action summary.

### Review

Use when the user asks to review UI, UX, flow, accessibility, visual style, or
implementation quality.

Lead with concrete findings. Prioritize flow clarity, accessibility, interaction
states, layout, token/style drift, and implementation risks. Cite file/line
references when files are available.

If the prompt names a specific file, read that file before reporting findings.
Plan file/line-grounded findings rather than generic design advice, and mention
the file read in routing or planning output.
For file-based web UI reviews, explicitly list the review priorities in routing
or planning output: accessibility, interaction states, layout, performance, and
implementation risks.

For personal-style reviews, explicitly look for style drift such as nested
cards, raw colors, arbitrary radii or shadows, generic gradients, oversized hero
treatment in tool UIs, and missing design-token usage.

When the prompt explicitly asks for "web design guidelines", also trigger or
reference the `web-design-guidelines` skill/source and say the review should use
the latest Web Interface Guidelines source before reporting compliance findings.
In routing or planning output, use the exact phrase "latest Web Interface
Guidelines source" so the review dependency is visible.

## Operating Workflow

1. Classify the request: UX research, flow/interaction design, visual design,
   implementation/prototype, review, or a combination.
2. Identify the platform and surface: web component, website page,
   dashboard/tool, H5/mobile web, iOS/Android, HarmonyOS, mini program, macOS,
   landing page, Sleek prompt, or review.
3. Identify the user's real workflow: what must be scanned, compared, edited,
   selected, confirmed, recovered from, or remembered.
4. Read the minimal relevant references from the map above.
5. Resolve UX structure before visual styling when both are involved.
6. Add states: empty, loading, error, success, disabled, selected, focus, hover,
   press, permission/login blockers, and destructive confirmations when relevant.
7. Apply the relevant `DESIGN.md` only when requested or when the task is
   explicitly about visual style, design-system fidelity, or interface taste.
8. If using an AI design tool, preserve generated visual evidence and inspect the
   generated structure before implementation.
9. If implementing, verify in the browser or relevant renderer whenever
   possible.

For ambiguous requests, make a conservative assumption and proceed. Ask only
when the target product, platform, or output artifact is genuinely unclear.

## Output Patterns

For UX pattern research:

```text
UX question
References inspected
Common patterns
Useful differences
What to borrow
What to avoid
Recommended flow
States to cover
```

For UX flow or interaction design:

```text
Recommended flow
Page or component structure
User actions
State model
Recovery paths
Copy notes
Acceptance criteria
What can wait
```

For visual design plans:

```text
Surface and workflow
Hierarchy
Component map
Token and style decisions
Responsive and state checks
Implementation notes
```

For reviews:

- Start with findings ordered by severity.
- Explain why each issue matters.
- Give a concrete fix direction.
- Mention verification gaps when relevant.

For implementation:

- Edit the relevant files directly.
- Start a local dev server when the app needs one.
- Use browser verification for significant visual changes.

## Boundaries

- Do not use this skill for unrelated backend/debugging tasks just because a UI
  word appears.
- Do not impose the active restrained style when the user explicitly requests a
  different visual direction, unless they ask to reconcile that direction with
  the active `DESIGN.md`.
- Use `product-design` when the question becomes product positioning, feature
  priority, market fit, or version scope rather than interface behavior.
