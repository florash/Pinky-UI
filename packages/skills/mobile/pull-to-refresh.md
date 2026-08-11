# Pull to Refresh

## Purpose
Use for a native-feeling touch gesture that invokes a host-owned refresh callback.

## Use when
A scrollable mobile collection has an obvious reload action and a top boundary.

## Avoid
Fake network states, hijacking browser refresh, or making pull the only refresh route.

## Accessibility
Expose pulling, ready, refreshing, and complete as readable status text.

## Keyboard and touch
Provide a visible refresh control elsewhere; only begin at scrollTop zero.

## Reduced motion and performance
Use requestAnimationFrame for the visual offset and clean it on unmount.

## Composition and anti-patterns
The callback owns data and errors; this primitive does not invent network behavior.
