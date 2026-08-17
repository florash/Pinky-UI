# @pinky-ui/skills

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

Keep it short, prescriptive and useful beside a live preview. Cover, in this
order:

1. `What it does` — one direct interaction description.
2. `Interaction anatomy` — trigger, state, motion, surface and feedback.
3. `Good for` / `Avoid for` — the judgment, stated plainly.
4. `Live example` and `Usage` — the smallest honest composition.
5. `Tune` — three to five variables that materially change the feel.
6. `Accessibility` — keyboard, focus, touch and reduced-motion behaviour.

The website highlights a small set of representative recipes with actual
interactive previews. A skill can stay useful without exposing the entire API;
the registry owns props, defaults, status and import metadata.

Name the file after the component slug: `jelly-card.md`.

## Effect guidance

Interaction effects live in `cursor/`, `motion/`, `text` and `scroll/`.
Experience-level guidance lives in `navigation/`, `heroes/`, `backgrounds/`,
`transitions/` and `spatial/`. Each folder is shown directly by the website
Skills catalog. Product interaction guidance lives in `media/`, `forms/` and
`data/`; system-level restraint guidance remains in `patterns/`.
