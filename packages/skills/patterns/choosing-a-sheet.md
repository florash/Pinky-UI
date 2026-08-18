# Choosing a sheet

## The problem this solves

Pinky ships six sheet-shaped surfaces because they solve genuinely different
problems — not because there's one canonical sheet with variants. Picking the
wrong one shows up as a fixed 80vh shell around three lines of content, or a
detent sheet where a card dismiss gesture would have been simpler.

## The decision

- **A short, spatially related task** (filters, a single action) →
  **Bottom Sheet**. The default; reach for it first.
- **The sheet needs named, stable stopping points** — peek, half, full, each
  reachable by drag, button or keyboard → **Detent Sheet**. Use this instead
  of Bottom Sheet the moment a design calls for more than one resting height.
- **Content height varies a lot and a fixed shell would waste or clip space**
  → **Content-Aware Sheet**. It grows with what's inside and stays bounded
  and scrollable — no forced 80vh around a two-line confirmation.
- **The surface is a single card, not a list or form, and should feel like
  it's being physically pulled away** → **Swipe-to-Dismiss Card Sheet**. The
  card itself communicates release through travel and scale; use this for
  previews and detail cards, not for multi-field content.
- **Search is the entire purpose of the sheet** → **Bottom Search Sheet**.
  Purpose-built keyboard-aware results continuity; do not repurpose Bottom
  Sheet for a search flow that will grow its own state.
- **A command/action list needs a mobile-reachable equivalent to a desktop
  shortcut** → **Quick Action Sheet**. Searchable actions close to the
  thumb; this is the mobile answer to Command Palette, not a generic
  bottom sheet with a list in it.

## What they share

Focus restoration, safe-area inset handling and Escape/back-gesture
dismissal are baseline on all six — that consistency is what makes picking
the wrong one low-risk relative to, say, building a bespoke modal. But the
right choice still keeps the interaction legible: a sheet that keeps
changing its own rules (height, dismiss gesture, content shape) mid-task
reads as unstable.

## Related

[[mobile-gesture-etiquette]], [[touch-fallback]]
