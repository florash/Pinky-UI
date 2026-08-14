# Stepper

## Purpose
Use to show a finite workflow position with completed, current, upcoming, and error states. For product flows where completed decisions should remain editable context, use `ProgressiveStepWorkflow` instead.

## Use when
Setup, checkout, onboarding, or staged creation has a meaningful sequence.

## Avoid
Forcing a long linear tour or using step numbers as decoration.

## Accessibility
Expose the current step and use buttons only when navigation is allowed.

## Keyboard and touch
Step navigation remains operable with focus and touch; content is not hidden behind color.

## Reduced motion and performance
Keep state transitions restrained and preserve the current step immediately when motion is reduced.

## Composition and anti-patterns
Share state with MultiStepProgress when both are visible in one workflow.
