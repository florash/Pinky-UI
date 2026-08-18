# When not to animate

## The default question

Before adding motion to anything, ask what it is standing in for. If the
answer is "nothing, it just looks nice," that is the signal to stop. Pinky
motion exists to explain a state change, direct attention, or confirm an
action — not to prove the component is alive.

## Situations that should stay still

- **Dense, repeated content.** A hundred list rows or gallery tiles with
  per-item pointer motion is noise, not craft — see [[card-density]] and
  Masonry Gallery's own restraint.
- **Anything wrapping a destructive or irreversible action.** Motion invites
  a second look at exactly the moment it should not soften the decision — see
  [[destructive-actions]].
- **Text the user is actively reading.** Motion competing with reading loses
  every time; body copy, table cells and form values should not move while
  legible.
- **State that is already obvious from position or text.** If colour, label
  and layout already tell the story, an added transform is decoration with a
  performance cost.
- **A second signature gesture on a page that already has one.** One
  memorable motion moment per page or section is the house limit — see
  [[motion-hierarchy]].

## The test

If you can remove the animation and a user with `prefers-reduced-motion`
would understand the interface exactly as well as a user without it, the
animation was optional — which is fine. If removing it makes the interface
harder to understand, it was necessary — which is the only case worth
spending a spring on.

## Related

[[motion-budget]], [[reduced-motion]], [[performance-guardrails]]
