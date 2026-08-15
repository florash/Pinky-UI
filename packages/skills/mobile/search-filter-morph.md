# Search + Filter Morph

## Purpose

Search + Filter Morph keeps query and refinement in one compact mobile surface. Search opens first, then filter chips appear in the same context instead of sending the user to a second control layer.

## Use when

- A collection needs both text search and a small set of mutually exclusive filters.
- Refinement should remain attached to the current result context.

## Interaction

Tap Search to reveal the input, choose a filter chip and press Cancel or Escape to restore the compact row. The selected filter remains visible when the row is closed.

## Accessibility

Use a labelled input and a `group` of pressed buttons for filters. Do not encode the selected filter through colour alone.

## Reduced motion

Reveal the input and chips without reflow animation; preserve the selected filter and query.

## Tune

- Keep filters horizontally scrollable inside their own row.
- Use a single selection model unless the product genuinely needs multi-select.
