# Jelly

## Purpose

Elastic lean, drift and settle, with squash and stretch on press. The soft body
behind Jelly Card.

## Use it when

You want a surface of your own to feel physically soft.

## API shape

`elasticity` blends the spring from calm to overshooting; `intensity` scales how
far the surface leans and drifts; `squash` adds volume-preserving compression on
press.

## Judgment

Keep `intensity` at or below `0.3` for anything containing text. The deformation
is a 3D rotation, and text on a strongly rotated plane is harder to read even
when it is still legible.

`elasticity={0}` genuinely settles without a wobble — use it when you want the
lean but not the bounce.

## Performance

Pointer position is written straight into motion values, so tracking never
re-renders React. One `getBoundingClientRect` per pointer move on the tracked
element only.
