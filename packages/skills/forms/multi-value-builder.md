# Multi-Value Builder

## Purpose

Use Multi-Value Builder when a user composes structured conditions such as property, operator and value rather than entering a flat list of tokens.

## Interaction

Keep each condition in one readable row. Add a condition to extend the set; use native selects and a text field for the parts; allow each extra row to be removed without losing the remaining conditions.

## Usage

```tsx
<MultiValueBuilder conditions={conditions} onConditionsChange={setConditions} />
```

## Accessibility

Give every property, operator and value a label, and repeat the Where/And relationship in text. Add and remove actions must be keyboard reachable.

## Reduced motion

Insert and remove rows without animated reflow. Keep the row order and condition language explicit.
