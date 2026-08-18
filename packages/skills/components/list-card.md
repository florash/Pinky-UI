# List Card

## Purpose

A card whose body is a divided list of rows, not prose. Use when the
content is naturally items — settings, a short activity feed, recent
entries — rather than a title-plus-paragraph shape.

## Good for

- settings groups (a handful of related rows in one card)
- short, non-paginated activity feeds
- anywhere `ListCardItem[]` is a more honest description of the content
  than a single `description` string would be

## Avoid for

- long or virtualised lists — every row renders eagerly, with no
  windowing; past roughly a screen's worth of rows, reach for a real list
  component instead (`packages/systems/src/lists`) and put that inside a
  Basic Card instead of using List Card's built-in row rendering
- a single row of content — that's just Basic Card

## Recommended defaults

Always pass a `title` when the list needs context a reader wouldn't guess
from the rows alone. Leave `emptyMessage` at its default only for genuinely
low-stakes lists; for anything where "empty" might mean "still loading"
or "failed to load", pass a message that says which.

## Accessibility

- Renders a real `<ul>`/`<li>` structure — a screen reader announces the
  item count, which a `<div>`-per-row implementation wouldn't give for
  free.
- **Not** focusable as a whole and has no `onClick`/`href` prop — the
  family's focus-visible rule in `docs/card-api-conventions.md` applies to
  cards that are themselves a click target, and List Card deliberately
  isn't one. Interactivity belongs to whatever's inside each row's
  `content` — a row that needs its own click target should render its own
  button or link with its own focus-visible ring.

## Performance

All rows render on mount; there's no lazy-mount or windowing here. Fine
for the "a handful of settings rows" use case this is built for, wrong
tool for anything approaching hundreds of items.

## Composition

Pairs naturally with Basic Card in the same grid — a List Card for
"recent activity" beside a Basic Card for "plan summary" is a common
dashboard shape.
