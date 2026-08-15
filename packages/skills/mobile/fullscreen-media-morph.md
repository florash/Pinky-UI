# Fullscreen Media Morph

## Purpose

Fullscreen Media Morph lets a thumbnail become the focused media surface and return to its source. The transition preserves identity and focus instead of opening an unrelated phone or hardware mockup.

## Use when

- A media item needs a larger inspection state on touch.
- Closing should return to the same collection position.

## Interaction

Tap a thumbnail, inspect the enlarged frame and close with the visible button or Escape. The trigger receives focus again after close.

## Accessibility

Use a labelled modal dialog, a close button and meaningful media text. Keep the thumbnail label available before and after expansion.

## Reduced motion

Open and close as immediate state changes while preserving the same media content and focus restoration.

## Tune

- Keep controls out of the media's readable center.
- Use real media dimensions and loading states in production.
