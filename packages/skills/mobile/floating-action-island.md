# Floating Action Island

## Purpose

Use a floating action island when a compact create trigger should reveal a small local set of actions without occupying a full toolbar.

## Interaction anatomy

- The closed island is a single, familiar target.
- Open actions stay attached to the same object.
- Scrolling can contract the closed state while expansion remains explicit.

## Good for

Creation flows with two or three nearby actions.

## Avoid

Primary navigation, long action menus or actions that must always be visible.

## Live example

Open Create to reveal New note and New collection.

## Usage

```tsx
<FloatingActionIsland label="Create" actions={actions} />
```

## Tune

Keep the action set short, preserve a 44px target and never let the closed island hide essential navigation.

## Accessibility and reduced motion

Expose `aria-expanded` and a changing accessible label, and keep actions as buttons. Reduced motion preserves the attached row without width interpolation.
