# Stat Card

## Purpose

A headline number with a label, an optional up/down/flat trend, and a
slot for a mini trend chart it doesn't draw itself. `value` renders with
tabular figures (`tabular-nums`) so the digits don't reflow width as the
number updates in place.

## Good for

- dashboards, KPI rows, anywhere a single tracked number is the point

## Avoid for

- several related metrics that need to be compared side by side in one
  chart — reach for a systems chart component instead, Stat Card is one
  number, not a plot
- a number that's genuinely part of a sentence — that's just text, not a
  card

## Recommended defaults

Always pair `trend` with a real `label` (e.g. `"12.4% this week"`), never
just a direction with no text — the arrow glyph alone isn't a substitute
for the number, and colour is never the only signal either: this
component doesn't tint the trend text by direction on purpose, so it
reads identically for colour-blind users. If you want a chart, keep it
small and pass it through `chart`; this component only reserves the slot.

## Accessibility

- Not focusable as a whole — a stat is something a page shows, not
  something it navigates from.
- Trend direction is carried by the arrow glyph's shape (up/down/a flat
  dash) and by `label`'s own text together, never by colour alone.

## Performance

No pointer tracking, no motion values, no `useEffect`. Safe in any
quantity, including a grid of many stat cards on one dashboard.

## Composition

The family's shared shape lives in `docs/card-api-conventions.md` — read
that once, not per card. Stat Card is deliberately the one structural
card without `as`/`href` — see that document for which cards get the
polymorphism escape hatch and why.
