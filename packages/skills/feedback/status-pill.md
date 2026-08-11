# Status Pill

## Purpose
Use for a compact state that remains near the object it describes, optionally carrying bounded progress.

## Use when
An upload, processing task, draft, ready, failed, or live state needs to stay visible.

## Avoid
Pure decoration, unbounded percentages, or replacing a detailed error message.

## Accessibility
Expose the label and state through status semantics; never communicate state by color alone.

## Keyboard and touch
If the pill is actionable, make it a real button and preserve a 44px touch target.

## Reduced motion and performance
Animate only meaningful state changes and resolve immediately under reduced motion.

## Composition and anti-patterns
Pair with Inline Feedback for detail. Do not make a pill the only recovery route.
