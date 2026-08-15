# Swipe-to-Dismiss Card Sheet

## Purpose

Swipe-to-Dismiss Card Sheet is a card-like lower surface that follows a downward drag with coordinated translation, scale and scrim response. It returns to rest when the release threshold is not met.

## Use when

- A temporary preview or short task should feel attached to the lower edge.
- Dismissal is reversible until the user crosses a clear distance.

## Interaction

Drag the handle downward. A short drag snaps back; a committed drag dismisses. Close and Escape remain visible alternatives.

## Accessibility

Give the dialog a name, provide a close button and keep all task actions as normal buttons. Do not make the drag handle the only dismissal control.

## Reduced motion

Use an immediate open, snap or dismiss state while preserving the card's content and focus path.

## Tune

- Keep the commit threshold obvious through copy and distance.
- Avoid hiding essential multi-step forms inside a dismissible card sheet.
