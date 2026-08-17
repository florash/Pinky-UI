# Elastic Columns

## Purpose

Columns reallocate real grid width around the selected content while their
neighbours remain present — the width change is the grid template itself,
not a per-column scale transform.

## Good for

- Feature comparisons, chapter groups and short sets of related panels

## Avoid for

- Strictly equal comparison tables
- More than five independent columns, where the width change stops being
  legible

## How many items

Three to five columns.

## Mobile

The active column shows its content in full; inactive columns become
compact disclosure rows.

## Motion intensity

Moderate, and bounded to one axis. The parent grid changes a single template
string, so columns don't scale individually — inactive compact content is
hidden rather than squeezed into a shrinking panel.

## Accessibility

- Headers are native buttons with `aria-expanded` on compact layouts.
- Arrow, Home and End keys change the selected column.
- Content stays available through more than pointer-driven width change.

## Composes with

Focus Rail for a primary/secondary reading pattern instead of side-by-side
columns; Floating Columns when the columns should scroll independently
rather than reallocate width.
