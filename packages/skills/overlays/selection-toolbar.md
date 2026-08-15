# Selection Toolbar

## Purpose

Use a selection toolbar when several visual or spatial sources can be selected and their batch actions should remain close to that selection.

## Interaction anatomy

- Source buttons expose pressed state.
- The toolbar appears only after at least one source is selected.
- Actions and Clear stay in one compact named region.

## Good for

Visual collections, canvas objects and small sets of product surfaces.

## Avoid

One-record actions, data-list batch operations already served by Selection Tray, or toolbars that are always visible.

## Live example

Select two surfaces and use the contextual actions that appear below them.

## Usage

```tsx
<SelectionToolbar items={cards} />
```

## Tune

Show the count, keep actions consequential and short, and decide whether the toolbar is attached in flow or pinned within a bounded workspace.

## Accessibility and reduced motion

Use pressed state, a real `toolbar` role and visible action labels. Touch users need the same selection path as pointer users. Reduced motion changes toolbar presence without sliding it away from its source.
