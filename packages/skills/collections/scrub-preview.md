# Scrub Preview

## Purpose

Use a bounded scrub surface to inspect supplied content frames by position. It is a discovery interaction for product angles, project frames or visual process—not a video player.

## Interaction anatomy

- Pointer position maps to a capped frame index.
- Arrow, Home and End provide point-by-point keyboard reading.
- Touch can drag the surface or choose an explicit frame marker.

## Good for

Short frame sequences, product angles, article sections and process studies.

## Avoid

Long video playback, autoplay timelines or controls that need transport semantics.

## Usage

```tsx
<ScrubPreview
  label="Product frames"
  frames={frames.map((frame) => <Frame src={frame.src} alt={frame.alt} />)}
  labels={frames.map((frame) => frame.label)}
/>
```

## Tune

Keep the frame count small, bound pointer mapping and retain the last readable frame on leave. Avoid setting React state for every pointer pixel.

## Accessibility and reduced motion

Expose slider value text, visible frame markers and keyboard movement. Reduced motion changes frames immediately; it does not remove the frame labels or current position.
