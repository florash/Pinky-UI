# Basic Card

## Purpose

A title, an optional description, an optional footer, no pointer effect.
The default starting point for any card-shaped content — reach for a more
specific structural card (Media Card, Horizontal Card, List Card) only
once the content genuinely needs that shape, not before.

## Good for

- pricing tiers, settings summaries, plain content tiles
- anywhere the content, not the card, is supposed to be the interesting part

## Avoid for

- content whose own image or thumbnail is the point — use Media Card
- content that's naturally a list of rows rather than one block — use List Card

## Recommended defaults

Leave `shadow` at `"neutral"` — a structural card's shadow should read as
depth, not as a feature. Pass `onClick` or `href` (with `as={Link}` for
internal navigation, never a raw `href="/..."` — see
`packages/skills/patterns/touch-fallback.md`'s sibling guidance on
navigation) only when the whole card is genuinely one target; if the
footer holds its own button, the card itself usually shouldn't also be
clickable — pick one.

## Accessibility

- With no `onClick`/`href`, this is a plain `<div>` — any focus/keyboard
  behavior belongs to whatever's inside it.
- With `onClick`/`href`, it's a real focusable target with a
  `focus-visible` ring equivalent to its hover state, not the browser
  default outline (see `docs/card-api-conventions.md`).
- `title` renders as an `<h3>` — nest it inside the page's real heading
  hierarchy, don't let two cards both claim to be the only `<h3>` on the
  page if that's not true.

## Performance

No pointer tracking, no motion values, no `useEffect`. The hover state (when
clickable) is a single CSS `box-shadow` transition. Safe in any quantity.

## Composition

The family's shared shape lives in `docs/card-api-conventions.md` — read
that once, not per card.
