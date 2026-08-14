# Expandable List Row

## Purpose
Use in-place disclosure when secondary information belongs to a list or feed row. For structured table columns and record identity, use `ExpandableDataRow` instead.

## Use when
Settings, invoices, messages, or task details can be scanned progressively.

## Avoid
Replacing a complex editor or opening a modal for simple secondary content.

## Accessibility
Use a labeled button with aria-expanded and keep the revealed content in reading order.

## Keyboard and touch
The full summary control is keyboard and touch reachable.

## Reduced motion and performance
Collapse immediately under reduced motion and mount detail only when open.

## Composition and anti-patterns
Pair with RowSpotlight for comparison, not as a substitute for navigation.
