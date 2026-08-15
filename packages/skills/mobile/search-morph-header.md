# Search Morph Header

## Purpose

Use a search morph header when a mobile screen has a quiet title at rest and search deserves the same spatial region only after intent.

## Interaction anatomy

- A labelled trigger becomes an autofocus input.
- Escape and Cancel close the input.
- Focus returns to the original trigger.

## Good for

Collection pages, feeds and small mobile shells with one primary search task.

## Avoid

Multiple simultaneous search scopes or command-heavy workflows that need a full palette.

## Live example

Open Search, type a query and press Escape to restore the header.

## Usage

```tsx
<SearchMorphHeader title="Explore" onQueryChange={setQuery} />
```

## Tune

Keep the placeholder specific, preserve the title when closed and make the input wide enough for real queries.

## Accessibility and reduced motion

Use a labelled search region, native input and restored focus. Reduced motion changes the header immediately while keeping the same focus path.
