# Peek Overlay

## Purpose

Use a peek overlay when a collection item needs a short preview but the original source list should remain visible underneath it.

## Interaction anatomy

- A source item opens one shared preview surface.
- The overlay keeps the source label and a clear close path.
- Mobile can let the same surface settle into the local flow.

## Good for

Short project summaries, release notes and compact media context.

## Avoid

Long reading content, independent multi-pane workflows or content that needs a permanent sibling panel.

## Live example

Choose Project brief or Release notes to preview the source without changing collection context.

## Usage

```tsx
<PeekOverlay />
```

## Tune

Keep preview content short, reuse one surface, clamp its placement and keep the source item visually connected.

## Accessibility and reduced motion

Use labelled buttons with expanded state, a labelled preview region, Escape and an explicit close action. Touch must open by tap. Reduced motion swaps content without relying on a travel animation.
