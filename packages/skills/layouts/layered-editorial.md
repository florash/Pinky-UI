# Layered Editorial

## Purpose

Use for one feature composition where typography, media and a caption occupy shallow visual depth planes.

## Use when

- A hero or editorial cover needs one memorable relationship between type and image.
- The title and description can remain the primary reading path.

## Avoid when

- Repeating it across a dense collection.
- Making text selectable or legible only through z-index.

## Interaction

Pointer and focus may move the active media plane a few pixels forward and nudge the type plane. Keep the perspective shallow and the copy stationary enough to read.

## Accessibility and performance

Render semantic text before decorative overlap layers. Flatten on mobile and reduced motion. Use a fixed number of CSS layers, not canvas or filters.
