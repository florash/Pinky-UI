# Elastic Toggle

## Purpose

Use Elastic Toggle for instant-effect settings. The thumb stretches as it
travels and settles on a spring, which gives a small control a tactile quality
without changing how it reads.

## Good for

- settings and preference panels
- instant-effect options with no save step

## Avoid for

- anything needing a confirm step — use a checkbox and a submit button
- destructive switches, where playfulness undercuts the weight of the action

## Recommended defaults

`stretch={0.5}`. At `1` the thumb is visibly rubbery — fine once on a playful
settings page, wrong in a product surface. Never let the animation carry meaning
that colour and position do not already carry.

## Accessibility

- `role="switch"` with `aria-checked`, so it is announced as on/off rather than
  as a checkbox.
- Operable with Space and Enter; the visible label toggles it too.
- State is carried by position and colour, never by the animation.
- Disabled state is exposed to assistive technology and blocks interaction.

Pass either `label` or `aria-label`. A switch with no accessible name is a
switch no screen-reader user can use.

## Performance

One spring on one element. Negligible.

## Composition

Keep it plain. A toggle wrapped in Magnetic or Tilt is a control that moves
away from the pointer trying to hit it.
