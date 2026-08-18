# Morphing Mega Navigation

## Purpose

`MorphingMegaNavigation` lets a primary navigation surface grow into its own contextual index. The panel is a continuation of the header rather than a detached overlay, which keeps the opening relationship easy to understand.

## Interaction anatomy

- **Trigger:** one labelled button owns open state.
- **Surface:** the header grows into a two-column context panel.
- **Group selection:** intent groups stay visible while their links update.
- **Close path:** Escape and the close action return focus to the trigger.

## Live example

Open the navigation, choose a group, and follow one of its links. The surface and trigger share the same material and the group content is directly readable.

## Usage

```tsx
import { MorphingMegaNavigation } from "@pinky-ui/experiences";

<MorphingMegaNavigation groups={groups} aria-label="Main navigation" />;
```

## Tune

- Keep groups intent-led and links short enough to scan.
- Use the panel for meaningful hierarchy, not every low-level utility.
- Keep one open surface per page and avoid stacking another mega menu above it.

## Accessibility

Connect the trigger with `aria-controls` and `aria-expanded`, expose group controls with selected state, and restore focus on Escape or close. All destinations remain native links.

## Reduced motion

Remove height and content travel while preserving the open panel, selected group and focus restoration.
