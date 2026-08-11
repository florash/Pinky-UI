# Shimmer Surface

## Purpose
Use a restrained optional loading sheen to indicate an active wait.

## Use when
A skeleton needs a subtle time cue and the content is above the fold.

## Avoid
Permanent GPU-heavy animation, high contrast, or shimmer offscreen.

## Accessibility
Mark the surface decorative and provide a textual busy status elsewhere.

## Keyboard and touch
Shimmer must not affect focus or touch hit testing.

## Reduced motion and performance
Use a static fill under reduced motion and pause or omit it for offscreen content.

## Composition and anti-patterns
Compose with SkeletonMorph; never use it as decoration after content has loaded.
