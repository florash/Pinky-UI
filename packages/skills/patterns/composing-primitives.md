# Composing primitives

## The rule

One motion system per surface. `Jelly`, `Tilt`, `LiquidSurface`, `Magnetic`
and `Parallax` each own the transform on the element they wrap. Nesting two
of them on the same surface — or on a parent and its direct child — makes
both systems fight over the same `transform`, and the result reads as a bug,
not layered depth.

## What composes safely

- **A primitive plus a static effect.** `Glow Border` framing a `Jelly Card`,
  or `Spotlight` lighting the face of a `Tilt` card, work because one is a
  transform and the other is light — they don't share a property.
- **A primitive plus press feedback.** `usePressSpring` scale and a `Jelly`
  lean can coexist because the lean is idle/hover behaviour and the press
  scale only applies on activation.
- **Nested content that brings its own semantics.** A button, image or badge
  inside `Magnetic` or `Jelly` — the wrapper only ever transforms the whole
  child, never reaches into it.

## What does not compose

- `Jelly` inside `Tilt` (or the reverse) — two independent rotation/lean
  systems on one surface.
- `Magnetic` on both a parent and a child it contains — offsets add up and
  become unpredictable.
- `CursorGlow` and `Spotlight` on the same region — doubles the ambient
  light for no added meaning.
- A `Parallax` layer nested inside another `Parallax` — depths compound
  instead of composing.

## The test

If you can't describe in one sentence what depth or motion each layer is
independently responsible for, don't nest them — flatten to one primitive
and let composition happen through layout instead.

## Related

[[motion-budget]], [[when-not-to-animate]]
