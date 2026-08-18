# Expandable Data Row

## Purpose

A structured row opens its detail surface in place while preserving identity and nearby values — the row does not become a modal detour.

## Good for

- Tables that need a focused secondary view without abandoning scan context

## Avoid for

- Dense financial tables where every cell must stay visible at once

## Usage

```tsx
<ExpandableDataRow row={row} columns={["Owner", "Status"]} />
```

## Accessibility

- The complete row is one labelled disclosure button and exposes aria-expanded and a named detail region.
- Detail content remains in the document flow instead of requiring a modal detour.

## Performance

- Only the opened detail region mounts; row identity stays stable for quiet updates.

Related: expandable-list-row, selection-tray.
