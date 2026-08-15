# Swipe Actions

## Purpose

Swipe Actions separates a partial reveal from a committed row action. The row snaps to a readable action state, and only a farther threshold commits; the visible action button is always available.

## Use when

- A list row has one frequent secondary action.
- The action can be safely cancelled before commitment.

## Interaction

Swipe partially to reveal, release to snap, swipe farther to commit, or use the action button. A vertical page scroll should not be captured by a mostly vertical gesture.

## Accessibility

Expose the action as a real button and announce reveal/commit status in text. Keep the row label and action name together for screen readers.

## Reduced motion

Jump between resting, revealed and committed positions without horizontal travel.

## Tune

- Use a reveal threshold smaller than the commit threshold.
- Keep action count low; use a menu for larger action sets.
