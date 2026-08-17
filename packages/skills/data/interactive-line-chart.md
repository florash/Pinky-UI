# Interactive Line Chart

## Purpose

A calm line reading surface with a snapped crosshair, direct values and keyboard point browsing — inspection without a heavy charting dependency.

## Good for

- Small, inspectable trends where the current point matters

## Avoid for

- Large analytical datasets that need zoom, multiple axes or aggregation

## Usage

```tsx
<InteractiveLineChart data={points} label="Weekly usage" />
```

## Accessibility

- The focused plot exposes a labelled reading rail and Arrow/Home/End point navigation.
- The active value is announced beside the chart; no pointer hover is required.

## Performance

- Uses one lightweight SVG and updates only the active index.
- No chart dependency or per-frame React tree is required.

Related: interactive-sparkline, data-lens.
