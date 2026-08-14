# Shared Preview Collection

## Purpose

Use one shared preview for many compact entries when mounting a full media surface for every item would make the collection heavy or visually noisy.

## Interaction anatomy

- A compact entry rail exposes the collection at rest.
- Hover, focus or tap changes one larger preview surface.
- The preview swaps in place and keeps the selected title adjacent.

## Good for

Portfolio indexes, product studies and media collections with one expensive contextual preview.

## Avoid

Side-by-side comparison or items that each need independent controls simultaneously.

## Usage

```tsx
<SharedPreviewCollection
  label="Selected work"
  items={projects.map((project) => ({
    id: project.id,
    label: project.title,
    meta: project.category,
    description: project.summary,
    preview: <ProjectPreview project={project} />,
  }))}
/>
```

## Tune

Keep previews bounded and mount only the engaged one. Use explicit entry buttons so touch never depends on hover.

## Accessibility and reduced motion

Use a labelled list of buttons with pressed state and an `aria-live` preview region. Reduced motion swaps the shared surface immediately without hiding the selection.
