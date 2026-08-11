# Cursor Etiquette

## Purpose

Custom cursor effects are decoration around an already usable interface. One page should have a clear cursor hierarchy: native pointer first, one signature follower at most, then occasional target labels or ambient light.

Never hide the native cursor over forms, text editing or dense navigation without a strong reason. Avoid giant followers, permanent trails, pointer-blocking layers and effects that run on touch. Cursor layers should normally be `aria-hidden` and `pointer-events: none`, while links/buttons keep real focus styles and names.

Disable or simplify on coarse pointers and reduced motion. If removing the effect makes the affordance disappear, the design is incomplete.
