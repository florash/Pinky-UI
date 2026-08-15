# Floating Media Controls

## Purpose

Floating Media Controls keep a media surface quiet at rest, reveal the small control set after a tap and collapse it after idle. The primary play control never disappears from the interaction model.

## Use when

- A media preview needs occasional playback without a permanent desktop control bar.
- The content should remain visually primary.

## Interaction

Tap the surface to reveal controls, use Play/Pause and let the layer settle back after idle. Tapping the control itself keeps the action visible.

## Accessibility

Use a labelled Play/Pause button and announce the current playback state. Do not make hover the only reveal path.

## Reduced motion

Keep the controls visible or switch visibility without opacity travel; the play state remains explicit.

## Tune

- Keep the idle timeout long enough for touch users.
- Let the host own actual media playback and cleanup.
