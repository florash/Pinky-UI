# Expanding Search

## Purpose

A compact search intent expands into an autofocus query surface without leaving the current layout or pushing content around.

## Good for

- Toolbar and collection search where a full field would compete with content

## Avoid for

- Primary search pages or command palettes with grouped keyboard actions — use Command Palette instead

## Usage

```tsx
<ExpandingSearch value={query} onValueChange={setQuery} results={results} />
```

## Accessibility

- The compact trigger exposes expanded state and opening moves focus to the labelled input.
- Escape closes the field and restores focus; Clear and Close remain keyboard reachable.

## Performance

- Results mount only while the search surface is open; query changes do not run a pointer loop.

Related: morph-search, command-palette.
