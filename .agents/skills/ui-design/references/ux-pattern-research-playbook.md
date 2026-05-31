# UX Pattern Research Playbook

Use this reference when UX advice should be grounded in existing patterns.

## Classify The UX Question

Different questions need different cases:

- onboarding: first entry, first success moment, permission requests, sample data
- editor: create, save, undo, versioning, formatting, shortcuts, AI assistance
- search: empty query, no results, filters, sorting, history, suggestions
- settings: grouping, defaults, dangerous actions, account, privacy, export
- sharing: permissions, link states, previews, revoke, collaboration presence
- paywall: trigger timing, benefit explanation, downgrade path, trial limits
- error recovery: failure copy, retry, undo, autosave, support or feedback path
- AI features: input guidance, generation progress, controllability, failure,
  hallucination handling, regenerate and accept/reject behavior

## Pick References

Choose 3-6 references:

- 2-3 products with the same interaction or flow
- 1 adjacent product with a similar user intention
- 1 platform convention source when relevant
- 1 counterexample when a common pattern is likely too heavy or confusing

Useful sources:

- user-provided screenshots or prototypes
- public product demos or trial flows
- official docs and help center walkthroughs
- app store screenshots
- onboarding, settings, or editor screenshots
- YouTube walkthroughs or product demo videos
- release notes that mention a redesign or UX change
- GitHub issues, forums, reviews, or posts where users report confusion
- platform human-interface guidance
- WAI-ARIA authoring patterns for complex web interactions

Avoid treating marketing pages as proof of actual interaction behavior unless
they show the real flow.

## Observe The Flow

Capture the parts that affect usability:

- entry point
- first decision the user must make
- primary action path
- feedback after action
- empty, loading, error, disabled, selected, and success states
- permission, login, paywall, and network blockers
- recovery, undo, retry, or escape path
- navigation, back behavior, and exit
- copy that reduces or increases uncertainty

## Compare Patterns

Summarize:

- common pattern: what users are likely to expect
- simpler variant: the smallest version that still works
- risky variant: what adds friction or hidden complexity
- counterexample: what users complain about or abandon
- platform convention: what should not be surprising on this platform

## Recommend

Give one primary recommendation and, only when useful, one simpler fallback.

Make the recommendation concrete:

- screen or component structure
- interaction steps
- required states
- recovery behavior
- minimal copy guidance
- acceptance criteria
- what can wait until a later version

Do not turn research into a full design system unless the user asks for one.
