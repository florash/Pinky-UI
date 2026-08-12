# Morph Lightbox

## What it does

Morph Lightbox expands a selected thumbnail into a focused media collection
view while preserving which thumbnail the user chose.

## Interaction anatomy

- **Trigger:** a labelled thumbnail surface.
- **State:** closed, open at an index, browsing and closing.
- **Motion:** the selected thumbnail becomes the expanded media surface.
- **Surface:** media, caption and explicit previous/next controls.
- **Feedback:** dialog focus, current media label and close behaviour stay clear.

## Good for

- Short photography, portfolio or product galleries.
- Media where the thumbnail and expanded view share a recognisable identity.
- A focused inspection task with a small number of deliberate steps.

## Avoid for

- Huge feeds, arbitrary modal content or unrelated media.
- Media whose captions or controls are essential but cannot fit the view.
- Autoplay-heavy galleries that need a real player instead.

## Live example

Open a study above, use the visible arrows or keyboard arrows, then close with
Escape or the backdrop. The selected thumbnail is the entry point.

## Usage

```tsx
<MorphLightbox
  label="Project studies"
  items={studies.map((study) => ({
    id: study.id,
    label: study.title,
    thumbnail: <StudyThumbnail study={study} />,
    media: <StudyMedia study={study} />,
    caption: study.caption,
  }))}
/>
```

## Tune

- Keep the collection small enough for previous/next inspection.
- Make `label`, alt text and captions useful before adding more motion.
- Supply fixed media geometry to avoid jumps while the dialog opens.
- Lazy-load host media; do not preload every video or full-resolution image.

## Accessibility

- Thumbnails need meaningful labels and remain keyboard-operable buttons.
- Keep dialog semantics, focus trap/restoration, Escape and backdrop close.
- Previous and next controls need visible labels and a current item context.
- Touch users get explicit controls; swipe is not a requirement.

## Reduced motion

The selected media opens immediately and browsing remains available. The
dialog, focus path and close feedback do not depend on the morph animation.
