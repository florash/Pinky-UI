# Async Button

## Purpose
Use an action button that reports idle, loading, success, and error while preserving its width.

## Use when
Save, submit, invite, or retry has a short asynchronous lifecycle.

## Avoid
Disabling the only recovery path or implying success before the callback resolves.

## Accessibility
Expose busy state, keep the label meaningful, and provide error recovery.

## Keyboard and touch
Use a native button and preserve Enter/Space activation with a clear touch target.

## Reduced motion and performance
PressSpring resolves immediately when needed; callbacks and timers must not survive unmount.

## Composition and anti-patterns
Use Inline Feedback for detailed validation and CircularProgressMorph for separate background work.
