# Circular Progress Morph

## Purpose
Use one compact surface for active work, bounded percentage, and completed check.

## Use when
Uploads or background tasks need a small status near their source.

## Avoid
Ambiguous gauges, decorative spinners, or percent values that are not real.

## Accessibility
Use progressbar semantics for determinate values and status semantics for indeterminate work.

## Keyboard and touch
Keep cancellation or retry actions separate and reachable.

## Reduced motion and performance
Stop the spinner on completion and disable animation under reduced motion.

## Composition and anti-patterns
Use AsyncButton for the initiating action and Inline Feedback for errors.
