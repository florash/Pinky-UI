# Parallax

## Purpose

Pointer-driven depth: layers inside move by different amounts from one shared
pair of motion values, so a flat surface reads as a small stack of planes.

## Use it when

You have two or three genuinely different depths to express — a face and one
or two badges or labels floating above it. Not a general-purpose hover effect.

## API shape

`<Parallax>` owns the shared pointer motion values; `<ParallaxLayer depth={n}>`
children read from them. `depth` is relative displacement, not a physical
unit — `0` sits with the face, higher values drift further.

## Judgment

Two layers read as depth. Four or more read as jitter. Keep the face itself
still or nearly still and let one or two accents carry the movement — that
contrast is what sells the depth, not the amount of travel on any one layer.

Never nest a second `Parallax` inside a `ParallaxLayer`; depths compound and
stop reading as a coherent stack.

## Performance

One shared pointer subscription for the whole tree; layers read motion values
directly and never trigger a React render. Cheap enough for several instances
on one page.
