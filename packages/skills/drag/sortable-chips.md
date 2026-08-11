# Sortable Chips

## Purpose
Use for a compact ordered tag or filter collection with visible add/remove controls.

## Use when
Priorities, tags, filter order, or navigation customization are short and bounded.

## Avoid
Long arbitrary lists or a chip whose only removal path is a hidden gesture.

## Accessibility
Label reorder and remove buttons with the chip name and announce order changes.

## Keyboard and touch
Arrow keys and drag handles share the controlled order; add/remove are native buttons.

## Reduced motion and performance
Use simple layout movement and no per-frame React pointer updates.

## Composition and anti-patterns
Use a normal list when chip labels wrap into a dense editing surface.
