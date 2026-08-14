# Cursor Preview List

## Purpose

Use a text-first list when the active entry needs one contextual media or content preview near the browsing intent. The list remains the thing being read; the preview confirms context rather than replacing the labels.

## Interaction anatomy

- Pointer movement selects one entry and positions a bounded detached preview.
- Keyboard focus selects the same entry without requiring pointer coordinates.
- Touch uses tap selection and an inline preview below the list.

## Good for

Portfolio indexes, case-study lists and small editorial archives.

## Avoid

Tooltips, utility navigation, huge feeds or previews that obscure essential text. Use `CursorPreviewNav` when the entries are destinations.

## Usage

```tsx
<CursorPreviewList
  label="Selected projects"
  items={projects.map((project) => ({
    id: project.id,
    label: project.title,
    description: project.summary,
    preview: <ProjectPreview project={project} />,
  }))}
/>
```

## Tune

Keep one preview mounted, cap the preview size and give media stable dimensions. Clear pointer state on leave when no item retains focus.

## Accessibility and reduced motion

Use real buttons for selection, `aria-pressed` for the active entry and visible focus. Touch must not depend on hover. Reduced motion keeps the selected preview and removes travel/fade.
