# Directional Card Reveal

## Purpose

Use one directional reveal when the entry edge communicates how a card's secondary surface should arrive. Direction is sampled as an interaction signal; it is not four cosmetic variants.

## Interaction anatomy

- Pointer entry chooses the nearest card edge.
- The secondary surface reveals from that edge.
- Focus and touch use a stable bottom-entry fallback.

## Good for

Project cards, spatial annotations and compact previews where arrival direction has meaning.

## Avoid

Generic hover lift, cards containing nested controls or content that must be visible without activation.

## Usage

```tsx
<DirectionalCardReveal
  label="Open the project summary"
  reveal={<ProjectMeta />}
>
  <ProjectSummary />
</DirectionalCardReveal>
```

## Tune

Keep the reveal surface short and preserve the card's core label in the resting DOM. Sample direction once on entry and use a clipped surface instead of a pointer loop.

## Accessibility and reduced motion

The card is a labelled button with `aria-expanded`; Enter, Space, focus and touch all reveal the content. Reduced motion removes clip travel while keeping the revealed state explicit.
