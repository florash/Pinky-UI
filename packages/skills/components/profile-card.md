# Profile Card

## Purpose

Avatar, name, subtitle, a tag group, and an optional action region — a
person or entity, not a document. The avatar has three states in priority
order: `avatarSrc` (a real photo), `initials` (a plain circle with one or
two letters), and — when neither is given — a generic silhouette. Never a
broken-image icon.

## Good for

- team member tiles, author bylines, search results for people
- anywhere the identity (who) matters as much as the content

## Avoid for

- dense rows of many people at once — use List Card or Horizontal Card,
  Profile Card's spacing assumes a handful per screen, not fifty
- content whose subject isn't a person or named entity — Basic Card

## Recommended defaults

Pass `tags` for skills/roles/topics — they overflow into a single `+N`
pill past `maxTags` (default 3) rather than wrapping into a second and
third row. If `actions` holds its own button and the whole card is also
meant to link to the profile, pick one: don't make both the card and an
inner button separately clickable, the same rule Basic Card's skill doc
gives for its `footer`.

## Accessibility

- With no `onClick`/`href`, this is a plain `<div>` — any focus/keyboard
  behavior belongs to whatever's inside it.
- With `onClick`/`href`, it's a real focusable target with a
  `focus-visible` ring equivalent to its hover state (see
  `docs/card-api-conventions.md`).
- The avatar's `alt` text comes from `avatarAlt`; initials and the
  fallback silhouette are `aria-hidden` — the adjacent name text already
  carries the identity, so a screen reader shouldn't hear it twice.

## Performance

No pointer tracking, no motion values. The hover state (when clickable) is
a single CSS `box-shadow` transition. Safe in any quantity.

## Composition

The family's shared shape lives in `docs/card-api-conventions.md` — read
that once, not per card.
