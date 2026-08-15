# Expand-in-Place Card

## Purpose

Expand-in-Place Card opens additional reading room directly below the selected card. The source remains in the document flow and later content reflows instead of disappearing behind a modal.

## Use when

- Each card has a short optional detail.
- The selected source should remain the reading anchor.

## Interaction

Tap a card to expand it, read the detail and tap again to collapse. `aria-expanded` describes the open state.

## Accessibility

Use a real button for the disclosure and keep the expanded content immediately after it in DOM order. Do not hide the summary when open.

## Reduced motion

Insert and remove the detail region immediately without height animation.

## Tune

- Keep the expanded content focused and short.
- Use a route or lightbox when the detail is a full reading experience.
