# Shine Card

## Purpose

A diagonal gloss streak sweeps across the surface on hover — purely
decorative, a finish rather than content.

## Good for

- a finishing touch on an already-complete card: pricing, a featured
  product

## Avoid for

- stacking with another hover effect that also claims the surface — check
  `docs/card-api-conventions.md`'s self-check question about two hover
  effects on the same card fighting for the same visual space before
  wrapping this around, say, Glow Card

## Recommended defaults

Use this as a wrapper around a finished structural card (`children` is
any card), not as a replacement for one — it has no content shape of its
own on purpose.

## Accessibility

- The sweep is a decorative, `aria-hidden` layer, positioned so it never
  intercepts clicks.
- Same focus-visible rule as Basic Card once `onClick`/`href` is present.

## Performance

The sweep is `motion-safe:`-scoped and only ever runs on
`group-hover`, so it's skipped entirely under `prefers-reduced-motion:
reduce` and on any device that never hovers — the card is then identical
to Basic Card, not a lesser version of Shine Card.

## Composition

The family's shared shape lives in `docs/card-api-conventions.md` — read
that once, not per card.
