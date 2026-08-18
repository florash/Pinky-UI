# Horizontal Card

## Purpose

Media on the left, text on the right, above `stackBelow`; media stacks on
top of full-width text below it. For content where the media is an
accent — a thumbnail, an avatar — not the main event.

## Good for

- profile rows, author bylines
- search results with a thumbnail
- list items that need a small image beside a meaningful amount of text

## Avoid for

- content where the image should dominate — use Media Card
- very narrow containers below `stackBelow`'s breakpoint with a lot of
  text — verify the stacked layout still reads well; this is the same
  "compressed into a column too narrow for its content" shape that broke
  the mobile nav panel once already, so check it at your actual narrowest
  real viewport, not just in principle

## Recommended defaults

`stackBelow="sm"` is right for most uses — a genuinely narrow column
(a sidebar, a mobile drawer) should almost always get the stacked layout,
not a squeezed row. Raise it to `"md"` only when the row layout has
genuinely been tested to hold up at tablet width with real content, not
placeholder text.

## Accessibility

Same `focus-visible` rule as Basic Card once `onClick`/`href` is present.
No `alt` text is supplied automatically — same responsibility as Media
Card's media slot.

## Performance

No pointer tracking. The stack/row switch is a plain CSS breakpoint, not a
`ResizeObserver` or JS-measured layout — free at render time regardless of
how many cards are on screen.

## Composition

The natural shape for a results list or a settings-style row list. If
every row needs the same interactive affordance (a chevron, a swipe
action), that belongs inside `footer` or the content itself — Horizontal
Card doesn't reserve a dedicated slot for it, to keep the prop surface
small; see `docs/card-api-conventions.md`'s slot-naming guidance before
inventing a new prop for it.
