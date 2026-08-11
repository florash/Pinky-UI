# Cylinder Gallery

## Purpose

Use for a finite ring of related media where adjacency and rotation are meaningful.

## Use when

- Three to ten items form a clear sequence or collection.
- A visible active item and explicit snap controls are desirable.

## Avoid when

- Infinite rotation or autoplay would distract from the content.
- A normal carousel communicates the sequence more clearly.

## Interaction and accessibility

Buttons, focus and keyboard navigation are complete paths; wheel and touch drag are accelerators. The active label is announced and the flat fallback keeps all items reachable.

## Reduced motion and performance

Remove ring transforms and settle into a list/carousel. Keep the ring finite and CSS-based; do not introduce WebGL for a handful of cards.
