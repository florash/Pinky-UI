# Performance guardrails

## The baseline

Every Pinky primitive is built to be cheap by default: transform/opacity
only, shared pointer subscriptions instead of per-element listeners, motion
values instead of React state while tracking. That baseline is what makes
"just use the primitive" a safe default — but it doesn't survive careless
composition at scale.

## Where cost actually comes from

- **Per-item pointer effects at volume.** One `Jelly Card` is cheap. A
  hundred of them, each independently subscribed, is not — see
  [[card-density]]. Masonry Gallery and similar volume layouts deliberately
  carry no motion of their own for this reason.
- **Measurement, not motion.** Layouts that avoid a measurement pass (round
  robin distribution, CSS Grid dense flow) stay stable as content loads;
  layouts that balance by measuring reflow once images resolve. Prefer the
  former for anything unbounded.
- **Missing image dimensions.** No layout primitive can prevent a jump
  caused by an image without explicit width/height — that's a host
  responsibility, not something a wrapper fixes for you.
- **React state driving continuous motion.** If a value changes every
  pointer-move or scroll frame, it belongs in a motion value
  (`useMotionValue`/`useTransform`), never in `useState` — that's the
  difference between Scroll Morph Wall's zero-re-render scroll binding and a
  naive `onScroll` handler calling `setState`.

## Guardrails to check before shipping a new composition

- Does anything mount a pointer-driven primitive per item in a list that can
  grow past ~20 items? If so, drop to a cheaper layout or gate the effect.
- Does a scroll- or pointer-linked value ever call `setState`? If yes, move
  it to a motion value.
- Are images given explicit dimensions and `loading="lazy"` where
  appropriate?
- Does disabling motion (`useMotionEnabled() === false`) also remove the
  underlying subscription, not just skip the animation?

## Related

[[motion-budget]], [[card-density]], [[reduced-motion]]
