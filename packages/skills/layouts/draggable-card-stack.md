# Draggable Card Stack

## Purpose

A deck whose top card can be thrown away, for reviewing things one at a time.

## Good for

- reviewing items in sequence
- onboarding sequences and tips
- playful browsing of a small set

## Avoid for

- content users need to compare or come back to
- anything important enough that an accidental dismissal would matter
- long lists — dragging through fifty cards is a chore, not a feature

## How many items

Three to twenty.

## Mobile

Where it works best; the gesture is native to touch. Keep the buttons visible
anyway — they are not a fallback, they are the primary interface for everyone
who does not drag.

## Motion intensity

`threshold={110}` and `rotation={12}` are tuned so a decisive flick dismisses
and a hesitant one springs back. Lowering the threshold much below 80 makes
accidental dismissals common.

## Accessibility

**Drag is never the only way through.** The previous/next buttons do everything
the gesture does, dismissals are announced through a polite live region, and
cards keep their own focus order. If you set `controls={false}`, you must supply
your own equivalent controls — a drag-only component is one some people simply
cannot use.

## Performance

Three cards render at a time regardless of deck size. Dragging runs on transform
motion values with no React state per frame.

## Composes with

Any card. Jelly Card is fine here because only one card is interactive at a
time — this is one of the few places a heavier surface is affordable.
