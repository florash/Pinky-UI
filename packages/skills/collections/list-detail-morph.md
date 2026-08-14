# List Detail Morph

## Purpose

Use a list-to-detail morph when selecting an item should make that same item become the larger reading surface. The media and title identity carry across the state.

## Interaction anatomy

- A compact list/card is the source state.
- Selecting one item replaces the collection with its inline detail surface.
- Back or Escape returns focus to the exact source item.

## Good for

Short project indexes, portfolios and curated content collections.

## Avoid

Unrelated route transitions, generic modals or feeds too large to keep in one reading context.

## Usage

```tsx
<ListDetailMorph
  label="Case studies"
  items={projects.map((project) => ({
    id: project.id,
    title: project.title,
    summary: project.summary,
    media: <ProjectCover project={project} />,
    detail: <ProjectDetail project={project} />,
  }))}
/>
```

## Tune

Use stable ids for shared layout identity and keep the detail surface bounded. Provide a visible back control even when Escape is supported.

## Accessibility and reduced motion

Use buttons for source selection, focus the detail heading on open and restore the source button on close. Reduced motion renders the same source/detail states without travel.
