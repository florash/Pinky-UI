# Reorderable List

## Purpose
Use for a short controlled collection whose order is meaningful to the product.

## Use when
Task priorities, navigation items, or settings can be reordered by the user.

## Avoid
Using drag as the only route or rerendering a large data grid for every move.

## Accessibility
Provide handle labels, arrow-key movement, stable IDs, and live position announcements.

## Keyboard and touch
Pointer, touch-friendly handles, and explicit up/down controls should share one order model.

## Reduced motion and performance
Animate layout only when enabled and keep order updates controlled by the host.

## Composition and anti-patterns
Use DragReorderGrid for two-dimensional collections and SortableChips for compact tags.
