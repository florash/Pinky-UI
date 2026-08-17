# Range Brush Chart

## Purpose

An overview and a focused chart share one selected window with draggable and keyboard-adjustable bounds, so zooming stays connected to the whole history.

## Good for

- Short histories where overview context and local inspection belong together

## Avoid for

- Unbounded time-series analysis or dense financial tooling

## Usage

```tsx
<RangeBrushChart data={history} label="Usage history" />
```

## Accessibility

- Start and end handles are real labelled range inputs with a visible Reset range action.
- The selected window and current value remain readable when motion is reduced.

## Performance

- The overview and focus use deterministic SVG geometry; no external chart engine is required.
- Pointer updates stay local to the brush and focused chart.

Related: timeline-scrubber, interactive-line-chart.
