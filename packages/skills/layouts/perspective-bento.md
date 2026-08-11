# Perspective Bento

## Purpose

Use when a bento is one spatial composition and needs a shallow group perspective. The plane moves; cells do not independently perform card tilts.

## Use when

- Four to twelve feature cells share one visual scene.
- A focused cell needs a little hierarchy without a camera effect.

## Avoid when

- Every tile should be an independent interactive card.
- Perspective would make text or controls harder to scan.

## Hover and focus

Use a direct CSS-variable pointer response for the group and a small z-lift for the focused cell. Focus parity matters; do not make hover the only way to reveal a cell label.

## Reduced motion and touch

Flatten to a normal responsive grid for touch and reduced motion. Keep cell spans explicit and content in logical DOM order.
