# Manual device checklist

For real-device verification after deploy — the things this environment
cannot check itself (real Safari, real iOS/Android hardware, actual
address-bar collapse, actual notch/home-indicator geometry). Sandbox
verification (typecheck, tests, Playwright crawls at emulated viewports) is
already done for everything on this list; this is the pass that catches
what emulation can't.

Format: page → action → what to look for. Check the box, and if something
fails, note the device/OS/browser version next to it rather than just
unchecking.

## A. Mobile navigation panel

The panel fixed in this branch — verify the fix holds on real WebKit, not
just Chromium.

- [ ] Any page, narrow phone (iPhone SE/mini class) → tap the hamburger →
      title reads "Pinky UI navigation" in full, not clipped
- [ ] Same → panel is a single column edge-to-edge, no horizontal scroll,
      no content cut off on either side
- [ ] Rotate to landscape while open → panel still fits, no clipped title,
      groups still tappable (don't need to re-test every group, just that
      layout survives the width change)
- [ ] Scroll Safari's address bar away (so the viewport grows) while the
      panel is open → panel height adjusts smoothly, doesn't jump or
      overshoot past the screen
- [ ] Tap "Components" / "AI" / "Layouts" / "Experiences" / "Mobile" →
      each expands to its own links, chevron flips, previous group's
      links don't visually overlap the newly-opened one
- [ ] Tap two group headers in quick succession → no stuck-open state, no
      double-expanded panel, ends on whichever was tapped last
- [ ] Scroll the panel's content to the very bottom → last link isn't
      hidden behind the home indicator / bottom safe area
- [ ] Every link and group header row taps cleanly on the first touch —
      no need to tap twice or slightly off-row

## B. GridReveal disclosure panels (15 call sites)

Same primitive everywhere (`grid-template-rows`/`columns: 0fr → 1fr`), but
each usage wraps different content — check each one, not just the
primitive. For every row: open it, confirm no visual jump/flash and no
content clipped mid-transition; close it, confirm it returns fully to
zero size (no leftover gap); then re-check with iOS **Settings → 
Accessibility → Motion → Reduce Motion** on — it should switch state
instantly with no animation, not a broken half-open frame.

| # | Component | Where |
|---|---|---|
| 1 | ThinkingPanel | `/ai/thinking-panel` |
| 2 | ToolCallCard | `/ai/tool-call-card` |
| 3 | ExpandButton | `/components` — tactile buttons section (no dedicated detail page; search the page for "Expand") |
| 4 | ExpandableMenu | `/components` — menu triggers section (no dedicated detail page; search for "Expandable Menu") |
| 5 | MorphingMegaNavigation | `/experiences/morphing-mega-navigation` |
| 6 | SlidingMegaPanel | `/experiences/sliding-mega-panel` |
| 7 | ProgressiveDisclosure | `/workflows/progressive-disclosure` |
| 8 | ExpandableDataRow | `/systems/expandable-data-row` |
| 9 | FloatingActionIsland | `/workflows/floating-action-island` |
| 10 | ContentAwareSheet ("Show more detail") | `/workflows/content-aware-sheet` |
| 11 | ExpandInPlaceCard | `/workflows/expand-in-place-card` |
| 12 | ExpandableListRow | `/workflows/expandable-list-row` |
| 13 | ExpandableContentRow | `/systems/expandable-content-row` |
| 14 | AccordionGallery | `/systems/accordion-gallery` |
| 15 | ExpandingActionSurface | `/systems/expanding-action-surface` |

- [ ] #1 ThinkingPanel — open/close clean, content not clipped, focus lands somewhere sensible on open
- [ ] #2 ToolCallCard — open/close clean, JSON/args content not clipped
- [ ] #3 ExpandButton — label reveal doesn't jump, collapsed state keeps the label as the accessible name (VoiceOver: swipe to it collapsed, should still announce the label)
- [ ] #4 ExpandableMenu — label reveal doesn't jump
- [ ] #5 MorphingMegaNavigation — panel opens without shifting surrounding nav items
- [ ] #6 SlidingMegaPanel — panel opens without shifting the sticky header height
- [ ] #7 ProgressiveDisclosure — "Show advanced" content not clipped mid-open
- [ ] #8 ExpandableDataRow — row detail not clipped, table layout doesn't jump horizontally
- [ ] #9 FloatingActionIsland — action buttons don't overflow the pill as they reveal
- [ ] #10 ContentAwareSheet — "Show more detail" content not clipped inside the sheet
- [ ] #11 ExpandInPlaceCard — surrounding cards reflow smoothly, no overlap mid-transition
- [ ] #12 ExpandableListRow — detail not clipped
- [ ] #13 ExpandableContentRow — media + text panel not clipped
- [ ] #14 AccordionGallery — image/detail panel not clipped, previous item closes as new one opens
- [ ] #15 ExpandingActionSurface — action toolbar not clipped, focus moves into it on open
- [ ] Any one of the above with Reduce Motion on → instant state change, no half-open frame, no residual animation

## C. Outstanding findings — real-device-only, previously report-only

Flagged in earlier audits but never verified on hardware because none of
it is observable from a Playwright/emulated-viewport check. Do these once
per iOS and once per Android if you have both.

- [ ] `horizontal-story.tsx` (`/effects` → Scroll → Horizontal Story) — scroll
      to the sticky section with Safari's address bar in its **collapsed**
      (scrolled) state → bottom of the sticky content isn't cut off by the
      address bar re-appearing (`100vh` vs `100dvh`)
- [ ] `morphing-hero.tsx` (`/experiences/morphing-hero` or wherever it's
      mounted) — same check, address bar collapsed vs expanded, hero fills
      correctly either way
- [ ] Mobile login/verification demo inputs (`/mobile` → mobile-showcase,
      login/verification fields) — tap into the field → page does **not**
      zoom in (confirms `font-size >= 16px`; if it zooms, it's still <16px
      on this device)
- [ ] `input-expansion.tsx` inputs/selects (`/systems` → Forms → Input
      Expansion) — same tap-and-check-for-zoom test
- [ ] Any horizontally-scrollable/swipeable surface (carousels, swipe-to-
      dismiss cards, horizontal story) — double-tap quickly inside it →
      confirm the browser does **not** zoom the page (checks `touch-action`
      is actually suppressing the double-tap-zoom gesture, not just
      pinch-zoom)
- [ ] Same surfaces — single continuous swipe doesn't also trigger a
      page-level rubber-band overscroll bounce that fights the component's
      own gesture
- [ ] Header logo link (every page, top-left "Pinky UI") — tap target feels
      reachable on first tap without zooming in first (known undersized at
      99×28; not fixed, just confirming how bad it actually feels on real
      hardware vs the visual-only crawler measurement)
