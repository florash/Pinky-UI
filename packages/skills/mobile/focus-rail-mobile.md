# Focus Rail Mobile

## Purpose

Focus Rail Mobile is a native horizontal collection where the centered item is dominant and neighboring items remain partially visible. Scroll snap supplies the gesture; scale and opacity explain focus.

## Use when

- A collection needs browsing context without a full-screen carousel.
- The next and previous items should stay discoverable.

## Interaction

Swipe the rail or select an item. The chosen item scrolls to center and exposes its active state through `aria-current` and visible hierarchy.

## Accessibility

Use focusable item buttons, readable labels and a non-gesture activation path. Keep the rail's horizontal scroll contained so it does not create page overflow.

## Reduced motion

Use instant scroll and remove scale transitions; the centered item and active label remain clear.

## Tune

- Leave enough of the neighboring item visible to explain the rail.
- Use `overscroll-behavior-inline: contain` when nested in a vertical page.
