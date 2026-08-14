# Multi-Step Progress

## Purpose
Use for a compact visual progress view whose completed, current, upcoming, and error steps matter. For a product workflow that keeps the active decision open and completed context editable, use `ProgressiveStepWorkflow` instead.

## Use when
Checkout, setup, onboarding, or upload pipelines have a meaningful sequence.

## Avoid
Long navigation paths where a simple progress bar is clearer.

## Accessibility
Expose the current step and error state in text, not only color or position.

## Keyboard and touch
If steps are navigable, use buttons with clear labels; preserve the current step on mobile.

## Reduced motion and performance
Animate only transitions between steps and clean up any host-owned async work.

## Composition and anti-patterns
Share state with Stepper when navigation and progress need one source of truth.
