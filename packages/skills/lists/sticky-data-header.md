# Sticky Data Header

## Purpose
Use a small sticky context row for a scrolling list or table.

## Use when
Column labels would otherwise disappear while comparing rows.

## Avoid
Building a full data-grid or changing column widths while the header sticks.

## Accessibility
Use real table/list semantics supplied by the host and preserve reading order.

## Keyboard and touch
Scrolling remains native; no pointer interaction is required.

## Reduced motion and performance
Prefer CSS sticky and a subtle shadow over scroll event state.

## Composition and anti-patterns
Pair with RowSpotlight for context and a real table when sorting/filtering is needed.
