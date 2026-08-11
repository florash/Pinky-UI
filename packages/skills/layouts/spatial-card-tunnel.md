# Spatial Card Tunnel

## Purpose

Use for a finite sequence of related cards that advances through restrained z-depth with explicit navigation.

## Use when

- Three to ten documents, product surfaces or steps have a meaningful order.
- A tunnel communicates progression better than a flat list.

## Avoid when

- The content is a comparison grid or a long feed.
- Users would need a camera gesture to reach information.

## Interaction and accessibility

Keep all cards in DOM order, use a roving active item and expose Arrow/Home/End plus Previous/Next. Metadata must not depend on opacity or depth.

## Reduced motion and performance

Flatten to a normal stack immediately. The collection is bounded and transform-only; avoid cloned cards, camera loops and WebGL.
