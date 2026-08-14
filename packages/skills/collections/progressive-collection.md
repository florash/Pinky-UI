# Progressive Collection

## Purpose

Use a progressive collection when one active item should gain real layout space and context while inactive peers remain compact and scannable. It is spatial disclosure, not another accordion.

## Interaction anatomy

- The active column receives a larger grid track.
- Inactive items keep their labels and short summaries.
- Mobile becomes a readable stacked collection with one active content block.

## Good for

Capabilities, project families and curated feature collections with one current emphasis.

## Avoid

Equal comparison, huge datasets or a simple one-row disclosure.

## Usage

```tsx
<ProgressiveCollection
  label="Capabilities"
  items={capabilities.map((item) => ({
    id: item.id,
    label: item.title,
    summary: item.summary,
    content: <CapabilityDetail item={item} />,
  }))}
/>
```

## Tune

Keep the number of peers small enough for the grid to redistribute space. Do not rely on scale as the active signal.

## Accessibility and reduced motion

Use a button with pressed state for each item and keep inactive summaries readable. Reduced motion keeps the new grid allocation but removes interpolation.
