# Notification Card

## Purpose

Icon + title + description + optional close button + optional actions,
in four semantic states (`info`/`success`/`warning`/`error`).

## The four-state, three-hue tension

Pinky's palette has exactly three hues — warm white, soft pink, milk blue
— and this component has four states to express, so hue can't be the
only signal for any of them. `info` and `success` sit on the cool/neutral
side of the palette (cloud tints) and were never in tension with each
other. `warning` and `error` both want the palette's one "something needs
attention" hue (blush/pink), so hue alone can't tell them apart — the
component resolves that with two more signals stacked on top: a distinct
icon shape (triangle-exclamation vs. circle-x) and border weight
(warning's is a hairline, error's is visibly heavier, `border-2`). Don't
"fix" this by giving error a fourth hue — that was the option this
component's design explicitly ruled out.

## Good for

- inline feedback after an action, form-level errors, status banners

## Avoid for

- a transient toast that should disappear on its own — this component has
  no auto-dismiss timer, `onDismiss` only renders a close button and
  reports the click

## Recommended defaults

Don't rely on `variant`'s colour alone in your own copy either — `title`
should still say what happened ("Changes saved", not just a green dot).
Pass `onDismiss` only when the notification is genuinely dismissible;
omitting it removes the close button entirely rather than rendering a
disabled one.

## Accessibility

- `role="alert"` for `warning`/`error`, `role="status"` for
  `info`/`success` — matches how urgently assistive tech should announce
  each.
- Every variant has both an icon and a text `title`; nothing here is
  colour-only.

## Performance

No pointer tracking, no motion values. The dismiss button's hover is a
colour/opacity change only.

## Composition

The family's shared shape lives in `docs/card-api-conventions.md` — read
that once, not per card.
