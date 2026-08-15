# Hold-to-Reveal Actions

## Purpose

Hold-to-Reveal Actions exposes secondary choices after sustained intent on a primary action. A visible Cancel state, Escape and keyboard activation keep the action safe for touch and non-touch users.

## Use when

- Secondary actions are useful but would clutter the resting control.
- Sustained intent is a meaningful distinction from an ordinary tap.

## Interaction

Tap the primary action to run it, hold to reveal secondary actions, choose one, or tap Cancel. Escape closes the revealed state.

## Accessibility

Use a real button with `aria-expanded` and keep every revealed action keyboard reachable. The hold gesture must never be the only way to access the secondary actions.

## Reduced motion

Reveal the action row immediately when the hold threshold is met; remove fan or stack travel.

## Tune

- Use this for low-frequency secondary actions, not for basic navigation.
- Keep the duration consistent with other long-press patterns.
