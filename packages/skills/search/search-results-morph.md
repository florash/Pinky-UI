# Search Results Morph

## Purpose
Use for quiet add/remove/reorder transitions while query results change.

## Use when
Stable result identity helps the user understand what changed in a filtered collection.

## Avoid
Flashy stagger on every keystroke, unstable index keys, or pretending loading is complete.

## Accessibility
Expose loading and result counts through a restrained live region and retain readable empty content.

## Keyboard and touch
Result actions must be focusable list items or buttons independent of animated position.

## Reduced motion and performance
Animate only changed rows and use stable IDs; do not run a pointer or scroll render loop.

## Composition and anti-patterns
Pair with Morph Search or a normal input; use a real data-grid for analysis-heavy tables.
