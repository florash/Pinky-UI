# Mobile Undo Bar

## Purpose

Mobile Undo Bar keeps a reversible action close to the list that changed. The item closes its gap, while a lower action surface restores the exact object before the recovery window expires.

## Use when

- A list action is reversible for a short time.
- Restoring the object's original position matters.

## Interaction

Archive an item, press Undo or let the recovery surface expire. The result remains written beside the action.

## Accessibility

Announce the archive state politely and expose Undo as a normal button with a clear label. Do not require a swipe to recover content.

## Reduced motion

Remove and restore the row immediately while preserving the same order and announcement.

## Tune

- Give users enough time to find Undo.
- Use a durable confirmation for irreversible actions instead.
