# Infinite Spatial Canvas

## Purpose

Use for a bounded, curated 2D/2.5D index of projects, images, notes or cards with meaningful spatial relationships. It is not a whiteboard.

## Use when

- Six to thirty items can be authored with explicit coordinates and bounds.
- Pan and zoom add discovery while every item also works as an ordinary article.

## Avoid when

- Collaboration, unbounded coordinates or diagram editing are core requirements.
- Spatial navigation would be the only way to find an item.

## Keyboard, touch and focus

Arrow keys pan, +/- changes zoom and Home/0 resets. Touch/pointer drag is an accelerator; visible zoom/reset controls and DOM-order focus remain available.

## Reduced motion and performance

Reduced motion renders a normal grid. Keep bounds sensible, use MotionValues for pan, CSS content-visibility/contain hints for offscreen items and let the host own lazy media.
