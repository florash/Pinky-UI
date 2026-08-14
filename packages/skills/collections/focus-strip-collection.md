# Focus Strip Collection

## Purpose

Use a focus strip when peer content should stay in one horizontal or vertical band while the selected item receives more width and neighbours yield it.

## Interaction anatomy

- Active and inactive items use different flex basis, not transform scale.
- Pointer, focus and tap choose the same item.
- Small screens become a touch-scroll strip with a clear active entry.

## Good for

Short studies, chapters, product capabilities and content previews.

## Avoid

Large galleries, tab panels with separate semantics or collections where equal card width is the point.

## Usage

```tsx
<FocusStripCollection
  label="Selected studies"
  orientation="horizontal"
  items={studies.map((study) => ({
    id: study.id,
    label: study.title,
    meta: study.year,
    content: <StudySummary study={study} />,
  }))}
/>
```

## Tune

Keep the strip short and give active content enough room to read. Use a vertical orientation only when the surrounding layout supports it.

## Accessibility and reduced motion

Each item is a labelled button with pressed state and touch-safe dimensions. Reduced motion changes flex basis immediately and preserves the active item.
