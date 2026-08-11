# Blur Route Transition

## Purpose

`BlurRouteTransition` is the restrained default for keyed route or content changes: a small fade, blur and vertical handoff. Use it when continuity helps but branded choreography would be excessive.

Use about 3–6px blur and 0.18–0.3 seconds. Avoid large blurred surfaces on low-power devices, delaying data-bound content or nesting multiple route transitions. Motion must never be the only sign that navigation occurred.

The wrapper can receive focus after change so keyboard and screen-reader context is not lost. Reduced motion bypasses `AnimatePresence` and replaces content immediately. Prefer this over Bubble or Liquid Wipe for routine product navigation.
