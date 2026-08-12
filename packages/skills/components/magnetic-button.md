# Magnetic Button

## What it does

Magnetic Button gives a spacious action a small pull before activation. The
button stays anchored while its surface leans toward an approaching pointer.

## Interaction anatomy

- **Trigger:** a native button with its normal label and hit area.
- **State:** proximity, hover, focus, pressed and disabled.
- **Motion:** capped spring translation; the surrounding layout never moves.
- **Surface:** the button and its optional label layer.
- **Feedback:** the same native focus and activation path remains visible.

## Good for

- A primary CTA with breathing room around it.
- A hero or landing-page action with one clear destination.
- A sparse toolbar with no competing proximity fields.

## Avoid for

- Dense button groups, tables or repeated list rows.
- Destructive actions that should feel deliberate.
- Touch-only interfaces where there is no useful approach state.

## Live example

Try the live preview above. Move close to the action, then focus it with Tab;
the button remains a button in both cases.

## Usage

```tsx
<MagneticButton strength={0.4} range={110} maxOffset={8}>
  Open the project
</MagneticButton>
```

## Tune

- `strength={0.4}` controls how much of the approach is followed.
- `range={110}` controls how far away the field begins.
- `maxOffset={8}` is the travel ceiling; keep it small enough to preserve place.
- Use `wrapperClassName` for layout and `className` for the button surface.

## Accessibility

- Keep the native button, label, disabled state and event forwarding intact.
- Focus and activation must work without a pointer.
- The hit area must not separate from the visible label.
- On coarse pointers the button keeps its ordinary touch target.

## Reduced motion

Reduced motion resolves the translation to zero while the button keeps its
focus, pressed and activation feedback.
