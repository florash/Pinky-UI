# Morph Card

## Purpose

Use Morph Card when a compact card should become its own detail view. The point
is spatial continuity: the card travels and resizes into the panel, so the user
never has to work out what became what.

## Good for

- product card to product detail
- profile card to full profile
- media card to expanded view
- feature card to explanation

## Avoid for

- destructive confirmations — use a plain, unambiguous dialog
- long forms, which deserve their own page
- content that must be linkable, since a dialog has no URL

## Recommended defaults

`maxWidth={620}` for reading, `820` for media. Always pass a meaningful `label`
— it becomes the dialog's accessible name.

Do not fake this with a crossfade between two unrelated cards. If you cannot
preserve object continuity, use a normal dialog instead; a dishonest morph is
more confusing than an honest cut.

## Accessibility

This component has the most accessibility surface in the library, and all of it
is load-bearing:

- collapsed card is a real button with `aria-expanded` and `aria-haspopup`
- expanded panel is `role="dialog"` with `aria-modal` and your `label`
- Escape closes; the scrim closes on click
- Tab is trapped inside the panel while open
- focus moves into the panel on open and returns to the card on close
- background scroll is locked while open

If you fork this component, keep every one of those. A morph without focus
restoration strands keyboard users at the top of the page.

## Performance

The shared layout animation measures both states once per transition. Do not put
dozens of Morph Cards on one screen with heavy expanded content mounted eagerly
— the expanded state renders only while open, and it should stay that way.

## Composition

The collapsed card can contain any Pinky surface. Do not nest a Morph Card
inside another Morph Card.
