# Morph

## Purpose

Expands one surface into another as a single continuous object, with full dialog
semantics.

## Use it when

A compact surface should become a detailed one and the user must not lose track
of which thing became which.

## API shape

`children` is the collapsed state, `expanded` is the panel, `label` names the
dialog. Controlled via `open` / `onOpenChange` or left uncontrolled.

## Judgment

The continuity is the entire value. If the collapsed and expanded states share
no visual identity — different colours, different proportions, unrelated content
— a morph will confuse rather than orient, and a plain dialog is the better
choice.

Never use it for destructive confirmations. Playful spatial transitions
undermine the seriousness those moments need.

## Accessibility — non-negotiable

Dialog role, `aria-modal`, Escape to close, focus trap, focus restoration to the
trigger, scroll lock. If you fork this primitive, keep all of it.

## Performance

The expanded content mounts only while open. Keep it that way.
