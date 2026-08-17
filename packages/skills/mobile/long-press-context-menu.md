# Long-Press Context Menu

## Purpose

The iOS-style contextual menu: holding a surface lifts it into a small peek
scale and reveals its actions beside it. Touch-first by construction —
desktop gets an equivalent right-click trigger, not a translated gesture.

## Use when

A grid or list item (a photo, a card, a message) has a small set of
secondary actions that don't need their own visible affordance on every
item — the hold itself is the discovery path, backed by a real button for
anyone who can't or won't hold.

## Avoid

- Primary actions — anything the user needs on every visit should have a
  visible control, not just a long-press
- Inside a horizontally-swipeable row (Swipe Actions) — two gesture systems
  competing for the same touch start is unresolvable; see
  [[mobile-gesture-conflicts]]
- Long lists where holding any item should feel safe — the movement-cancel
  threshold exists exactly so scrolling never accidentally opens a menu, but
  don't rely on it as the only path in

## Interaction

A pointer-down starts a hold timer; moving more than ~10px before the timer
fires cancels it, so scroll gestures never trigger the menu. On success, the
surface scales up on Jelly's snappy spring, a scrim dims behind it, and the
action list appears. Escape, a tap outside, or an action itself closes it.

## Accessibility

A visually-hidden "More actions" button sits on every instance regardless of
input method — long-press is a shortcut to the same menu, never the only way
to reach it. `role="menu"`/`role="menuitem"` mark the surface; Escape and
outside-press both dismiss.

## Reduced motion

The peek scale and menu entrance resolve immediately; the scrim still
appears so the menu reads as a distinct layer.

## Composition and anti-patterns

Don't combine with Hold-to-Reveal Actions on the same element — pick one
hold-triggered pattern per surface. Compose with a plain grid or list; it
doesn't manage its own layout.
