# Anchored Inspector

## Purpose

Use an anchored inspector when a selected source needs readable properties without leaving the source collection or opening a detached dialog.

## Interaction anatomy

- Source buttons keep selection and pressed state visible.
- One nearby inspector changes for the active source.
- The same relationship stacks naturally on narrow screens.

## Good for

Canvas objects, editorial studies, media items and settings previews with short property summaries.

## Avoid

Long forms, global settings or content that deserves a route of its own.

## Live example

Select each source in the Anchored Inspector preview to rebind the nearby region.

## Usage

```tsx
<AnchoredInspector items={sources} />
```

## Tune

Keep the inspector short, preserve the selected source label, and use a real value hierarchy rather than a decorative tooltip.

## Accessibility and reduced motion

Use labelled buttons with pressed state and a named inspector region. Selection must work with Enter, Space and touch. Reduced motion changes the region immediately without removing the selected relationship.
