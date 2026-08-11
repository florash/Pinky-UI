# Edge Swipe Panel

## Purpose
Use for an optional touch gesture that opens a panel from a configured screen edge.

## Use when
A mobile filter or navigation panel is spatially associated with that edge.

## Avoid
Hidden critical actions, accidental activation near browser gestures, or no visible open button.

## Accessibility
Expose a semantic dialog/panel with a labelled close button and keyboard path.

## Keyboard and touch
Gesture is touch-only and thresholded; the explicit button is always available.

## Reduced motion and performance
Use transform-only entrance and clean pointer state on cancellation/unmount.

## Composition and anti-patterns
Use Morph Menu or Floating Dock for desktop navigation rather than adding an edge gesture.
