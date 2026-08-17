# Layered Navigation Menu

## Purpose

`LayeredNavigationMenu` preserves the parent index behind a contextual layer. It gives a second-level choice spatial continuity without pretending that the menu is a three-dimensional scene.

## Interaction anatomy

- **Base layer:** the parent groups stay visible.
- **Context layer:** the selected group offsets forward and exposes its links.
- **Selection:** changing groups changes the context layer, not the whole page.
- **Mobile:** layers stack into a readable vertical relationship.

## Live example

Open the preview and select different groups. The parent index remains part of the composition while the contextual links come forward.

## Usage

```tsx
import { LayeredNavigationMenu } from "@pinky-ui/experiences";

<LayeredNavigationMenu groups={groups} aria-label="Product navigation" />;
```

## Tune

- Use a shallow hierarchy and clear parent labels.
- Keep offsets quiet; the content relationship matters more than depth.
- Provide a flat mobile arrangement where the layers would become cramped.

## Accessibility

Keep base and context controls in logical order, expose the selected group, and ensure all contextual links are reachable without relying on visual z-index.

## Reduced motion

Remove layer travel and show the selected context at its final position. Parent and child labels remain visible.
