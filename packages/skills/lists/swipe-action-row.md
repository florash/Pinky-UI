# Swipe Action Row

## Purpose
Use a mobile row gesture to reveal secondary actions without hiding those actions from other users.

## Use when
Archive, delete, or more actions are frequent and row density matters.

## Avoid
Critical actions that require a hidden swipe or destructive action without confirmation.

## Accessibility
Keep an explicit actions button, label destructive actions, and preserve row semantics.

## Keyboard and touch
Swipe has a threshold and snap-back; buttons provide the keyboard and desktop path.

## Reduced motion and performance
Use transform animation and snap immediately under reduced motion.

## Composition and anti-patterns
Use Action Undo Bar after reversible archive/delete and keep content independently actionable.
