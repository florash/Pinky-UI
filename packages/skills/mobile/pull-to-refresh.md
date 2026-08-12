# Pull to Refresh

## Purpose
Use for a tactile refresh chamber that invokes a host-owned refresh callback. It
reveals from behind the content surface instead of pretending that a spinner is
the content.

## Use when
A scrollable mobile collection has an obvious reload action and a top boundary.

## Avoid
Fake network states, hijacking browser refresh, or making pull the only refresh route.

## Interaction states

The resistance curve makes `pulling` distinct from `ready`; the threshold has
an armed cue, release enters `refreshing`, and a short `complete` state confirms
the callback without inventing network data.

## Accessibility

Expose pulling, ready, refreshing, and complete as readable status text. Keep a
visible `Refresh` button so keyboard and switch users do not need a gesture.

## Keyboard and touch

The button invokes the same callback as the gesture. The gesture only begins at
`scrollTop === 0`, uses pointer capture, and cancels cleanly below threshold.

## Reduced motion and performance

Use requestAnimationFrame for the visual offset and clean it on unmount.
Reduced motion keeps the threshold/armed state and direct content relationship,
but removes the elastic settle and ambient spinner motion.

## Composition and anti-patterns
The callback owns data and errors; this primitive does not invent network behavior.
