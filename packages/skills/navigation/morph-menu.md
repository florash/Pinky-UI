# Morph Menu

## What it does

Morph Menu turns a compact trigger into a short navigation surface with the
same object continuity as the trigger. It is Pinky’s canonical compact
navigation pattern.

## Interaction anatomy

- **Trigger:** one labelled menu button.
- **State:** closed, opening, open and closing.
- **Motion:** the trigger surface expands into the menu instead of being replaced by a card.
- **Surface:** a short ordered list of semantic links plus an explicit close action.
- **Feedback:** focus enters the menu and returns to the trigger on close.

## Good for

- Mobile headers with a small destination set.
- Sparse editorial or portfolio navigation.
- A compact index where the expanded list needs a little more room.

## Avoid for

- Permanent desktop navigation or a long information architecture.
- A native disclosure that already communicates the relationship clearly.
- Mixing it with another modal or hiding heavy media behind the trigger.

## Live example

Open the live menu above, move through its links with Tab, and close with
Escape. The links remain real links; the morph is only the handoff.

## Usage

```tsx
<MorphMenu
  trigger="Index"
  items={sections.map((section) => ({
    id: section.id,
    label: section.label,
    href: section.href,
  }))}
 />
```

## Tune

- Keep the list short enough to scan without scrolling.
- Use `maxWidth` for the reading width, not for visual drama.
- Give each item a stable label and a useful optional description.
- Keep the trigger surface and panel in the same material family.

## Accessibility

- Preserve semantic links, an accessible menu label and a visible close button.
- Escape, focus trapping, focus restoration and body-scroll handling are part of the pattern.
- Keyboard users must reach every destination without a pointer.
- Touch users get the same explicit trigger and link targets.

## Reduced motion

The menu opens and closes immediately while focus order, link semantics and
the close path remain unchanged.
