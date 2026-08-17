# Progressive Mosaic

## Purpose

A stable collection composition that gives the focused tile more room and
reorganises its neighbours — without becoming an expansion panel. The
collection stays a mosaic; nothing pops out of flow.

## Good for

- Curated research, reference walls and content where interest should gently
  reweight the composition

## Avoid for

- Data-heavy dashboards
- Interactions that need a persistent detail panel — use Expandable Bento

## How many items

Four to fourteen tiles; keep the collection curated enough for neighbours to
matter.

## Mobile

The active tile spans the compact two-column rhythm while neighbours remain
available and touch-sized.

## Motion intensity

Moderate. Motion layout interpolates bounded grid changes with no
measurement loop; dense flow and a single active id avoid empty slots.

## Accessibility

- Tiles are native buttons with pressed state and stable DOM order.
- Arrow, Home and End keys move focus through the collection.
- The active role is communicated by state, never by size alone.

## Composes with

Editorial Mosaic for an authored version of the same idea; Asymmetric
Editorial Grid when the hierarchy should be fixed rather than reweighted by
interaction.
