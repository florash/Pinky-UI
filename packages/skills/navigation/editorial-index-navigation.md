# Editorial Index Navigation

## Purpose

`EditorialIndexNavigation` is a numbered, typography-led index for chapters, projects or long-form sections. A restrained traveling rule follows the active destination without turning the index into a card grid.

## Interaction anatomy

- **Numbering:** ordered destinations communicate sequence and scale.
- **Typography:** the active title gains weight and a small amount of leading space.
- **Rule:** one supplemental line follows the current row.
- **Metadata:** optional labels give each destination a useful editorial cue.

## Live example

Move across the index or tab through it. Focus and pointer attention produce the same active row, while the links remain directly usable.

## Usage

```tsx
import { EditorialIndexNavigation } from "@pinky-ui/experiences";

<EditorialIndexNavigation
  items={chapters.map((chapter, index) => ({
    id: chapter.slug,
    label: chapter.title,
    href: `#${chapter.slug}`,
    meta: `${index + 1} / 04`,
    description: chapter.summary,
  }))}
/>;
```

## Tune

- Use it for a meaningful sequence, not a generic site footer.
- Keep descriptions short and let the title carry hierarchy.
- Preserve generous row height for touch and reading rhythm.

## Accessibility

The ordered list and native anchors provide the structure. Use `aria-current` for the active destination; the rule and typography are supplemental.

## Reduced motion

Render the final active title and rule position immediately. Keep numbering, descriptions and focus behavior unchanged.
