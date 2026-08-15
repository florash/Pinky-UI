# Cursor Action Surface

## Purpose

Use a cursor action surface when a bounded source area benefits from lightweight actions that follow pointer intent and can be pinned for touch.

## Interaction anatomy

- Pointer movement selects a source and positions one action surface.
- Focus selects the same source for keyboard users.
- Tap pins the actions so no hover state is required.

## Good for

Canvas-like workspaces, visual studies and spatial source areas.

## Avoid

Essential controls, dense forms or actions that must be visible at rest.

## Live example

Move across Surface, Image and Note; tap to pin the action surface on touch.

## Usage

```tsx
<CursorActionSurface />
```

## Tune

Keep the action set short, clamp the surface, use a stable reading offset and make the pinned state visually explicit.

## Accessibility and reduced motion

Every source needs a focusable button path and visible labels. Touch uses tap-to-pin, not hover simulation. Reduced motion removes the follow animation while keeping source selection and pinning available.
