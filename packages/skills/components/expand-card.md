# Expand Card

## Purpose

Discloses more of itself on click — not hover, click, the same
click-not-hover distinction any expand affordance needs so it works
identically with a mouse, a keyboard and a finger. Built directly on
`GridReveal` (`grid-template-rows: 0fr → 1fr`), not a JS-measured height
animation.

## Good for

- FAQ-style content, order/shipping detail a user opts into seeing
- any card where the collapsed `summary` is genuinely useful on its own

## Avoid for

- content that should always be visible — collapsing it just adds a click
  for no benefit

## Recommended defaults

Always give `summary` real information, not a placeholder like "Details"
— a collapsed card with nothing worth reading in its rest state is a
worse UX than just not collapsing it. Use the controlled `open`/
`onOpenChange` pair when several Expand Cards need to behave as an
accordion (only one open at a time); leave it uncontrolled otherwise.

## Accessibility

- The whole header is a real `<button>` with `aria-expanded` and
  `aria-controls` — never a `<div>` with an `onClick`.
- Collapsed content stays mounted but `inert` (via `GridReveal`), off the
  tab order and assistive tech until opened — matching what an unmount
  used to buy for free, without the remount cost.

## Performance

The grid-track transition is CSS, not a JS height measurement — it's
skipped entirely under `prefers-reduced-motion: reduce`, so open/close is
instant rather than animated.

## Composition

The family's shared shape lives in `docs/card-api-conventions.md` — read
that once, not per card. Built on `GridReveal` from `@pinky-ui/primitives`
— see that primitive's own doc comment for why it's `grid-template-rows`-
driven rather than a measured `height: auto` animation.
