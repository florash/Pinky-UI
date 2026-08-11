# Jelly Card

## Purpose

Use Jelly Card when a surface should feel physically soft — it leans toward the
pointer, drifts slightly, and settles on a spring. It is the most expressive
card in Pinky UI and should be treated as a limited resource.

## Good for

- feature cards and product highlights
- creative portfolios and case-study tiles
- one or two hero surfaces that should feel alive

## Avoid for

- forms and input-heavy panels
- dense data tables
- long repeated lists, where per-item motion becomes noise
- anything wrapping a critical or destructive action

## Recommended defaults

`elasticity={0.35} intensity={0.18}` — the Soft preset. Do not raise `intensity`
above `0.3` unless the card is alone on the screen; above that the surface stops
reading as soft and starts reading as unstable. `hoverScale` stays at or under
`1.04` by house rule.

In a grid, drop to Subtle (`elasticity={0.15} intensity={0.08}`) or switch to
Spotlight Card. A dozen cards leaning at once is noise, not craft.

`className` positions the outer element (grid and flex placement);
`surfaceClassName` styles the inner surface.

## Accessibility

- Effects are transform-only, so surrounding layout never shifts.
- Pointer response is skipped entirely for touch and reduced motion, and the
  card stays fully usable in both cases.
- Any semantics you nest inside are preserved; the card adds none of its own.
- Keep rotation low if the card carries body text.

## Performance

Cheap: two motion values and a CSS gradient, no React renders while tracking.
The cost is visual, not computational — restraint is about attention, not frames.

## Composition

Works well with Glow Border (framing) and a Magnetic Button inside.

Avoid nesting inside Tilt — two rotation systems on one surface fight each other
and the result reads as a bug.
