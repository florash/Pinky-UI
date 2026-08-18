# Border Beam Card

## Purpose

A point of light that continuously travels the border ring, whether or
not a pointer is anywhere near it — the one card in the family whose
signature motion is ambient rather than pointer-driven.

## Good for

- the one card on a page that should read as live or ambient — a status
  card, a single featured item

## Avoid for

- a grid where several would run at once — a room full of continuously
  moving beams reads as noisy, not premium; use Gradient Border Card
  (static) for a whole grid instead

## Recommended defaults

`duration` at 6s reads as a calm, ambient loop; going much faster starts
competing for attention with actual content. This is meant to be used
sparingly — one per screen, not one per card in a list.

## Accessibility

- Same focus-visible rule as Basic Card once `onClick`/`href` is present.
- The beam is a decorative, `aria-hidden` overlay.

## Performance

`useMotionEnabled()`-gated: under `prefers-reduced-motion: reduce` the
beam stops at a fixed point on the ring instead of looping forever — the
same settled-end-state rule every other card's hover motion follows,
applied here to ambient motion instead. Runs on `motion/react`'s
compositor-driven `rotate`, not a JS animation loop.

## Composition

The family's shared shape lives in `docs/card-api-conventions.md` — read
that once, not per card.
