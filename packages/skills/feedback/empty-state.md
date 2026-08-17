# Empty State

## Purpose

A named absence — no results, no items yet, nothing here — with a clear next
action, instead of a blank region the user has to interpret for themselves.

## Use when

A list, table or collection has genuinely nothing to show: a fresh workspace,
a filtered view with no matches, a search with no results.

## Avoid

- A loading placeholder — that's Skeleton Morph or Shimmer Surface, not this
- An error — say what failed and how to recover, don't relabel it "empty"
- Filling every empty list with a large illustration; a small icon and one
  clear sentence is usually enough

## Usage

```tsx
<EmptyState
  title="No projects yet"
  description="Create your first project to get started."
  action={{ label: "New project", onClick: create }}
/>
```

## Accessibility

`role="status"` announces the empty state as it appears; the action, when
present, is a real button reachable by keyboard like any other.

## Keyboard and touch

The optional action button behaves like any other button — no special
handling required.

## Composes with

Filter Rail and search results: an empty state after filtering should say
what was searched for and offer to clear the filter, not just repeat "no
projects yet" verbatim.
