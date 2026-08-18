# Pricing Card

## Purpose

Price, period, a feature list and a CTA, with an opt-in `highlight` state
for the recommended tier. `highlight` reuses the family's existing pink
accent (`shadow="pink"`'s token pair, `blush-*` background/border) rather
than introducing a new hue — see `docs/card-api-conventions.md`'s `shadow`
prop note for why the accent pair exists at all.

## Good for

- pricing tables, plan comparisons — a row of these side by side, one
  with `highlight`

## Avoid for

- a single plan shown with no comparison context — Basic Card is simpler
  and doesn't carry pricing-specific structure you won't use

## Recommended defaults

Exactly one card in a comparison row should have `highlight` — it's meant
to draw the eye to the recommended tier, not to be a per-card toggle every
tier gets. `features` takes a plain array of nodes and renders each with a
checkmark; it isn't a place to also encode "not included" items — a
missing feature is the absence of a row, not a struck-through one (that
distinction usually reads clearer as prose in `description` instead, e.g.
"everything in Starter, plus...").

## Accessibility

- With no `onClick`/`href`, this is a plain `<div>` — any focus/keyboard
  behavior belongs to the `footer` CTA button itself, which is the far
  more common case (see Basic Card's skill doc for the same "pick one"
  reasoning if you're tempted to make the whole card clickable too).
- The "Recommended" badge is real text, not a colour swatch — it reads
  the same with or without the pink accent.

## Performance

No pointer tracking, no motion values. The hover state (when clickable)
is a single CSS `box-shadow` transition. Safe in any quantity.

## Composition

The family's shared shape lives in `docs/card-api-conventions.md` — read
that once, not per card.
