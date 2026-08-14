# Expandable Content Row

## Purpose

Use an inline content row when an editorial or feed item has useful secondary media, metadata and actions that belong to the same row identity. It is richer than a generic disclosure and not a table row.

## Interaction anatomy

- A full-width labelled button owns the row state.
- The open region is in normal document flow, so following rows reflow.
- Optional media and content mount inside the row rather than in an overlay.

## Good for

Case-study indexes, articles, release notes, messages and content feeds.

## Avoid

Structured tables (`ExpandableDataRow`), long editors or unrelated modal content.

## Usage

```tsx
<ExpandableContentRow items={stories.map((story) => ({
  id: story.id,
  label: story.title,
  summary: story.excerpt,
  media: <StoryCover story={story} />,
  content: <StoryDetails story={story} />,
}))} />
```

## Tune

Choose one-open for a focused reading list or `multiple` when comparing short entries. Keep the summary useful while closed.

## Accessibility and reduced motion

Use `aria-expanded` and `aria-controls` on the row button, preserve reading order and keep actions reachable after expansion. Reduced motion removes height travel; the content still opens and closes.
