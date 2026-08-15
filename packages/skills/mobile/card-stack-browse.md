# Card Stack Browse

## Purpose

Card Stack Browse uses a small layered collection for sequential exploration. Drag distance moves the current card while the next card remains visible, so the interaction feels editorial rather than like a binary swipe decision.

## Use when

- A short collection benefits from one clear current item and a visible next item.
- Previous and next browsing are both meaningful.

## Interaction

Drag the top card past its threshold or use Previous/Next and Arrow keys. A short drag snaps back to the current card.

## Accessibility

Make the active card focusable and provide labelled Previous/Next buttons. The current label and description should be announced as the index changes.

## Reduced motion

Replace card travel and rotation with an immediate item swap while keeping the next-card relationship in text.

## Tune

- Keep the stack to a few items.
- Never make the gesture the only way to move through content.
