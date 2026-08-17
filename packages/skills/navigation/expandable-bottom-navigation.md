# Expandable Bottom Navigation

## Purpose

`ExpandableBottomNavigation` is a mobile-first navigation island where the selected destination opens into a text label while peer destinations remain compact. It gives touch users a clear current location without a large bottom bar.

## Interaction anatomy

- **Selected item:** one destination owns the visible label.
- **Peers:** icons or compact marks keep the rest of the rail scannable.
- **Safe area:** fixed placement stays inset from the viewport edge.
- **Direct links:** each item remains a native navigation target.

## Live example

Tap or focus different destinations in the preview. The selected label opens in place and the current state remains apparent without hover.

## Usage

```tsx
import { ExpandableBottomNavigation } from "@pinky-ui/experiences";

<ExpandableBottomNavigation items={items} fixed aria-label="Primary mobile navigation" />;
```

## Tune

- Use three to five destinations with short labels.
- Keep fixed navigation clear of bottom-sheet and browser safe areas.
- Prefer it for primary wayfinding, not transient actions.

## Accessibility

Use meaningful accessible names for every link, expose the current destination with `aria-current`, and keep touch targets at least 44px high. The visual label is not the only name.

## Reduced motion

Reveal the selected label immediately. The selected background and current semantics continue to communicate location.
