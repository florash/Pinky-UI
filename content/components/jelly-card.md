# Jelly Card

A soft elastic surface that responds naturally to pointer movement.

## The idea

Physical things have give. A card that leans very slightly toward your pointer,
drifts with it, and settles back on a spring reads as *soft* long before anyone
consciously notices the animation. The whole effect lives in a transform, so it
costs nothing in layout and nothing in stability.

## How it is built

`JellyCard` is a composition, not a special case:

- **Jelly** owns the deformation — normalised pointer offset written straight
  into motion values, spring-driven rotation, drift and scale.
- **Spring** supplies the physics vocabulary. `elasticity` blends between the
  `subtle` and `jelly` presets so one 0–1 number describes the character.
- **usePointerGlow** writes the pointer position into CSS variables; the light
  itself is a plain radial gradient the browser paints.

Anything you can express with those three, you can build yourself. Jelly Card is
the arrangement we found worth naming.

## Choosing parameters

| Character | elasticity | intensity | hoverScale |
| --- | --- | --- | --- |
| Subtle — dense grids | 0.15 | 0.08 | 1.01 |
| Soft — the default | 0.35 | 0.18 | 1.02 |
| Elastic — feature cards | 0.65 | 0.28 | 1.03 |
| Playful — one per screen | 0.9 | 0.4 | 1.04 |

## Reduced motion

Under `prefers-reduced-motion: reduce` the card renders as a static surface:
no lean, no drift, no scale, no pointer glow. Styling, shadow and content are
identical. The static state is the baseline the component renders on the server
and on first paint, so motion is genuinely additive and hydration stays quiet.

## Touch

Pointer response is skipped for coarse pointers. On touch the card is a card —
which is what a finger already covering the surface would want anyway.
