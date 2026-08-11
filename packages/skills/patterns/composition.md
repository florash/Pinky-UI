# Composition

Primitives stack. That does not mean they should.

## Good

```tsx
<Magnetic strength={0.12}>
  <GlowBorder>
    <Button />
  </GlowBorder>
</Magnetic>
```

One movement, one light. The button leans slightly toward an approaching
pointer and its edge brightens. Two behaviours, one idea: *this is reachable*.

## Usually too much

```tsx
<Magnetic>
  <Jelly>
    <Tilt>
      <LiquidSurface>
        <Spotlight>
          <GlowBorder>
            <Card />
```

Six behaviours competing for one pointer. The surface moves, leans, rotates,
refracts and lights simultaneously — the user cannot tell what caused what, and
the card stops feeling designed.

## Rules that hold

1. **One movement behaviour per surface.** Magnetic *or* Jelly *or* Tilt. Never
   two — they fight over the same transform and the result reads as a bug.
2. **One light behaviour per surface.** Glow Border (edge) *or* Spotlight (face)
   *or* Liquid Surface (both, by design). Not two of them stacked.
3. **Movement plus light is the good pairing.** It is the combination that reads
   as depth rather than as effects.
4. **Nest proximity inside nothing.** A dock item wrapped in Magnetic has two
   proximity systems and no predictable behaviour.
5. **Turn intensities down as you add layers.** Two effects at 50% read richer
   than two effects at 100%.

## Composing your own components

Prefer wrapping a primitive around your own markup over forking a Pinky
component. The primitives are the API; the components are opinions about how to
use them. If your opinion differs, compose a new one:

```tsx
<Proximity>
  <Tilt max={3}>
    <Spotlight size={240}>
      <YourCard />
    </Spotlight>
  </Tilt>
</Proximity>
```

Three layers is already the practical ceiling. If you need a fourth, the problem
is usually the design, not the library.
