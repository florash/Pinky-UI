# Resumable Progress

## Purpose
Preserve the known position of a long operation across an interruption so the user can resume instead of restarting.

## Use when
Imports, uploads or processing jobs can pause, lose connection or be intentionally interrupted without invalidating their partial work.

## Avoid
Displaying a stale percentage as if work is active, restarting from zero without explanation, or pretending resumability when the backend cannot continue.

## Accessibility
State paused, running and complete in text, expose determinate progress when valid, and label Resume with the operation name.

## Keyboard and touch
Resume and restart are native buttons. Keep the progress and next action visible when the control stacks at 390px.

## Reduced motion and performance
Keep the saved progress static when motion is reduced. Store progress in the host when persistence matters and clean any active work on unmount.

## Composition and anti-patterns
Use Background Task Row for a persistent task that cannot be paused. Resumable Progress is defined by retaining an interrupted position.
