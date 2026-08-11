# Shared Element Transition

## Purpose

`SharedElementTransition` preserves visual identity between a source and destination, either through a real route link or the existing accessible `Morph` surface. Use it for a thumbnail-to-detail or card-to-project relationship.

Animate one meaningful shared object and keep the duration short. Avoid wrapping whole pages, matching unrelated elements or using the transition when back-navigation cannot preserve context. A transition is enhancement, not routing infrastructure.

Route mode remains a real anchor; in-place mode inherits focus trap, Escape and restoration from `Morph`. Reduced motion removes shared layout movement. Keep names stable across server and client, and avoid large filter stacks during the transition.
