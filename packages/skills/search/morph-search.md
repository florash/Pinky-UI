# Morph Search

## Purpose
Use when a compact search trigger should become an active field without losing object identity or focus.

## Use when
Header, toolbar, or collection search needs a quiet expansion and autofocus.

## Avoid
Long result sets without a dedicated search page or a modal that merely fades in.

## Accessibility
Label the search input, provide Clear and Close controls, and restore focus to the trigger on Escape.

## Keyboard and touch
Support typing, Escape, clear, and a full-width touch field; never require a hover state.

## Reduced motion and performance
Use layout/opacity only and keep filtering controlled by the host.

## Composition and anti-patterns
Compose SearchResultsMorph for results; use CommandPalette for actions rather than mixing meanings.
