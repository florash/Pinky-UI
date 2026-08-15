# Content-Aware Sheet

## Purpose

Content-Aware Sheet lets a lower surface grow when the task reveals more content and shrink when that content is dismissed. It uses natural flow with a bounded maximum rather than a fixed viewport percentage.

## Use when

- A short summary sometimes needs a longer explanation.
- A sheet's height should reflect the amount of content currently requested.

## Interaction

Open the summary, choose Show more detail and collapse it again. The surface reflows around the actual content while remaining scrollable at its maximum.

## Accessibility

Use a labelled dialog and an `aria-expanded` disclosure control. The added content must be in the same reading order as the button that reveals it.

## Reduced motion

Add and remove the detail region without height animation; keep the disclosure state explicit.

## Tune

- Set a max height and preserve internal scroll.
- Do not use fixed empty space to simulate content-aware sizing.
