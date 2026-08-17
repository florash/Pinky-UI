# Indicator motion

## What an indicator is for

A nav indicator (a sliding pill, an underline, a highlighted rail segment)
exists to answer one question at a glance: where am I. Its motion should
make that answer arrive faster than reading text would, not slower — which
sets a hard ceiling on how long and how elaborate the animation can be.

## Duration and easing

- **Pill and underline indicators**: the `responsive` spring
  (`stiffness: 320, damping: 32`) — arrives with the click rather than
  drifting toward it. This is deliberately snappier than the `soft` spring
  used for layout-scale movement; an indicator lagging behind a decision
  the user already made reads as sluggish.
- **The "stretch" micro-detail**: a brief `scaleX` toward ~1.08 on arrival,
  settled with the `elastic` spring, timed to release after roughly 90ms.
  This is what stops a sliding pill from reading as a rigid rectangle being
  dragged — the shape answers the movement, the way something soft would.
  Skip it entirely rather than tune it longer; past a subtle wobble it
  reads as loose, not alive.
- **Mega menu and panel entrance**: `snappy`
  (`stiffness: 460, damping: 36`), scaling from ~0.95 with a small
  upward offset, anchored with `transform-origin` at the corner nearest
  the trigger — so the panel visibly grows from the thing that opened it,
  not from the middle of the screen.

## The shared-element technique

Where the indicator moves between differently-sized or differently-positioned
items (Fluid Tabs, Pill Nav), use one motion element with a shared
`layoutId` rather than separately animating position and size on two
elements. This gets a correct morph between arbitrary start and end
geometry for free, and guarantees there is only ever one indicator in the
DOM — no risk of two pills existing mid-transition.

## What must never move

Text reflow, layout shift, or a change in hit-target position must never be
caused by indicator motion. Everything above is transform and opacity only.

## Reduced motion

The indicator jumps to its new position in one frame — no spring, no
stretch, no scale entrance for a panel. The *state* communicated by the
indicator (which item is current, which panel is open) must be identical
either way; only the transition between states is removed.

## Related

[[choosing-a-nav]], [[nav-accessibility]], [[motion-budget]]
