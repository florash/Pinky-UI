# Gradient Border Card

## Purpose

A static two-stop gradient ring, painted once and never animated — the
plain, always-on sibling to Glow Border's pointer-tracked light and
Border Beam Card's travelling one.

## Good for

- a card that needs to read as special at rest: a screenshot, a printed
  reference, a list a pointer never touches

## Avoid for

- a card that should only look special once something's actually moving
  over or near it — that's Glow Border (pointer-tracked) or Border Beam
  Card (continuously orbiting), not this one

## Recommended defaults

Leave `from`/`to` at the defaults (the family's existing blush/cloud
accent pair) — this is explicitly the "no new hue" card, adding a third
colour to the gradient would undercut the reason it exists next to Glow
Border and Border Beam Card.

## Accessibility

- Same focus-visible rule as Basic Card once `onClick`/`href` is present.
- The gradient ring is a decorative, `aria-hidden` overlay.

## Performance

No motion at all — the border is static from first paint. Cheaper than
either Glow Border or Border Beam Card, since there's no pointer listener
or continuous animation loop to run.

## Composition

The family's shared shape lives in `docs/card-api-conventions.md` — read
that once, not per card.
