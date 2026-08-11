# Stack → Spatial

## Purpose

Use when a familiar stack should open into an authored X/Y/Z arrangement without changing the collection identity.

## Use when

- An album, project set or document group benefits from one reveal of relationships.
- The collapsed state is already useful on its own.

## Avoid when

- The collection needs immediate comparison or contains many items.
- The expansion would explode into an uncontrolled decorative animation.

## Interaction

Use one pressed toggle. The same keyed items remain present; focus and labels survive the transition. Spatial hover may lift one item, but never hides its neighbours.

## Mobile and reduced motion

Flatten the expanded state into a responsive grid and switch immediately under reduced motion. CSS transforms are enough; do not add a canvas.
