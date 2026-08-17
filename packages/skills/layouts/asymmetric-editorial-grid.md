# Asymmetric Editorial Grid

## Purpose

An authored editorial rhythm where featured work earns space and supporting
pieces keep the composition breathing — hierarchy by intent, not by a uniform
grid.

## Good for

- Editorial indexes, portfolios and campaign landings
- Small collections where one piece needs a clear lead

## Avoid for

- Dense comparison tables or unbounded feeds
- Collections where every item must have equal visual weight

## How many items

Four to sixteen; reserve featured treatment for one or two pieces.

## Mobile

The lead item spans the compact grid while supporting items keep a
two-column rhythm — the composition does not collapse into a single-width
feed.

## Motion intensity

Low. A single active id drives local emphasis rather than pointer-frame
React renders; placement itself is plain CSS Grid with no measurement pass.

## Accessibility

- Items stay in input order even when spans create whitespace.
- Hover and focus share the same local emphasis.
- Labels remain visible without pointer interaction.

## Composes with

Editorial Mosaic and Broken / Offset Grid for related editorial rhythms;
Masonry Gallery when the collection outgrows a curated, authored layout.
