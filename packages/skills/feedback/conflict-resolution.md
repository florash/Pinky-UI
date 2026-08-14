# Conflict Resolution

## Purpose
Keep local and external values visible together until the user chooses which version continues.

## Use when
An edited record changed elsewhere and a small comparison can support an informed keep-mine or use-latest choice.

## Avoid
Silently overwriting local work, a full version-control interface for one field, or resolving the conflict through color alone.

## Accessibility
Name both versions, describe the conflict in text, and give each resolution action a specific label. Announce the chosen result once.

## Keyboard and touch
Keep both choices as native buttons with stacked mobile layout. Focus order should follow the comparison: local value, latest value, then any secondary action.

## Reduced motion and performance
Resolve the comparison immediately when motion is reduced. Do not keep polling or retain stale external values after a choice is made.

## Composition and anti-patterns
Show only the information needed to decide. Use Inline Save State for persistence without conflict and Connection State when the wider product is offline.
