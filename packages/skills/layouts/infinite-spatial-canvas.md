# Infinite Spatial Canvas

## Purpose

Use for a bounded, curated 2D/2.5D index of projects, images, notes or cards with meaningful spatial relationships. It is a spatial browsing field, not a whiteboard or a collection of absolutely positioned cards.

## Use when

- Six to thirty items can be authored with explicit coordinates, bounds and (when useful) `foreground`, `working` or `distant` planes.
- Pan and zoom add discovery while every item also works as an ordinary article.
- A `cluster` label can annotate related areas and feed the small orientation map.

## Avoid when

- Collaboration, unbounded coordinates or diagram editing are core requirements.
- Spatial navigation would be the only way to find an item.

## Keyboard, touch and focus

Arrow keys pan, +/- changes zoom and Home/0 resets. Touch/pointer drag is an accelerator with a short bounded inertial continuation; content controls remain independently interactive. Visible zoom/reset controls and DOM-order focus remain available, so the canvas cannot become a keyboard trap.

## Reduced motion and performance

Reduced motion keeps direct pan, selection and the orientation map but removes inertia, parallax and large settlement. Keep bounds sensible, use MotionValues for pan, transform-only item emphasis and let the host own lazy media.
