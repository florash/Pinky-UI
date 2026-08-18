# Empty State Card

## Purpose

A centered icon/illustration slot, title, description and a guidance
button for a content area with genuinely nothing in it yet.

## Good for

- a list, table or dashboard section with no content yet, paired with a
  clear next action

## Avoid for

- an error or failed-load state — that's Notification Card's job; empty
  and broken read very differently and shouldn't share a component
- a first-run walkthrough with multiple steps — this is a single static
  message, not a wizard

## Recommended defaults

`icon` is a bare slot, not a fixed-size chip — this component ships no
illustration of its own and doesn't constrain the caller's artwork to one
size the way Notification Card's icon chip does. Always pair it with
`action` when there's a real next step ("New project"); a description
with no action just restates that the list is empty without helping the
user do anything about it.

## Accessibility

- Not focusable as a whole; the `action` button carries its own
  accessible name.
- The `icon` slot has no built-in alt text — a caller passing an `<img>`
  or decorative SVG owns its own accessible treatment (usually
  `aria-hidden` for a purely decorative illustration).

## Performance

No pointer tracking, no motion values. Safe in any quantity.

## Composition

The family's shared shape lives in `docs/card-api-conventions.md` — read
that once, not per card.
