# Shimmer Surface

## Purpose
Use a restrained material sheen to indicate an active wait on a surface that
already has a real content boundary.

## Use when
A skeleton needs a subtle time cue and the content is above the fold. Pair it
with SkeletonMorph rather than presenting the sheen as a finished surface.

## Avoid
Permanent GPU-heavy animation, high contrast, or shimmer offscreen.

## Accessibility
Mark the sheen decorative and provide a textual busy status elsewhere. The
surface edge and content geometry should remain understandable without it.

## Keyboard and touch
Shimmer must not affect focus or touch hit testing.

## Reduced motion and performance
Use a static fill under reduced motion and pause or omit it for offscreen content.

## Composition and anti-patterns
Compose with SkeletonMorph; never use it as decoration after content has loaded.
