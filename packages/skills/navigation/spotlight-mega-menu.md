# Spotlight Mega Menu

## Purpose

`SpotlightMegaMenu` places group choices beside one contextual preview. It is for navigation where a small amount of visual confirmation helps someone choose a destination, not for hiding a large sitemap behind a thumbnail wall.

## Interaction anatomy

- **Group rail:** one group is selected at a time.
- **Spotlight:** the selected group owns the contextual preview surface.
- **Links:** the next destinations remain visible beneath the preview.
- **Parity:** hover, focus and tap choose the same group.

## Live example

Open the menu and move through its sections. Use the group buttons with keyboard or pointer input; the preview and destination links update together.

## Usage

```tsx
import { SpotlightMegaMenu } from "@pinky/experiences";

<SpotlightMegaMenu groups={groups} aria-label="Explore sections" />;
```

## Tune

- Supply previews that explain the group rather than decorative filler.
- Keep the number of groups low enough for the left rail to scan.
- Make every link useful without relying on the preview.

## Accessibility

Use labelled trigger and region relationships, expose selected group state, and keep preview content supplemental. Focus must receive the same group response as hover.

## Reduced motion

Swap the selected preview immediately. The group label, selected state and links remain fully readable.
