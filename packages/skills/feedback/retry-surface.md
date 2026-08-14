# Retry Surface

## Purpose
Turn a failed content region into a localized recovery surface without removing the context that failed.

## Use when
A panel, preview, result set or embedded content source can be retried independently from the rest of the product.

## Avoid
Global toast-only errors, silent automatic retry loops, or a retry control that does not explain what will be attempted again.

## Accessibility
Use a concise alert for the failure, label Retry by its affected context when needed, and announce successful recovery once.

## Keyboard and touch
Retry and alternate actions are native buttons with clear targets. Focus must remain in the local surface and never depend on a pointer-only affordance.

## Reduced motion and performance
Replace the failed state immediately when motion is reduced. Guard repeated retries, clean up async callbacks and avoid retrying after unmount.

## Composition and anti-patterns
Keep the error, recovery action and alternate path in the same surface. Use Connection State when the cause is a product-wide connection change rather than one failed region.
