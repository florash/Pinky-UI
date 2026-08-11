# Depth Scroll Gallery

## Purpose

Use when native page scroll should move through a short stack of visual planes while keeping the reading relationship predictable.

## Use when

- A visual story has three to twelve steps.
- Each plane can stand alone with a label and useful alt text.

## Avoid when

- The page already has several sticky or horizontal narratives.
- Scroll position would be required to reveal essential prose.

## Interaction

Intersection state may emphasize the current plane, but previous/next buttons and Arrow keys must also work. Never trap the wheel or replace the page scrollbar.

## Reduced motion and performance

Use a normal vertical gallery when reduced motion or compact layout is active. IntersectionObserver selects the current item; avoid scroll-frame React updates.
