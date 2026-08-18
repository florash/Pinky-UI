# Media Card

## Purpose

An image or video fills the top edge-to-edge; title, description and
footer sit below it, padded. Use when the media is the reason someone
looks at the card — an article preview, a product photo, a portfolio piece.

## Good for

- article and blog post previews
- product tiles with a hero photo
- anything where cropping the image to a fixed aspect ratio is acceptable

## Avoid for

- content where the media is secondary to the text — use Horizontal Card,
  which gives the text equal billing instead of subordinating it below a
  large image
- content with no real media — an empty or placeholder image slot reads
  worse than no image slot at all; use Basic Card

## Recommended defaults

`mediaAspect="video"` (16:9) covers most real photography and video
thumbnails. Switch to `"square"` for avatars or square source material
rather than letting the browser's `object-cover` crop unpredictably —
decide the crop intentionally, at the aspect-ratio level, not by accident.

## Accessibility

- The media slot has no built-in `alt` text — that's the caller's
  responsibility on the `<img>`/`<video>` passed in. An empty `alt=""` is
  correct only when the image is genuinely decorative and the title/
  description already say everything a reader needs.
- Same `focus-visible` rule as Basic Card once `onClick`/`href` is present.

## Performance

`object-cover` and a fixed aspect ratio (`aspect-video`/`aspect-square`/
`aspect-[3/4]`) reserve the image's layout space before it loads — no
layout shift once the real image arrives, without needing explicit
width/height props.

## Composition

Grid of Media Cards is the most common shape for a content index page.
Keep every card in the same grid at the same `mediaAspect` — mixed aspect
ratios in one grid read as a bug, not a design choice, unless the layout
is deliberately masonry-style.
