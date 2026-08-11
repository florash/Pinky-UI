# Expandable Bento

## Purpose

A bento grid whose tiles expand where they are, reflowing their neighbours
instead of opening a modal.

## Good for

- feature overviews where some items deserve more room
- dashboards of summaries that can each open a little further
- marketing sections that would otherwise reach for a dialog

## Avoid for

- detail content long enough to deserve its own page
- grids where more than one item should be open at once

## How many items

Four to nine tiles. Past that the bento stops being a composition and becomes a
grid with uneven cells.

## Mobile

One or two columns, where expansion behaves like an accordion — which is the
right pattern at that width, not a compromise.

## Motion intensity

Layout animation only, on the `soft` spring. Do not add per-tile pointer motion
on top; the tiles are already moving whenever one opens.

## Accessibility

This is the layout's strongest argument over a modal:

- tiles are buttons with `aria-expanded` and `aria-controls`
- expansion happens in place, so reading order and focus order never change
- Escape collapses and returns focus to the tile that opened
- a visible Collapse button gives pointer users the same exit

## Performance

Detail content mounts only while expanded. One layout animation per change.

## Composes with

Plain surfaces. The tiles supply their own card styling, so nesting another
Pinky card inside usually means two competing borders and shadows.
