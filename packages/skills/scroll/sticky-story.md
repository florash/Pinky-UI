# Sticky Story

## What it does

Sticky Story pairs a sticky supplemental visual with a normal-flow sequence of
story steps. The reader moves through the content; the visual changes quietly
to match the active step.

## Interaction anatomy

- **Trigger:** normal document scroll, not a captured scroll takeover.
- **State:** current step, visual transition and compact/touch layout.
- **Motion:** a short crossfade/scale between supplied visuals.
- **Surface:** one sticky visual column and readable step content.
- **Feedback:** headings and descriptions remain the source of meaning.

## Good for

- A three-to-five-step product explanation.
- Feature narratives and portfolio case studies.
- Stories where the visual can clarify but not replace the text.

## Avoid for

- Short lists, critical forms or content that must be compared at once.
- A narrative that only makes sense if the visual keeps moving.
- A page where sticky overflow would trap zoomed or keyboard content.

## Live example

Scroll the bounded live story above. On a narrow viewport the same steps return
to a readable stack with each visual beside its own copy.

## Usage

```tsx
<StickyStory
  steps={steps}
  top={24}
  visualClassName="min-h-80"
  contentClassName="max-w-xl"
/>
```

## Tune

- Keep the story to roughly `3–5` steps.
- Choose a `top` offset that stays below the site header and never hides focus.
- Give each step enough content height to make the relationship legible.
- Use low-contrast visual transitions; the copy should carry the rhythm.

## Accessibility

- Keep steps and headings in document order with real text semantics.
- The visual is supplemental and must not be the only way to understand a step.
- Test keyboard reading, zoom, focus visibility and sticky overflow boundaries.
- Touch layouts use ordinary flow; no swipe or pinned gesture is required.

## Reduced motion

Reduced motion removes visual crossfades while the active step, text order and
compact stack remain understandable and usable.
