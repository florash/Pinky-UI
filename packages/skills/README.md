# @pinky/skills

Usage guidance for coding agents, one file per component.

A skill answers the question a props table cannot: *should I reach for this
component here, and how do I use it without making the interface worse?* The
structured facts — props, presets, defaults, status — live in
`packages/registry` and are not repeated here.

## Status

These are plain Markdown files. There is **no** `npx pinky-ui skill add` command;
that command is the eventual goal, not something that exists. Nothing in this
directory should be described as installable today.

## Writing one

Keep it short and prescriptive. Cover, in this order:

1. What the component is for.
2. Two or three situations where it is the right choice.
3. The situations where it is the wrong choice, stated plainly.
4. Parameter guidance — the range that stays tasteful, not the full API.
5. The accessibility and reduced-motion constraints an agent must not drop.

Name the file after the component slug: `jelly-card.md`.

## Effect guidance

Interaction effects live in `cursor/`, `motion/`, `text` and `scroll/`.
Experience-level guidance lives in `navigation/`, `heroes/`, `backgrounds/`,
`transitions/` and `spatial/`. Each folder is shown directly by the website
Skills catalog; system-level restraint guidance remains in `patterns/`.
