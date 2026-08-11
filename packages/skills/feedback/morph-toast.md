# Morph Toast

## Purpose
Use for short-lived notifications that need a visible stack, an optional action, and recovery without interrupting the current task.

## Use when
Saving, inviting, or completing a background action needs brief global acknowledgement.

## Avoid
Validation beside a field, continuous state, or irreversible failure that needs a durable surface.

## Accessibility
Use status/live semantics carefully, keep a Dismiss button, pause on focus/hover, and cap the stack.

## Keyboard and touch
Actions are buttons; Escape remains available through the surrounding workflow and swipe is optional.

## Reduced motion and performance
Resolve opacity/position immediately when reduced motion is active; clean timers and avoid repeated announcements.

## Composition and anti-patterns
Choose Inline Feedback or Action Undo Bar when they are closer to the cause. Do not toast every click.
