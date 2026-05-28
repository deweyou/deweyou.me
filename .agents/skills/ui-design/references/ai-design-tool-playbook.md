# AI Design Tool Playbook

Use this reference when the user asks for Sleek prompts, AI-generated mobile app
screens, design variations, screenshot review, or implementation from generated
designs.

This reference captures workflow expectations only. Actual Sleek API operations,
authentication, scopes, polling, and screenshots belong to the dedicated
`sleek-design-mobile-apps` skill when that skill is available.

## Prompting

- Preserve the user's real intent. Do not invent screens, features, or layout
  details the user did not ask for.
- Add a compact style brief from the relevant `DESIGN.md` only when the user asks
  for a named style or when the current task is explicitly within that design
  system.
- For mobile app generation, specify product context, target user, primary
  workflow, required states, and platform expectations before visual adjectives.
- If the user wants variations, create clear variation directions rather than
  small arbitrary color changes.
- Do not use vague prompts such as "make it beautiful" or "make it modern"
  without workflow, state, and product constraints.

## Generated Design Review

After a design tool produces screens, review the actual rendered result before
calling the work done:

- Does the primary workflow appear on the first screen?
- Are empty, loading, error, disabled, selected, success, and permission/login
  states represented when relevant?
- Are safe areas, touch targets, and bottom navigation handled on mobile?
- Is the hierarchy clear without relying on decorative gradients or excessive
  cards?
- Does the generated style respect the relevant `DESIGN.md` typography, color,
  icon, density, and copy rules when requested?

For tools that can render screenshots, show or inspect screenshots after screen
creation or update. Do not silently accept generated screens without visual
verification.

## Implementation Handoff

When implementing generated designs in code:

- Fetch or inspect the generated source/HTML when available; do not rely on
  screenshots alone.
- Use screenshots as the visual target and generated source as the structural
  reference.
- Preserve exact icon choices when possible. If the generated design uses
  Iconify-style names, use the same icon set or fetch equivalent SVGs rather than
  substituting a different visual language.
- Extract and match fonts, weights, color values, spacing, and layout structure.
- Update navigation chrome, tab bars, headers, and safe areas, not just the
  screen body.
- Re-verify on the target platform and screen sizes after implementation.

## Privacy And Safety

- Do not pass private URLs or sensitive screenshots to an external design tool
  unless the user explicitly approves.
- Prefer minimal API scopes and revocable keys when an external design API is
  involved.
- If the required API key or plan is unavailable, produce a prompt or local
  design spec instead of pretending the remote generation happened.
