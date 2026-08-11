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
Pointer/touch drag is optional acceleration; directional buttons or keys are required.

## Reduced motion and performance
Use transform/layout animation sparingly and avoid per-pointer React state.

## Composition and anti-patterns
Use DropIndicator and DragGhost only as parts of an actual drag interaction.
