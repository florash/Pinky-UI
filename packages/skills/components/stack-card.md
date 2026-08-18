# Stack Card

## Purpose

A single card with 1–3 decorative layers peeking out behind it, fanning
slightly wider on hover — a static illusion of depth for one piece of
content, not a browsing widget.

## Good for

- a single piece of content that should visually imply there's more
  behind it — a saved-searches tile, a folder, a "3 more like this" card

## Avoid for

- an actual stack of many distinct cards a user pages through — that's
  `DraggableCardStack` or `CardStackBrowse` in `packages/systems`, real
  browsing widgets with drag/paging behavior this component deliberately
  doesn't have. Reach for those when there's a stack of *content* to get
  through; reach for this one when a single piece of content just wants
  to look like it has some behind it.

## Recommended defaults

`depth={2}` reads as "a few more of these" without the layers becoming
distracting; `depth={3}` is the most pronounced version and starts
competing with the face card's own content if used often on one page.

## Accessibility

- Same focus-visible rule as Basic Card once `onClick`/`href` is present.
- The decorative layers are `aria-hidden` — they carry no content of
  their own, so there's nothing for assistive tech to announce.

## Performance

The fan-out on hover is `motion-safe:`-scoped; under
`prefers-reduced-motion: reduce` the layers stay at their rest offset
rather than animating outward.

## Composition

The family's shared shape lives in `docs/card-api-conventions.md` — read
that once, not per card.
