# Zoom Card

## Purpose

Media Card's sibling: the media itself scales up inside its own clipped
frame on hover, rather than sitting still. The frame's `overflow-hidden`
is what turns "the image gets bigger" into "the image zooms in" — the
crop is the whole effect.

## Good for

- article previews, product photography, anywhere a hover zoom reads as
  an invitation to look closer

## Avoid for

- media that shouldn't crop past its frame at any zoom level — check the
  source has margin to spare before raising `zoom` above the default

## Recommended defaults

Keep `zoom` under roughly 1.15 — past that the crop starts looking like a
mistake rather than an effect. If the card also needs a caption that
appears on hover instead of sitting below the media, that's Reveal Card,
not this one stacked with something else.

## Accessibility

- The media slot has no built-in alt text — that belongs on the `<img>`
  the caller passes in.
- Same focus-visible rule as Basic Card once `onClick`/`href` is present.

## Performance

The zoom is a single CSS `scale()` transform, `motion-safe:`-scoped —
under `prefers-reduced-motion: reduce` the card renders as a static Media
Card with no animation at all.

## Composition

The family's shared shape lives in `docs/card-api-conventions.md` — read
that once, not per card.
