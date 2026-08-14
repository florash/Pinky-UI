# Clip Reveal Menu

## Purpose

`ClipRevealMenu` reveals an anchored list from its trigger edge using a restrained clip. It is a compact contextual menu pattern whose geometry explains where the panel came from.

## Interaction anatomy

- **Anchor:** the trigger and panel share a clear local origin.
- **Reveal:** the menu opens inside one bounded surface.
- **Dismissal:** Escape and outside click close the panel.
- **Continuity:** the trigger keeps its state while the panel is open.

## Live example

Open the menu in the preview, tab through the links, and close it with Escape or outside focus. The destination list is real content, not a visual overlay only.

## Usage

```tsx
import { ClipRevealMenu } from "@pinky/experiences";

<ClipRevealMenu items={items} label="Browse" aria-label="Browse destinations" />;
```

## Tune

- Keep the panel close to the trigger and limit its width.
- Use a short direct list rather than a multi-level information architecture.
- Keep the clip edge subtle on light surfaces.

## Accessibility

The trigger must expose `aria-expanded` and `aria-controls`; links need visible focus. Escape, outside click and close paths must restore focus to the trigger.

## Reduced motion

Show or hide the panel immediately without clip travel. The open state and destination labels remain explicit.
