# Reduced motion

## The contract

When `prefers-reduced-motion: reduce` is set, a Pinky component must:

- **preserve functionality** — nothing becomes unreachable or unusable
- **remove non-essential spring movement** — no lean, drift, magnetism or
  proximity scaling
- **avoid spatial jumps** — a morph becomes an appearance, not a fly-across
- **keep state changes understandable** — selection, expansion and toggling
  remain obvious from position, colour and text

## How Pinky implements it

`useMotionEnabled()` returns `false` on the server and on the first client
render, then reflects the media query. That ordering is deliberate: the static
state is the *base* render, so motion is genuinely additive and hydration stays
quiet.

Components must render a complete, usable UI while motion is off. If a component
only makes sense once it has animated, it is broken.

There is also a blunt CSS safety net that flattens animation and transition
durations globally. Do not rely on it — it catches third-party markup, not your
design decisions.

## What must *not* change

State, semantics, focus behaviour and layout. A reduced-motion user and a
default user should be able to describe the interface to each other without
noticing they saw different things.

## Testing it

macOS: System Settings → Accessibility → Display → Reduce motion. In DevTools:
Rendering → Emulate CSS media feature `prefers-reduced-motion`.

Check that every interactive element still shows a clear hover and focus state —
with motion removed, colour and outline carry all the feedback.
