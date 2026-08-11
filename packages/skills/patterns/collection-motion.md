# Motion in collections

Motion that reads as refined on one card reads as chaos on twenty. Collections
need their own budget, separate from the per-component one.

## The rule

**Either the layout moves, or the items move. Not both.**

- Stack to Grid, Expandable Bento and Card Fan animate the *arrangement*. Fill
  them with calm surfaces.
- Masonry Gallery and Polaroid Wall do not rearrange, so their items can carry a
  light response of their own.

When both move, the user cannot tell what caused what, and a spring settling on
twenty items at once looks like a rendering fault.

## Scaling intensity down

An effect that is correct at one instance is usually too much at twelve. As item
count rises, intensity should fall:

| Items | Reasonable per-item motion |
| --- | --- |
| 1–3 | Jelly, Liquid, Tilt — anything |
| 4–12 | Spotlight, Glow Border, a small lift |
| 12+ | Colour and shadow only |

## One focus at a time

In a collection, the focused item should be the only one doing anything. Pinky's
layouts do this by tracking a single focused index rather than letting every
item respond independently — which is also why they respond to keyboard focus,
not just hover.

## Identity through change

When a collection re-arranges — filtering, sorting, expanding — items must keep
their identity. Same keys, same elements, moved. Tearing the list down and
building a new one produces a flicker that no amount of animation will fix.

## Reduced motion

A rearranging layout under reduced motion should **cut**, not slide. Cards
appearing in their new positions is honest; the same cards drifting slowly
across the screen is the thing reduced motion exists to prevent.
