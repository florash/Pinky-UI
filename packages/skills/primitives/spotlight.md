# Spotlight

## Purpose

Lights the face of a surface under the pointer.

## Use it when

A surface should acknowledge the pointer without moving.

## API shape

`size`, `intensity`, `color`, `range`.

## Judgment

The distinction that matters when choosing: Glow Border lights the *edge* of a
surface, Spotlight lights its *face*. Edge light frames something; face light
draws the eye into a region of it. Using both on one surface doubles the effect
and halves the meaning.

Because nothing moves, this is the effect to reach for in dense layouts where
motion would be noise.

## Performance

One gradient and two CSS variables. Opacity is rounded so a resting pointer
produces no style writes at all.
