# Liquid Wipe Transition

## Purpose

`LiquidWipeTransition` uses two soft transform layers to cover and reveal keyed content. Use it for occasional chapter changes, portfolios and brand-led sections that can afford a more expressive handoff.

Keep it under roughly 0.7 seconds and choose a direction that matches navigation. Avoid every-link usage, heavy SVG displacement, real-time fluid simulation or stacking it with a shared-element transition.

Content order and controls remain semantic, with optional focus transfer after the wipe. Reduced motion replaces the view immediately and mobile uses the same transform-only path. Keep wipe layers opaque enough to avoid unreadable half-states.
