# Action Undo Bar

## Purpose
Use after a reversible action when the user needs a short recovery window.

## Use when
Archive, remove, or move actions can be safely reversed without hiding the affected object.

## Avoid
Destructive actions with no reliable undo, or a countdown that creates unnecessary pressure.

## Accessibility
Announce the action once, focus the Undo control only when appropriate, and make expiry understandable.

## Keyboard and touch
Undo is a real button; do not require swipe or timing precision.

## Reduced motion and performance
Do not animate the countdown continuously; clean expiry timers on unmount.

## Composition and anti-patterns
Use Inline Feedback for a local save and Toast for a message that is not reversible.
