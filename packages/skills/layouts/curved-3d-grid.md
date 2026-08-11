# Curved 3D Grid

## Purpose

Use for a recognizable content grid mapped to a shallow CSS 3D curve. It adds hierarchy, not a navigable virtual world.

## Use when

- Four to twenty products, projects or media items benefit from a shared spatial plane.
- The flat grid remains a complete fallback.

## Avoid when

- Depth is the only way to know which item is selected.
- Content is dense, tabular or essential to compare exactly.

## Keyboard and touch

Use listbox/option semantics, one active tab stop, Arrow/Home/End and explicit previous/next controls. Touch receives a flat two-column or one-column arrangement.

## Reduced motion and performance

Remove transforms under reduced motion. CSS transforms and a bounded item count keep this WebGL-free; never add a camera loop for a normal grid.
