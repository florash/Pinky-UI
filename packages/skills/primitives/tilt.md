# Tilt

## Purpose

Rigid perspective tilt with an optional specular highlight.

## Use it when

A surface should behave like a solid plane catching light rather than something
soft.

## API shape

`max` caps rotation per axis; `lift` moves the surface toward the viewer on
hover; `glare` adds a pointer-tracked highlight.

## Judgment

Default `max={4}`. Past about 8° a card stops reading as a surface in space and
starts reading as an effect. Never combine with Jelly on the same element.

## Performance

One handler, one rect read per pointer move, transform-only output.
