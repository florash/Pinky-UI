# Masonry Gallery

## Purpose

Responsive columns for content of mixed heights. The workhorse of the family:
the one layout here built for volume rather than for expression.

## Good for

- photo galleries with mixed aspect ratios
- content walls, blog indexes, moodboards
- any collection large enough that per-item motion would be noise

## Avoid for

- content that must be read in strict order across columns
- small sets of three or four, where a plain grid is clearer

## How many items

Twelve to several hundred.

## Mobile

Two columns by default; one column is often better for tall content. The column
count resolves from the mobile value first, so a phone never renders a desktop
arrangement and then undoes it.

## Motion intensity

None. The layout does not animate, deliberately. Whatever you put in the columns
brings its own motion — and with a hundred items, the correct amount is usually
very little.

## Accessibility

- Renders a list; items keep their own semantics.
- Round-robin distribution keeps visual order close to DOM order.
- Safe at any size, because there is nothing to reduce.

## Performance

Items are distributed round-robin rather than height-balanced. Balancing needs
every item measured, which means a reflow once images load — the exact layout
jump this component exists to avoid.

Use `loading="lazy"` and explicit width/height on every image.

## Composes with

Spotlight Card for a light hover response across many items. Do **not** wrap
gallery items in Jelly, Tilt or Liquid at this scale: a hundred pointer-driven
surfaces is the single easiest way to make a Pinky page feel slow.
