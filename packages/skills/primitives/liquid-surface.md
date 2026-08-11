# Liquid Surface

## Purpose

A translucent surface with a pointer-tracked specular highlight and a refracting
edge.

## Use it when

You want glass that responds to light, on your own markup.

## API shape

`intensity` drives the highlight and edge, `blur` sets the backdrop filter,
`tint` picks the colour wash, `depth` controls apparent thickness.

## Judgment

This is a hierarchy tool, not a texture. One or two per screen reads as premium;
a page of them reads as a phone wallpaper.

Deliberately avoided here, and you should avoid adding them: chromatic
aberration, animated wobble, and large mouse-following gradients. Those are the
three things that turn "liquid" into a novelty.

`blur={0}` keeps the highlight and edge while removing the expensive part. Reach
for it whenever the surface is not actually over something worth blurring.

## Performance

No SVG filters and no per-frame JavaScript — the pointer writes two CSS
variables. The `backdrop-filter` is the only real cost, and it is the most
expensive thing in the library. Budget accordingly.
