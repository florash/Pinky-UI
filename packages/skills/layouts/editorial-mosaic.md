# Editorial Mosaic

## Purpose

Use for a deliberately authored mix of portrait media, landscape media, text and whitespace. It is a composition grid, not an automatic masonry algorithm.

## Use when

- A portfolio or editorial index needs a lead item and supporting rhythm.
- Each item can carry an explicit span and the collection is curated.

## Avoid when

- Users need strict row comparison or an unbounded feed.
- Placement would be generated randomly.

## Hover and focus

Use the editorial preset sparingly: lift the focused item, quiet immediate neighbours and reveal supplemental metadata. Focus must receive the same treatment as pointer hover.

## Touch, motion and performance

Keep the mobile grid in DOM order and normalize spans. Reduced motion keeps the authored grid static. Prefer explicit media dimensions; the layout uses stable CSS Grid and a single active index.
