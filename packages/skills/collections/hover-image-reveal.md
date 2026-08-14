# Hover Image Reveal

## Purpose

Use a minimal editorial list when text should stay primary and one fixed media viewport should reveal the item under pointer or focus. It is a browsing composition, not a grid of image cards.

## Interaction anatomy

- The ordered text list remains visible and readable at rest.
- Hover or focus changes one shared media region.
- On mobile, tapping a row reveals the same media inline below that row.

## Good for

Fashion, design, portfolio and publication indexes where images add atmosphere or recognition.

## Avoid

Commerce comparison, simultaneous image inspection or lists where every image is essential to the decision.

## Usage

```tsx
<HoverImageReveal
  label="Selected work"
  items={work.map((item) => ({
    id: item.id,
    label: item.title,
    meta: item.year,
    media: <img src={item.image} alt="" />,
  }))}
/>
```

## Tune

Use one shared viewport, short labels and fixed media geometry. Let the image support the row instead of making the row wait for a decode.

## Accessibility and reduced motion

Rows are buttons with `aria-pressed`; focus activates the same state as hover. Keep meaningful text outside the image. Reduced motion swaps the media immediately and preserves the active row.
