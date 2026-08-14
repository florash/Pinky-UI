# Unit Scrubber

## Purpose

Use Unit Scrubber for bounded design or product values where horizontal adjustment is meaningful but manual precision must remain available.

## Interaction

Drag the labelled surface to change the value, while a native number input provides direct entry and arrow-key increments. Keep the unit and bounds visible.

## Usage

```tsx
<UnitScrubber label="Radius" defaultValue={24} min={0} max={64} unit="px" />
```

## Accessibility

Never make dragging the only path. Use a real number input, clear units, bounded values and pointer-capture cleanup on up, cancel and lost capture.

## Reduced motion

Update the value without thumb travel. The number, unit and bounds remain the primary feedback.
