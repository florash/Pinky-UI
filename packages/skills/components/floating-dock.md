# Floating Dock

## Purpose

Use Floating Dock for a small set of contextual destinations or tools. The dock
rests as a compact utility surface, keeps the active destination expanded with
its label, and adds pointer proximity only as a desktop targeting enhancement.

## Good for

- a handful of primary destinations
- persistent app-level tools on wide screens
- demo and portfolio interfaces

## Avoid for

- more than about eight items
- primary navigation on mobile, where proximity has no meaning
- icons that are not genuinely recognisable without labels

## Recommended defaults

`magnification={1.35} distance={120}`. Keep magnification under about `1.6`;
past that, neighbouring items are pushed around enough that the dock becomes
harder to hit rather than easier.

## Accessibility

The dock must be fully usable without pointer proximity, and it is:

- a `nav` landmark containing real links or buttons
- every item carries a permanent visually-hidden label; the hover label is
  decoration, not the accessible name
- Tab and Enter operate it with no proximity involved
- The active item keeps a visible label, so touch users do not need a hover
  tooltip to understand the current destination
- active items expose `aria-current` (links) or `aria-pressed` (buttons)
- magnification is skipped for touch, so nothing swells under a finger

Never rely on the proximity label to tell the user what an icon does. If an icon
needs the label to be understood, show a permanent one.

## Performance

All items share one pointer subscription and one rect cache through the
Proximity primitive, so a ten-item dock costs the same as a one-item dock. Rects
are re-measured on resize and scroll, never inside the pointer loop.

## Composition

Do not wrap dock items in Magnetic — two proximity systems on one element
produce movement no user can predict.
