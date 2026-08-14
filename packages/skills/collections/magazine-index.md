# Magazine Index

## Purpose

Use a numbered content index when typography, metadata and one shared preview should make a collection feel like a publication. This browses content; it is not page-destination navigation.

## Interaction anatomy

- Numbered rows keep the editorial order visible.
- Selection changes one shared preview and its metadata.
- Arrow, Home and End move through content entries.

## Good for

Journals, release notes, art direction, case-study issues and design-led archives.

## Avoid

Primary navigation, utility menus or indexes where every item must be compared at once.

## Usage

```tsx
<MagazineIndex
  label="Issue contents"
  items={stories.map((story, index) => ({
    id: story.id,
    number: String(index + 1).padStart(2, "0"),
    title: story.title,
    meta: story.category,
    preview: <StoryCover story={story} />,
  }))}
/>
```

## Tune

Let the numbers and titles carry hierarchy before adding motion. Keep metadata short and make the shared preview supplementary.

## Accessibility and reduced motion

Rows are buttons with pressed state, not invented tabs or links. Keep title and metadata in the DOM; reduced motion swaps the preview without the editorial slide.
