# Image-heavy performance

Galleries are where a motion library gets its reputation for being slow. The
rules below are what keep Pinky's layouts usable at scale.

## Layout shift

- Always set explicit `width`/`height` or an `aspect-ratio` on images.
- Prefer layouts that do not measure. Masonry Gallery distributes round-robin
  precisely so it never reflows when images load.
- Never compute a layout from image dimensions that arrive asynchronously.

## Loading

- `loading="lazy"` on everything below the fold.
- Load the demo-sized image, not the original. A gallery of twelve full-size
  photos will outweigh the entire JavaScript bundle several times over.

## Effects

- **No `backdrop-filter` in a gallery.** It is the most expensive thing in the
  library and it multiplies by item count. One Liquid Card is a feature; twelve
  is a dropped-frame machine on mobile Safari.
- No per-item pointer listener. Pinky's collections track a single focused index
  or share one subscription through the Proximity primitive.
- No per-frame React state. Pointer-driven values belong in motion values or CSS
  variables.

## Idle cost

A gallery that is not being interacted with should be doing nothing at all. No
timers, no animation loops, no filters left mounted from a transition that
already finished. If something must run continuously — a marquee, a carousel
autoplay — pause it when it scrolls out of view and when the pointer or focus is
inside it.

## Mobile

Assume no hover, less memory and a slower GPU. Every hover-driven effect needs a
resting state that is complete on its own, and the layouts should simplify
rather than shrink: fewer columns, less spread, no overlap.
