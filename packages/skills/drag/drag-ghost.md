# Drag Ghost

## Purpose
Use as a restrained snapshot while an item is actively being dragged.

## Use when
A drag integration needs to preserve content recognition while the source moves.

## Avoid
Floating decorative cards or a ghost that cannot communicate its destination.

## Accessibility
The source and keyboard path remain available; the ghost is decorative only.

## Keyboard and touch
Touch and keyboard alternatives should not depend on the ghost.

## Reduced motion and performance
Use a transform and modest scale; avoid cloning heavy media or running a render loop.

## Composition and anti-patterns
Compose with DropIndicator and a real drag sensor/state owner.
