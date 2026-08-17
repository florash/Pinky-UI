# Pill Nav

## Purpose

Real navigation links with a shared pill background that slides to whichever
one is current — Fluid Tabs' indicator mechanic, applied to `<a href>`
instead of tab buttons. Built for a primary site or app navigation bar, not
for switching between views on one page.

## Good for

- a primary navigation bar with a handful of top-level destinations
- route-based navigation where the current page should read as a persistent,
  moving highlight
- pairing a flat link and a dropdown trigger in the same row — the pill
  slides between them identically, since the indicator only cares about
  `active`, not whether the item is a link or a button

## Avoid for

- switching between peer views without a URL change — that's [[fluid-tabs]]
- more than about seven destinations, where the pill row stops reading as a
  deliberate set and starts reading as a menu that needs its own scroll
- a track that needs horizontal scroll — turn on `scrollable`, but know it
  forces `overflow-y` to compute as `auto` too, which will clip any item's
  dropdown `panel`. Don't combine `scrollable` with dropdown items.

## Usage

```tsx
<PillNav
  aria-label="Main"
  items={[
    { id: "explore", label: "Explore", href: "/explore", active: pathname === "/explore" },
    { id: "docs", label: "Docs", href: "/docs", active: pathname === "/docs" },
  ]}
/>
```

For a dropdown trigger instead of a link, omit `href` and supply `onClick`,
`aria-expanded`, `aria-haspopup="menu"` and a `panel` (rendered inside a
`position: relative` wrapper around that item, so an absolutely-positioned
menu anchors to it correctly).

## Accessibility

- Renders real `<a>` or `<button>` elements — never a `div` with a click
  handler standing in for either.
- `aria-current="page"` marks the active link; trigger items expose
  `aria-expanded` and `aria-haspopup` for their own dropdown.
- The active state comes entirely from the caller's router — back/forward
  navigation and direct links land on the correct pill with no extra wiring,
  because there is no internal "selected" state to get out of sync.

## Reduced motion

The pill jumps directly to the active item; the stretch-on-arrival spring is
skipped entirely.

## Performance

The indicator is one `motion.span` with a shared `layoutId`, so Motion
animates it as a single continuous element between differently-positioned
items rather than cross-fading two.

## Composition and anti-patterns

This is the site's own primary navigation component — see
`apps/website/src/components/site/site-header.tsx` for the reference
composition, including a mega-menu `panel` per dropdown trigger.
