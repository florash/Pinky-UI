# Fluid Tabs

## Purpose

Use Fluid Tabs to switch between a handful of peer views. The indicator travels
and stretches between tabs rather than sliding as a rigid pill, which makes the
change of state feel connected.

## Good for

- preview / code toggles
- switching between peer views
- filtering a gallery

## Avoid for

- sequential steps — use a stepper
- more than about seven items, where a select is kinder
- navigation between pages — use links

## Recommended defaults

`variant="solid"` on a page background, `"bare"` inside an existing card.
`size="sm"` for toolbars and card headers.

## Accessibility

Implements the ARIA tabs pattern, and the details matter:

- `role="tablist"`, `role="tab"`, `role="tabpanel"`
- roving tab stop: one Tab press enters the set, arrows move within it
- Left/Right/Up/Down cycle, Home and End jump to the ends
- disabled tabs are skipped by keyboard navigation
- panels are labelled by their tab and are focusable
- selection is conveyed by `aria-selected`, never by the indicator alone

Exactly one panel is mounted at a time. There is deliberately no exit animation:
a panel that lingers after its tab is deselected leaves assistive technology
describing content that is on its way out.

## Performance

The indicator is a single shared element animated with a layout transition. The
stretch is one spring on a child element, so it cannot fight the layout
animation. Rapid switching is safe — the spring simply retargets.

## Composition

Fine inside any Pinky surface. Prefer Gooey Menu when the switcher is a piece of
page navigation with personality; prefer Fluid Tabs when it is UI.
