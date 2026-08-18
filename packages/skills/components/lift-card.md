# Lift Card

## Purpose

`transform` + `box-shadow` only, no pointer-event listeners at all — the
cheapest card in the family, built for grids where the honest per-card
cost of a pointer tracker (Jelly Card's, Spotlight Card's) actually adds
up once there are dozens on screen at once.

## Good for

- a grid of many cards — a search-results page, a bulk list, a card-per-
  row dashboard
- anywhere the effect only needs to read as "this is liftable," not "this
  is alive"

## Avoid for

- a handful of cards that deserve individual character — Jelly Card

## Recommended defaults

Leave `shadow` at `"neutral"`. This is meant to disappear into the
background of "cards that lift a little," not to be the interesting part
of the page — if a card should stand out, that's a different card in this
family (Glow Card, Border Beam Card), not Lift Card with extra props
bolted on.

## Accessibility

- With no `onClick`/`href`, this is a plain `<div>` — the lift and shadow
  still play, they're unconditional CSS, not gated on clickability.
- With `onClick`/`href`, the standard focus-visible ring applies (see
  `docs/card-api-conventions.md`).

## Performance

The entire point: zero `useEffect`, zero pointer-event listeners, zero
motion values. `translate-y` is `motion-safe:`-scoped so
`prefers-reduced-motion: reduce` still gets the shadow's depth cue
without the position change. Safe in effectively unlimited quantity.

## Composition

The family's shared shape lives in `docs/card-api-conventions.md` — read
that once, not per card.
