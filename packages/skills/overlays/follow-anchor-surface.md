# Follow Anchor Surface

## Purpose

Use a follow anchor surface when a source can move and its context must remain spatially attached rather than staying at the original coordinate.

## Interaction anatomy

- The anchor has a bounded position.
- The context follows its current position and is clamped inside the stage.
- Keyboard arrow controls provide a touch-safe movement path.

## Good for

Canvas objects, maps, spatial editors and movable media sources.

## Avoid

Static forms, ordinary help copy or a simple tooltip relationship.

## Live example

Move the anchor with the arrow controls and watch its context travel with it.

## Usage

```tsx
<FollowAnchorSurface />
```

## Tune

Clamp the context, keep a readable gap, define the movement step and switch to an inline relationship when the stage becomes narrow.

## Accessibility and reduced motion

Provide labelled movement buttons and a live position summary; do not make drag the only input. Reduced motion removes travel interpolation while the context still follows state.
