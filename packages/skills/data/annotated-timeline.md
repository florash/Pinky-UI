# Annotated Timeline

## Purpose

A trend and its meaningful events share one reading structure so change has context, instead of a plain line chart with a caption underneath explaining what happened.

## Good for

- Trends where releases, incidents or campaigns explain a change

## Avoid for

- Full project planning timelines or arbitrary task scheduling

## Usage

```tsx
<AnnotatedTimeline data={trend} annotations={events} label="Launch timeline" />
```

## Accessibility

- Event markers are labelled buttons with focus, pressed state and a readable context panel.
- The chart still exposes Arrow/Home/End point reading when no event is selected.

## Performance

- Annotations are a small set of positioned buttons; there is no timeline-sized DOM canvas.

Related: timeline-scrubber, interactive-line-chart.
