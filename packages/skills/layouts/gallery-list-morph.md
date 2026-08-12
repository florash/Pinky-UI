# Gallery ↔ List Morph

## What it does

Gallery ↔ List Morph lets one stable collection switch between visual discovery
and fast metadata scanning. Items travel because their identity stays the same.

## Interaction anatomy

- **Trigger:** two real pressed controls labelled Gallery and List.
- **State:** gallery, list and focused item.
- **Motion:** keyed media and titles move between arrangements.
- **Surface:** the same items, labels, metadata and optional links in both modes.
- **Feedback:** the pressed control and item focus explain the current view.

## Good for

- Portfolios where visitors alternate between image browsing and scanning.
- Small editorial collections with meaningful titles and metadata.
- A collection that genuinely has two useful reading modes.

## Avoid for

- Different data or actions hidden behind each view.
- Large feeds that need virtualization or a plain responsive grid.
- Making the list visible only on hover or relying on a shortcut alone.

## Live example

Switch the live collection above with the visible controls. Press `G` or `L`
when the surface is focused to test the optional keyboard shortcuts.

## Usage

```tsx
<GalleryListMorph
  items={projects}
  defaultMode="gallery"
  columns={3}
  label="Projects"
/>
```

## Tune

- Use stable item ids; they are the continuity contract.
- Keep `columns` to the amount the media can support before labels become noise.
- Provide short metadata that remains useful in list mode.
- Let the host own image dimensions and lazy loading.

## Accessibility

- Gallery and List are real controls with `aria-pressed` state.
- Keep links, titles and metadata in both arrangements and preserve DOM order.
- Focus must remain visible when an item moves.
- Touch users get explicit view controls; shortcuts are only an accelerator.

## Reduced motion

The mode changes immediately while item identity, labels, links and focus
feedback remain intact.
