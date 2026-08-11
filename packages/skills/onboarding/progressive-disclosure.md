# Progressive Disclosure

## Purpose
Use to keep advanced options out of the primary path until the user requests them.

## Use when
Settings have a clear basic workflow and a smaller expert layer.

## Avoid
Hiding essential errors, permissions, or required controls behind an unlabeled toggle.

## Accessibility
Use a labeled button with aria-expanded and keep revealed controls in the DOM order.

## Keyboard and touch
The reveal control is a native button with a generous touch target.

## Reduced motion and performance
Collapse/expand immediately when requested and mount expensive detail only when open.

## Composition and anti-patterns
Use ExpandableListRow for row details; this pattern is about product complexity, not a generic accordion.
