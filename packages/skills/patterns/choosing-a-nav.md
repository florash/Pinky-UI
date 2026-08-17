# Choosing a nav

## The question

Navigation scales with content, not with taste. A five-link marketing site
and a 600-page reference site need structurally different navigation, and
picking the heavier one too early makes a small site feel like a product
console — picking the lighter one too late makes a large site unfindable.

## By scale

- **A handful of top-level destinations (≤7), no sub-pages** → Pill Nav or
  Underline Nav. A flat row with a moving indicator is the whole navigation
  story; anything more is decoration.
- **A handful of top-level destinations, each with a few sections** → Pill
  Nav for L1, a Mega Menu dropdown for L2. This is what this site's own
  header does: five pills, four of which open a multi-column panel.
- **A single long document or a small set of them** → Scroll Spy Sidebar.
  The document is the navigation; the sidebar just tracks where the reader
  already is.
- **A deep, nested content tree (docs, a file browser, settings)** → Nested
  Sidebar, collapsible per branch, or Sidebar Rail if space is tight and an
  icon-only collapsed state is acceptable.
- **A mobile app or narrow viewport** → Bottom Bar or Dock for primary
  destinations (thumb zone — see [[thumb-zone]]); a full-screen Overlay Menu
  for anything that doesn't fit in four or five bottom slots.
- **A single object's contextual actions** → Radial Menu or a plain context
  menu, never a full nav component repurposed for a one-off case.

## The trap to avoid

Building the heaviest option "to be safe" is the most common mistake. A mega
menu over three links reads as broken, not thorough — it has to visibly
justify the multi-column layout with real grouped content, or it should be
a flat dropdown instead.

## This site's own choice

Explore / Components / Layouts / Experiences / Mobile is exactly the
"handful of destinations, each with a few sections" shape — Pill Nav plus a
Mega Menu per group, described with one line each rather than left as bare
labels. Docs and Skills are long single documents, so they get a Scroll Spy
Sidebar instead of another dropdown.

## Related

[[nav-accessibility]], [[indicator-motion]], [[thumb-zone]]
