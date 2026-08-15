# Bottom Toast Stack

## Purpose

Bottom Toast Stack places short-lived feedback near the thumb and compresses multiple messages into a small lower stack. It is a mobile placement and density pattern, not a desktop toast moved down.

## Use when

- A local action needs brief, non-blocking confirmation.
- The message should remain reachable without covering the top of a reading surface.

## Interaction

Add a message, dismiss it explicitly or let it expire. The stack caps its size and the newest message remains prominent.

## Accessibility

Use a polite live region for message copy and labelled dismiss buttons. Do not put essential errors only in an auto-expiring toast.

## Reduced motion

Insert and remove messages without stack travel or scale animation.

## Tune

- Keep the stack short and the copy actionable.
- Apply bottom safe-area padding and avoid covering fixed form actions.
