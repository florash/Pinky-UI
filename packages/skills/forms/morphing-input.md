# Morphing Input

## Purpose

Use Morphing Input when a compact value control should become a focused editor without losing the identity of the source surface.

## Interaction

Render the resting value as the entry point. On activation, keep the label and surface attached while mounting the native input. Enter or Save commits the draft; Escape restores the previous value and returns focus to the compact control.

## Usage

```tsx
<MorphingInput label="Release note" value={note} onValueChange={setNote} />
```

## Accessibility

Keep the same label and description associated with both states. Use a real input, Save button and Cancel button; never make the resting value the only editable path.

## Reduced motion

Disable layout interpolation, but keep the compact-to-editor state change, focus transfer and Escape restoration explicit.
