# Touch fallback

## The contract

Every hover-driven interaction needs a touch and keyboard equivalent that
reaches the same functionality — not a degraded version of it. `pointer:
coarse` and touch input should never leave content or an action permanently
unreachable.

## How Pinky implements it

Components that key their primary interaction off `hover` — `Spotlight`,
`Tilt`, proximity-based docks, hover-reveal media — check
`useCompactLayout()` or an equivalent coarse-pointer signal and either:

- **swap to tap/press** as the trigger (`Elastic Columns`, `Focus Rail`), or
- **flatten to the resting state** and rely on an explicit control instead
  (`Depth Scroll Gallery`, `Scroll Morph Wall` on narrow viewports).

Never leave a hover-only affordance as the sole path to content. If hovering
reveals a label, caption or action, that same information needs a visible or
tap-reachable equivalent on touch.

## Checklist for a new component

- Does anything only appear `on hover`? Give it a visible or tap alternative.
- Does dragging do something a button couldn't? Keep a button path alongside
  it (see Draggable Card Stack's Previous/Next buttons).
- Does `useCompactLayout()` (or `pointer: coarse`) change the interaction
  model, not just the visuals?
- Has it been tested with `resize_window` at the mobile preset, not just
  visually inspected at desktop width with the mouse still available?

## Related

[[reduced-motion]], [[mobile-gesture-etiquette]]
