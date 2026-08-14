# Completion Morph

## Purpose
Transform a working action surface into its completed result while preserving spatial ownership.

## Use when
An upload, publish, generate or submit surface naturally becomes a file card, result summary or ready state.

## Avoid
Fading a loader into a generic checkmark, celebrating routine work with confetti, or morphing across unrelated page regions.

## Accessibility
Keep the completed result in the same reading order, announce the completion once, and provide a clear reset, inspect or next action.

## Keyboard and touch
The initiating control remains a native button. The completed surface must keep its next action reachable at 390px without relying on hover.

## Reduced motion and performance
Preserve the same DOM meaning and resolve the transition without travel when motion is reduced. Do not mount a second heavy result surface before the old one is released.

## Composition and anti-patterns
The working object should become the result with stable identity. Use Async Action Control for a compact button lifecycle without a spatial result transformation.
