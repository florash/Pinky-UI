# Hover Expand Navigation

## Purpose

`HoverExpandNavigation` gives a short destination row enough room to explain the item currently under attention. The active item grows and its neighbours yield space, so context arrives as part of the navigation rather than in a detached tooltip.

## Interaction anatomy

- **Engaged item:** pointer hover, keyboard focus or selection expands one destination.
- **Context:** a short description appears inside the same link surface.
- **Neighbour response:** the row reflows rather than covering adjacent links.
- **Touch:** selection keeps the chosen item open without requiring hover.

## Live example

Use the live navigation preview to move across destinations or focus them with Tab. The same link remains the destination in every state.

## Usage

```tsx
import { HoverExpandNavigation } from "@pinky/experiences";

<HoverExpandNavigation
  items={[
    { id: "work", label: "Work", href: "/work", description: "Selected projects" },
    { id: "notes", label: "Notes", href: "/notes", description: "Writing and process" },
  ]}
/>;
```

## Tune

- Keep the row to a small set of peer destinations.
- Keep descriptions to one or two lines so expansion remains intentional.
- Use a calm surface and let the layout shift carry the emphasis.

## Accessibility

Use real links, retain `aria-current` for the selected destination, and make focus visible around the complete link surface. Focus must engage the same context as pointer attention.

## Reduced motion

Remove flex interpolation and show the engaged description immediately. The selected state and text remain available without motion.
