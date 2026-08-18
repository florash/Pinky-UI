# Glow Card

## Purpose

An ambient bloom sitting behind the card that widens on hover — not
pointer-tracked. It glows from its own center outward regardless of where
the pointer actually is, closer to a halo than a light source.

## Good for

- a card that should read as lit from within, independent of exactly
  where the pointer is
- a shared visual identity across a small set of featured cards

## Avoid for

- a surface that should light up specifically where the pointer touches
  it — that's Spotlight Card (lighting the face) or Glow Border (lighting
  the edge), both pointer-tracked, unlike this one

## Recommended defaults

`color` defaults to the blush accent; pass a cloud token for a cooler
read. Don't reach for a hue outside the family's blush/cloud pair — same
"no new hue" rule as everywhere else in this document set.

## Accessibility

- Same focus-visible rule as Basic Card once `onClick`/`href` is present.
- The glow is a decorative, `aria-hidden` overlay.

## Performance

Pure CSS opacity/blur, no pointer-event listeners. The glow is visible at
rest either way; only its widening on hover is `motion-safe:`-scoped, so
`prefers-reduced-motion: reduce` still shows a glow, just a static one.

## Composition

The family's shared shape lives in `docs/card-api-conventions.md` — read
that once, not per card.
