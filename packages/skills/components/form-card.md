# Form Card

## Purpose

A form's visual container — title/description, a field area (plain
`children`), an action footer. Renders a plain `<div>`, never a `<form>`.

## Good for

- sign-in/sign-up panels, settings forms, any grouped set of fields with
  one submit action

## Avoid for

- a single inline field with no surrounding form structure — that doesn't
  need a card at all
- wrapping something that's already inside a page-level `<form>` with its
  own nested `<form>` tag — this component deliberately never renders one
  itself for exactly this reason; the caller supplies the real `<form>`
  (or doesn't have one, for a dialog that submits some other way)

## Recommended defaults

Fields go in `children` as plain composed elements — this isn't a
`fields={[]}` array API, same reasoning as every other structural card's
"Slots" section in `docs/card-api-conventions.md`. Put the submit button
(and a cancel button, if there is one) in `footer`, not inside `children`
mixed in with the fields.

## Accessibility

- Not focusable as a whole; every field inside owns its own label and
  focus behavior — this component contributes no focus management of its
  own.
- Because it never renders a `<form>`, it cannot accidentally create the
  nested-form-inside-form bug class; the caller's real `<form>` element
  is what governs submit-on-Enter and native validation.

## Performance

No pointer tracking, no motion values. Safe in any quantity.

## Composition

The family's shared shape lives in `docs/card-api-conventions.md` — read
that once, not per card.
