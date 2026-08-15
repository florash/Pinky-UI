# Expanding Action Surface

## Purpose

Use an expanding action surface when one object has secondary actions that should appear in place without becoming a generic dropdown.

## Interaction anatomy

- A compact object row owns the More trigger.
- The attached action row expands beneath the same object.
- Closing returns to the compact source without changing identity.

## Good for

Project rows, content cards and short object-level action sets.

## Avoid

Primary CTAs, multi-record batch actions or large navigational menus.

## Live example

Open More actions on the project brief and use the attached row.

## Usage

```tsx
<ExpandingActionSurface />
```

## Tune

Keep the row short, choose one clear trigger label, preserve the source header and use explicit destructive wording.

## Accessibility and reduced motion

Use `aria-expanded`, `aria-controls` and a named toolbar. Escape closes and focus stays in the local surface. Reduced motion preserves the row without height interpolation.
