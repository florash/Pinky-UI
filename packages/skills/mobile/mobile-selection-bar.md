# Mobile Selection Bar

## Purpose

Use a mobile selection bar when list items become batch-action sources only after an explicit selection.

## Interaction anatomy

- Each source item exposes pressed state.
- The lower action region appears after selection.
- Clear and the primary batch action stay reachable near the selection.

## Good for

Saved items, files, notes and small mobile collections.

## Avoid

Single-item actions or large datasets that need a dedicated selection model.

## Live example

Select North star or Release notes to reveal the safe-area-aware action region.

## Usage

```tsx
<MobileSelectionBar items={items} onAction={moveItems} />
```

## Tune

Keep source rows large enough for touch, show the count and make the batch action specific.

## Accessibility and reduced motion

Use `aria-pressed`, a named toolbar and visible Clear/Move labels. Reduced motion changes toolbar presence without relying on a slide.
