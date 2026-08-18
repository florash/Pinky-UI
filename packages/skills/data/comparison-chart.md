# Comparison Chart

## Purpose

Two aligned series reveal values, direction and the gap between them at one readable point, rather than requiring the reader to subtract two independent lines.

## Good for

- Reading a meaningful gap between two aligned measures

## Avoid for

- More than two series or unrelated categories that need a table

## Usage

```tsx
<ComparisonChart labels={labels} series={[productA, productB]} label="Product comparison" />
```

## Accessibility

- The reading rail publishes both values and a signed difference at the active label.
- Line style, marker shape, direct labels and text values reinforce series identity beyond colour.

## Performance

- Two SVG paths and one local active index keep comparison updates bounded.

Related: interactive-line-chart, comparison-bars.
