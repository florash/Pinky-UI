# Edge Swipe Panel

## Purpose
Use for an optional touch gesture that progressively reveals a panel from a
configured screen edge. The closed state can keep a quiet rail; the open state
is a semantic panel, not merely a drawer animation.

## Use when
A mobile filter or navigation panel is spatially associated with that edge.

## Avoid
Hidden critical actions, accidental activation near browser gestures, or no visible open button.

## Interaction anatomy

During the gesture, reveal percentage controls the panel surface, rail opacity,
underlying content displacement and scrim. Release uses distance plus velocity,
so a quick flick can settle without a brittle 49/51% threshold.

## Accessibility

Expose a semantic dialog/panel with a labelled close button, an explicit open
button, Escape, focus restoration and a keyboard focus loop.

## Keyboard and touch

The edge gesture follows the pointer from the first pixel and is touch/pointer
accelerated; the explicit button is always available. Underlying content remains
slightly displaced rather than hidden behind a heavy scrim.

## Reduced motion and performance

Use transform-only reveal and clean pointer state on cancellation/unmount.
Reduced motion keeps direct reveal and the semantic open/close states but removes
inertial settlement and decorative scrim motion.

## Composition and anti-patterns
Use Morph Menu or Floating Dock for desktop navigation rather than adding an edge gesture.
