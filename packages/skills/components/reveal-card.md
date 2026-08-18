# Reveal Card

## Purpose

Media fills the frame; title and description live in a caption that
slides up over it on hover instead of sitting below it. On a device with
no hover, the caption is simply always visible, anchored to the bottom.

## Good for

- photography-led previews where the caption is secondary to the image

## Avoid for

- content where the description needs to be readable at a glance without
  any interaction on every device, hover or not — use Media Card, whose
  caption never depends on interaction state

## Recommended defaults

Don't put anything in `title`/`description` that's load-bearing for
understanding the image on a hover device before the caption opens — a
sighted mouse user sees the bare image first, same as a touch user
always sees the caption. If the caption content is essential, Media Card
is the safer default.

## Accessibility

- The hover/touch split is read live via `usePointerCapability`, never a
  screen-width guess — this is the same fix this repo's Mask Reveal bug
  got: a hover-only reveal with no pre-tap event is unreachable content
  on touch, not a lesser experience, so touch gets "reveal is already
  open," never "tap to reveal" (a double-tap trap when the card is also a
  link).
- The caption also opens on keyboard focus (`group-focus-visible`), not
  hover alone.

## Performance

The slide-up is a CSS transform/opacity transition, skipped under
`prefers-reduced-motion: reduce` — on a hover device the caption still
opens, just instantly instead of sliding.

## Composition

The family's shared shape lives in `docs/card-api-conventions.md` — read
that once, not per card.
