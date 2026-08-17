# Linked Small Multiples

## Purpose

Several compact charts share one reading position while keeping each metric's identity visible, instead of asking readers to inspect four separate tooltips.

## Good for

- Comparing several aligned metrics without building a dashboard wall

## Avoid for

- Unaligned series or charts that need independent time ranges

## Usage

```tsx
<LinkedSmallMultiples charts={metrics} label="Metric comparison" />
```

## Accessibility

- One focusable group moves the shared reading position with Arrow/Home/End.
- A direct value rail publishes every metric at the current label instead of making users inspect four tooltips.

## Performance

- Each mini chart renders one path and one marker; selection is one shared index.

Related: interactive-line-chart, comparison-chart.
