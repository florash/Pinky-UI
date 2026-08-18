# Chart ↔ Table View

## Purpose

One dataset moves between an inspectable chart and a semantic table without losing selection context — the same row stays selected across both modes.

## Good for

- Product metrics where visual pattern and exact row reading both matter

## Avoid for

- Decorative charts with no underlying inspectable values

## Usage

```tsx
<ChartTableView data={points} label="Weekly usage" />
```

## Accessibility

- Table mode uses real caption, headers, row headers and keyboard-selectable rows.
- Chart and table preserve the same selected point; mobile users get the table as a first-class reading mode, not a fallback.

## Performance

- Chart and table share data and mount only the selected view; no duplicate chart state is required.

Related: interactive-line-chart, data-lens.
