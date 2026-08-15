# Swipe Media Inspector

## Purpose

Swipe Media Inspector adds a metadata layer to an open media surface. An upward swipe reveals details and a downward swipe returns to the frame without leaving the media context.

## Use when

- Media metadata is useful but should not occupy the resting frame.
- A full-screen or bounded media surface has a clear vertical reading direction.

## Interaction

Open the frame, swipe up or activate Details, then swipe down or choose Hide details. Close remains explicit.

## Accessibility

Provide a Details button with `aria-expanded`, a close button and readable metadata in normal DOM order. Swiping must enhance, not replace, those controls.

## Reduced motion

Toggle the metadata region immediately and retain the same action labels.

## Tune

- Keep metadata concise enough for a lower panel.
- Do not capture vertical page scroll outside the open media surface.
