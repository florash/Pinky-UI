# Peek Panel Collection

## Purpose

Use a peek panel when a collection should keep its source items visible while a neighbouring panel exposes focused context. The panel belongs to the collection layout; it is not a global drawer.

## Interaction anatomy

- The left or top collection remains available for scanning.
- One adjacent panel changes for the active item.
- Mobile stacks the same panel below the source list.

## Good for

Small project collections, settings overviews and media indexes with short contextual details.

## Avoid

Global navigation drawers, long detail pages or content that needs a route of its own.

## Usage

```tsx
<PeekPanelCollection
  label="Work collection"
  items={projects.map((project) => ({
    id: project.id,
    label: project.title,
    summary: project.client,
    preview: <ProjectCover project={project} />,
    detail: <ProjectSummary project={project} />,
  }))}
/>
```

## Tune

Keep source rows and the panel visually related. Use one panel, stable selected identity and a short detail payload.

## Accessibility and reduced motion

Use buttons with pressed state, keep the panel labelled and expose touch selection. Reduced motion swaps the panel immediately without changing source order.
