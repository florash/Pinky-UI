# Flip Card

## Purpose

A 3D flip revealing a back face — hover-driven on a device that has
hover, tap/Enter/Space-driven on anything else.

## Good for

- a compact stat with one piece of supporting detail on the back
- a quiz or flashcard-style reveal

## Avoid for

- content someone needs to compare side by side — a flip hides the front
  face entirely, it can't show both faces at once the way, say, a
  two-column layout can

## Recommended defaults

Keep `front`/`back` roughly matched in content density — `aspect` is
shared between both faces specifically so flipping never changes the
card's height, but a back face with far more text than the front will
still feel cramped inside the same frame.

## Accessibility

- Hover-driven only on a confirmed hover-capable pointer, read live via
  `usePointerCapability` — never a screen-width guess. On touch it's a
  real button (`role="button"`, focusable, `Enter`/`Space` and tap both
  flip it), the same class of fix this repo's Tooltip and Mask Reveal
  hover-touch bugs got: a hover-only 3D transform would otherwise leave
  the back face permanently unreachable on touch.
- `aria-pressed` on the touch/keyboard path reflects the current face.

## Performance

The flip tween drops to an instant swap under
`prefers-reduced-motion: reduce` (`motion-reduce:duration-0`) — the state
change itself still happens, only the tween is skipped, matching every
other card's "reduced motion gets the settled end-state instantly" rule.

## Composition

The family's shared shape lives in `docs/card-api-conventions.md` — read
that once, not per card.
