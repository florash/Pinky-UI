# Context Menu Surface

## Purpose

Use a context menu surface when actions belong to a specific object and should appear from an explicit contextual gesture rather than occupy permanent space.

## Interaction anatomy

- The source supports an ordinary open action and a secondary context-menu gesture.
- Actions are positioned inside the source boundary.
- Escape and outside press close the action region.

## Good for

Canvas objects, collection items and document-specific actions.

## Avoid

Primary navigation, hidden essential controls or large menus with independent navigation.

## Live example

Open actions or right-click the bounded document surface.

## Usage

```tsx
<ContextMenuSurface />
```

## Tune

Keep the action count small, clamp the pointer position, provide a visible trigger, and avoid destructive actions without a clear label.

## Accessibility and reduced motion

The explicit trigger is the keyboard and touch fallback; do not make right-click the only path. Keep action labels visible and use Escape to dismiss. Reduced motion keeps the action region in place.
