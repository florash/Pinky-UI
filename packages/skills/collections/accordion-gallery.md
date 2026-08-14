# Accordion Gallery

## Purpose

Use a media-led accordion when each title row owns a larger masked gallery region and caption layer. It is more spatially intentional than generic FAQ disclosure.

## Interaction anatomy

- The title row remains the identity and control.
- Opening inserts a media region in normal document flow.
- Caption, metadata and supporting content stay attached to that media.

## Good for

Editorial galleries, process studies, project chapters and article media collections.

## Avoid

Generic settings, data tables or a gallery where every image must remain visible simultaneously.

## Usage

```tsx
<AccordionGallery
  label="Project chapters"
  items={chapters.map((chapter) => ({
    id: chapter.id,
    title: chapter.title,
    meta: chapter.year,
    description: chapter.summary,
    media: <ChapterMedia chapter={chapter} />,
    content: <ChapterCaption chapter={chapter} />,
  }))}
/>
```

## Tune

Use one open row for a reading sequence and keep media geometry stable. The title should still make sense when the gallery is closed.

## Accessibility and reduced motion

Use `aria-expanded` and `aria-controls` on each row button with a labelled region for the media. Reduced motion removes height and clip travel while preserving the same content.
