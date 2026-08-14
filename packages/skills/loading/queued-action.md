# Queued Action

## Purpose
Make accepted-but-not-yet-started work visible before it enters active processing.

## Use when
Capacity, sequencing or a shared worker means an action can be accepted now but cannot begin immediately.

## Avoid
Calling queued work idle, implying that processing already started, or inventing a queue position the product cannot support.

## Accessibility
State accepted, queued, active and complete in text. A queue position is supplemental and must not be the only status signal.

## Keyboard and touch
Queue, start and retry actions are native buttons with comfortable targets. The waiting state must be readable without hover.

## Reduced motion and performance
Swap discrete states without animated reordering when motion is reduced. Avoid polling or duplicate enqueue calls from repeated activation.

## Composition and anti-patterns
Use Background Task Row after work leaves the queue. A progress bar alone cannot communicate that the operation has not started.
