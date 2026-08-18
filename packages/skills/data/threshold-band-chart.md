# Threshold / Band Chart

## Purpose

Normal, warning and target ranges become labelled chart structure with threshold-aware reading, instead of colour bands the reader has to decode from a legend.

## Good for

- Capacity, quality or response measures with meaningful operating ranges

## Avoid for

- Arbitrary categorical data without numeric thresholds

## Usage

```tsx
<ThresholdBandChart data={latency} bands={bands} label="Response time" />
```

## Accessibility

- The active reading includes value and band name; the visible band list repeats numeric boundaries.
- Dashed threshold lines and a distinct marker keep state understandable without colour alone.

## Performance

- Bands are static SVG regions and the active point is the only changing geometry.

Related: radial-meter, interactive-line-chart.
