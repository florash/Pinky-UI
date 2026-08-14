# Delayed Feedback Escalation

## Purpose
Keep fast actions quiet, then escalate to useful status only when elapsed time makes waiting meaningful.

## Use when
An operation often completes before a loader would be perceived, but needs more detail when it crosses a measured threshold.

## Avoid
Arbitrary suspense, a permanent silent wait, or flashing a spinner for work that completes within a frame or two.

## Accessibility
Expose each meaningful phase through one polite status update and keep the final result explicit. Do not announce every timer tick.

## Keyboard and touch
The initiating action remains a native control and can be run again after completion. Thresholds must never require pointer hover.

## Reduced motion and performance
Remove visual travel but preserve the timing model and text states. Clear every threshold timer on restart and unmount.

## Composition and anti-patterns
Escalate from quiet to pending to detailed status; do not turn the pattern into a spinner variant or a generic toast.
