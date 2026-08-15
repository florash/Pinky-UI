# Edge Docked Panel

## Purpose

Use an edge docked panel when nearby context needs more room but should make space beside its source instead of covering the viewport.

## Interaction anatomy

- The source remains the primary content surface.
- A panel docks beside it on wide screens.
- The same panel becomes an inline continuation on touch.

## Good for

Workspace context, compact inspection and adjacent product controls.

## Avoid

Transient one-line help, primary navigation or viewport-level drawers.

## Live example

Open the panel to see the source grid make room on desktop and stack on mobile.

## Usage

```tsx
<EdgeDockedPanel />
```

## Tune

Set a readable panel width, preserve source hierarchy, use a safe mobile order and keep the panel content short enough to scan.

## Accessibility and reduced motion

Expose expanded state and a labelled region, keep Close/Done reachable, and do not hide the source from the reading order. Reduced motion changes layout immediately.
