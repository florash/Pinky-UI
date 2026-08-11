# Magnetic Cursor Target

## Purpose

`MagneticCursorTarget` composes Pinky’s existing `Magnetic` primitive with `CursorTarget`. It lets a semantic region influence the cursor label, the target’s small translation, or both without creating a competing attraction algorithm.

Use it for a primary CTA, project card or compact action cluster with space around the target. Keep `maxOffset` near 4–8px and the range short. Do not use it on large lists, text inputs, disabled controls or targets whose position must be exact.

The wrapper never replaces the native control and `CursorTarget` claims on focus. The effect is inactive for reduced motion and coarse pointers through the underlying primitives. Use a visible focus style and a real link/button inside the target.
