# Swipe Back Gesture

## Purpose

An edge-anchored back gesture with two-plane parallax: the current screen
follows the finger directly from the left edge, and — when supplied — the
previous screen trails in from further left at a slower rate, matching a
native push/pop navigation transition.

## Use when

A mobile navigation stack needs the platform-standard "swipe from the left
edge to go back" gesture, and a visual sense of returning to the previous
screen matters.

## Avoid

- General-purpose drawer or filter reveals — that's Edge Swipe Panel
- Multi-height content surfaces — that's Detent Sheet
- Desktop or non-stack navigation, where there is no "previous screen" to
  parallax against

## Interaction

The gesture only begins within `edgeWidth` of the left edge — starting a
drag anywhere else in the content does nothing, so ordinary horizontal
scrolling and swipe gestures inside the screen are undisturbed. Past
`threshold`, release completes the back navigation; short of it, both
planes spring back to their resting position on Jelly's elastic curve.

## Accessibility

The gesture is a progressive enhancement over an explicit back action —
always pair it with a visible back button that calls the same `onBack`.
Nothing here replaces browser/OS back semantics; it composes with them.

## Reduced motion

The transition to the previous screen resolves immediately without the
parallax travel or elastic settle when motion is reduced.

## Performance

Pointer capture keeps the drag bound to one element; both planes animate
off shared motion values, so no React re-render occurs while dragging.

## Composition and anti-patterns

Don't combine with Edge Swipe Panel on the same edge — two gestures
competing for the same 24px strip is unresolvable for the user.
