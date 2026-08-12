# Magnetic Cursor Target

## What it does

Magnetic Cursor Target composes one proximity field with one semantic cursor
target. It can pull the target, claim a cursor label, or do both without
inventing a second attraction algorithm.

## Interaction anatomy

- **Trigger:** a meaningful link, button or compact action region.
- **State:** idle, nearby, hovered, focused and disabled.
- **Motion:** short spring translation with a hard travel cap.
- **Surface:** the target remains the visible control; cursor claims are contextual.
- **Feedback:** focus and the cursor label describe the same action.

## Good for

- One primary CTA with space around it.
- A project card or compact action cluster.
- An intentional cursor vocabulary on a portfolio surface.

## Avoid for

- Large lists, text inputs, disabled controls or exact-position UI.
- A page where every control competes for the cursor.
- Replacing a visible label or focus style with a cursor-only cue.

## Live example

Approach the live target above, then focus it with Tab. Fine pointers get a
small pull; touch and keyboard keep a normal actionable control.

## Usage

```tsx
<CursorProvider>
  <MagneticCursorTarget label="Open" influence="both">
    <a href="/work/project">Open project</a>
  </MagneticCursorTarget>
</CursorProvider>
```

## Tune

- Keep `maxOffset` around `4–8px` so the target stays anchored.
- Keep `range` short; a nearby relationship is more legible than a page-wide field.
- Use `influence="cursor"` when the target must stay geometrically exact.
- Use a short, action-based `label` such as `Open` or `View`.

## Accessibility

- The wrapper never replaces the native link or button.
- Cursor claims also occur on focus so keyboard users receive equivalent state.
- Keep a visible focus style and a usable touch target.
- Coarse pointers and disabled states must remain calm and functional.

## Reduced motion

Reduced motion disables translation and cursor scaling while preserving the
native action, focus state and any semantic label.
