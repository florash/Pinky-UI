# Sortable Data Rows

## Purpose

Structured data rows can be reordered without losing their columns or keyboard path — order is part of the product model, not a decoration.

## Good for

- Small to medium tables where order is part of the product model

## Avoid for

- Huge virtualized datasets or touch-only reorder surfaces

## Usage

```tsx
<SortableDataRows columns={columns} items={rows} onReorder={setRows} />
```

## Accessibility

- Each row has a labelled reorder handle; Space grabs, arrows move and Space drops.
- Visible up/down buttons provide a touch-safe alternative to desktop drag.

## Performance

- Native drag events and discrete reorder updates avoid a pointer-frame React loop.

Related: reorderable-list, expandable-data-row.
