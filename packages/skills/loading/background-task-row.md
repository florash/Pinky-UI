# Background Task Row

## Purpose
Keep long-running work compact and persistent while the user continues elsewhere in the product.

## Use when
Generating, exporting, indexing or processing can leave the initiating surface without losing inspect, retry or completion access.

## Avoid
Blocking the main screen with a modal loader, hiding a failure after completion, or turning every short request into a task centre.

## Accessibility
Expose task state and determinate progress in text and progress semantics. Retry and inspect actions must be named by the task.

## Keyboard and touch
Keep the row actions reachable in the available width and stack metadata on mobile. Do not make hover the only way to reveal status.

## Reduced motion and performance
Use discrete progress updates and a static state fallback when motion is reduced. Clean host-owned async work when the row unmounts.

## Composition and anti-patterns
Use Queued Action when the important state is waiting to start. Use Completion Morph when the task's surface should become a result.
