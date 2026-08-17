# Sliding Mega Panel

## Purpose

`SlidingMegaPanel` keeps one mega surface open while its inner group content moves directionally. The stable frame helps users understand that they are browsing related groups rather than opening a new menu each time.

## Interaction anatomy

- **Stable frame:** the outer panel does not disappear between group changes.
- **Direction:** content enters from the side that matches the group order.
- **Group selector:** the current group remains explicit and keyboard reachable.
- **Destination list:** links are refreshed inside the same reading region.

## Live example

Open the panel, switch groups in either direction, and inspect the destination list. The frame stays in place while the relationship between groups remains visible.

## Usage

```tsx
import { SlidingMegaPanel } from "@pinky-ui/experiences";

<SlidingMegaPanel groups={groups} aria-label="Browse the archive" />;
```

## Tune

- Order groups so direction has a meaningful reading relationship.
- Keep one short description and a focused link set per group.
- Avoid using it for unrelated actions that need a command palette.

## Accessibility

Expose the current group with selected state, keep links in logical DOM order, and provide Escape plus focus restoration for the panel trigger.

## Reduced motion

Render the next group in place without directional travel. Selection, labels and links must still update immediately.
