# Interactive Bar Ranking

## Purpose

Ranked rows can change metric and order while each item keeps its spatial identity and value — reordering is a layout animation, not a redraw.

## Good for

- Small ranked sets where sorting is part of the reading task

## Avoid for

- Large tables that need pagination, filtering or virtualization

## Usage

```tsx
<InteractiveBarRanking items={items} metrics={metrics} label="Campaign ranking" />
```

## Accessibility

- Metric and sort controls are semantic buttons; each ranked row exposes rank, label and value.
- Bars are paired with numbers and order, so colour is not the only signal.

## Performance

- Layout motion is limited to discrete reorder events; reduced motion switches directly to the new order.

Related: comparison-bars, selection-tray.
