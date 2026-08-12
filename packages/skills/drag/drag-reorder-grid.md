# Drag Reorder Grid

## Purpose
Use for controlled two-dimensional panels whose positions can be customized.

## Use when
Dashboards, app launchers, or panel layouts have meaningful user order.

## Avoid
Large collections where full-list layout animation is expensive or order has no value.

## Accessibility
Provide handle labels, arrow movement, live announcements, and stable item identity.

## Keyboard and touch
Dragging is implemented with the native HTML5 drag-and-drop API, which does **not** fire on touch
input. On touch devices there is no drag path at all, so the arrow-key handle is the only way to
reorder — treat it as the primary interaction and always render a visible move control beside it.
This differs from `Reorderable List` and `Sortable Chips`, which use Motion's `Reorder` and do
support touch dragging.

## Reduced motion and performance
Use transform/layout animation sparingly and avoid per-pointer React state.

## Composition and anti-patterns
Use DropIndicator and DragGhost only as parts of an actual drag interaction.
