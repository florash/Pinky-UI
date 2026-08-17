# Nav accessibility

## The baseline every nav component in this library must clear

- **Real elements.** A navigation item is an `<a href>` if it goes
  somewhere, a `<button>` if it opens something. Never a `<div
  onClick>` standing in for either — that alone breaks keyboard access,
  screen readers and the browser's own link affordances (middle-click,
  open-in-new-tab, drag-to-bookmark).
- **Landmarks and roles.** Top-level navigation is `<nav aria-label="…">`.
  A dropdown panel is `role="menu"` with `role="menuitem"` children, or a
  plain list of real links if the "menu" is really just a set of
  destinations (menu semantics imply the arrow-key/Home/End contract below
  — don't claim `role="menu"` without delivering it).
- **`aria-current="page"`**, not just a colour or a moving pill, marks the
  active destination. The pill is the enhancement; the attribute is the
  content.
- **`aria-expanded` and `aria-haspopup`** on any trigger that opens a
  panel, kept in sync with the actual open state, not just set once.

## Keyboard contract for an open menu

- **Escape** closes it and returns focus to the trigger that opened it —
  never to the page body, which strands a keyboard user.
- **Arrow Down/Up** move between items; **Home/End** jump to the first and
  last. This is the same contract as the ARIA menu and tabs patterns —
  don't invent a different one per component.
- **Tab** closes the menu and continues the natural tab order, rather than
  trapping focus inside indefinitely. A nav dropdown is not a modal.
- **Outside pointerdown** (not `click` — see the implementation note below)
  closes the menu.

## Focus management specifics

- On open, focus moves to the first menu item, not to the panel container.
- On close via Escape or an item activation, focus returns to the trigger.
- The outside-dismiss listener should bind to `pointerdown`, not `click` —
  `click` fires after `pointerup`, which is late enough that a fast
  double-interaction can re-open a menu the same gesture just closed.

## Reduced motion

Every nav component here branches on `prefers-reduced-motion`. The
indicator pill jumps instead of sliding; a mega menu appears instead of
scaling in; nothing about *reachability* changes — only the transition
does. A reduced-motion user must be able to describe the navigation to a
default-motion user without noticing they experienced something different.

## Touch targets

Every interactive nav element — link, trigger, menu item — keeps a minimum
44×44px hit area, even when its visible label is smaller. Padding, not font
size, is what makes that true.

## Related

[[choosing-a-nav]], [[indicator-motion]], [[touch-fallback]]
