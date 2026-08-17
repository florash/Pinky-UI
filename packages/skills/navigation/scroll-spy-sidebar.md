# Scroll Spy Sidebar

## Purpose

`ScrollSpySidebar` is a docked vertical table of contents whose indicator
bar follows whichever heading is currently in the reading window — the
same `IntersectionObserver` mechanic as Section-Aware Navigation, laid out
as a sidebar for a long single document instead of a horizontal tab strip
for a page's local sections.

## Interaction anatomy

- **Anchors:** each item points to a real heading id in the document.
- **Observer:** the active heading is chosen from the reading window, not
  from scroll position math.
- **Indicator:** a vertical bar next to the active item, sharing a
  `layoutId` so it travels rather than jumping between items.
- **Fallback:** every anchor is a real link and still works if
  `IntersectionObserver` is unavailable.

## Live example

Scroll the document; the sidebar's active item and indicator bar follow.
Clicking an item jumps there directly and sets it active immediately,
without waiting for the observer to catch up.

## Usage

```tsx
import { ScrollSpySidebar } from "@pinky-ui/experiences";

<ScrollSpySidebar
  className="sticky top-24"
  sections={[
    { id: "installation", label: "Installation" },
    { id: "composition", label: "Composition" },
    { id: "motion", label: "Motion rules" },
  ]}
/>;
```

## Tune

- Give it `sticky top-*` so it stays visible while the document scrolls
  past it — the component itself has no positioning opinion.
- Keep the section list short enough to read at a glance; past a dozen
  headings, consider grouping or a page-level index instead.
- The `rootMargin` favours the top third of the viewport, so a heading
  counts as "current" slightly before it reaches the very top — tune this
  in the source if a document's heading density is unusual.

## Accessibility

Every item is a real anchor with `aria-current="location"` on the active
one. The indicator bar is supplemental — labels and anchor targets remain
fully usable without scripting or without the observer running.

## Reduced motion

The indicator jumps to its new position immediately instead of sliding;
anchor scrolling stays native either way.

## When to use

Docs, skill pages and other long single documents read top to bottom. Not
for navigating *between* separate documents — that's ordinary site
navigation, not a scroll spy.
