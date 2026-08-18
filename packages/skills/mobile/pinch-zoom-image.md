# Pinch Zoom Image

## Purpose

The standard mobile photo-viewer gesture set: two-finger pinch to zoom,
one-finger pan once zoomed, and a vertical swipe down at rest scale to
dismiss — built on raw Pointer Events, not a gesture library.

## Use when

A single image deserves close inspection — a product photo, a document
page, a full-screen media viewer opened from a gallery or lightbox.

## Avoid

- Thumbnails or any image still part of a scrollable collection — zoom only
  belongs to a surface the user has explicitly opened
- Images with essential UI overlaid on them (buttons, captions users must
  reach) unless those controls stay fixed outside the zoomable layer
- As the only way to see detail — pair with a real close button, not just
  the swipe-down gesture

## Interaction

Pinch scales between 1x and `maxScale`. Above 1x, a single finger pans the
image within its bounds. At exactly 1x, a single-finger vertical drag
fades and translates the image, and releasing past ~110px calls `onDismiss`;
short of that, it springs back on Jelly's elastic curve. Two-finger and
one-finger gestures never fight each other because pan/dismiss only read
from a single active pointer.

## Accessibility

An explicit close button is always rendered when `onDismiss` is provided —
never rely on the swipe gesture as the only way out. The group has a
descriptive label stating both available gestures.

## Reduced motion

The release settle (scale/position snap-back) resolves instantly; pinch and
pan themselves are direct 1:1 pointer tracking either way, since they are
driven by the user's own hand, not autonomous motion.

## Performance

All tracking runs through Motion values (`scale`, `x`, `y`) — no React
re-render happens during a pinch or pan, only on gesture start/end.

## Composition and anti-patterns

Don't nest inside another draggable or swipeable surface (Swipe-to-Dismiss
Card Sheet, Swipe Back Gesture) — pointer capture from one will fight the
other for the same touch stream.
