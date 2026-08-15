# Contextual Bottom Bar

## Purpose

Use a contextual bottom bar when the same lower region should become selection actions after the user selects content.

## Interaction anatomy

- Navigation is the resting state.
- Selection replaces the lower job without adding a detached toolbar.
- Cancel, count and actions remain in one named region.

## Good for

Mobile collections where selection is occasional and batch actions are short.

## Avoid

Permanent action trays, long action lists or unrelated modal workflows.

## Live example

Pass a positive `selectedCount` to transform the navigation region into actions.

## Usage

```tsx
<ContextualBottomBar selectedCount={selectedCount} onClearSelection={clearSelection} />
```

## Tune

Keep two or three actions maximum, show the selected count and preserve a clear cancel path.

## Accessibility and reduced motion

Expose `navigation` and `toolbar` semantics for the active mode, label actions, and retain safe-area padding. Reduced motion changes mode without relying on a slide.
