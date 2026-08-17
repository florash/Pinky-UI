# Thumb zone

## The idea

On a phone held one-handed, the thumb sweeps a comfortable arc from the
bottom corners toward the center-bottom of the screen. Anything outside
that arc — especially the top corners — requires a grip shift or a second
hand. Placement of frequent actions should follow this, not just visual
hierarchy.

## The zones

- **Easy (bottom third, center-weighted):** primary actions, the active
  input, navigation the user touches every session. This is where
  `FloatingTabBar`, `StickyBottomCTA`, `ContextualBottomBar` and
  `KeyboardAwareComposer` live by construction — they're bottom-anchored
  because the thumb is already there.
- **Stretch (middle third, and the far corner opposite the thumb):**
  reachable but costs a deliberate stretch or a grip adjustment. Acceptable
  for secondary actions and content that's read more than tapped.
- **Hard (top corners):** back buttons, overflow menus, settings — anything
  low-frequency belongs here specifically *because* it's inconvenient to
  reach by accident. Don't move a frequent action up here for visual
  balance; that trade is backwards.

## How this shows up in the library

- Primary navigation is bottom-anchored (`FloatingTabBar`,
  `MorphingBottomNavigation`, `ScrollCompactBottomNav`), not top-anchored
  like desktop nav.
- `SwipeBackGesture` claims the *edge*, not a corner — reachable one-handed
  from either grip, unlike a top-left back button.
- `ThumbReachMenu` and `QuickActionSheet` surface actions near the bottom
  rather than requiring a reach to a toolbar.
- `LongPressContextMenu`'s peek menu anchors below the held item, keeping
  the revealed actions close to wherever the thumb already is, not
  re-centering to the screen.

## Applying it to new composition

When placing a control, ask: how often is this touched, and by which hand
posture? A frequent, one-handed action belongs in the easy zone even if
that means breaking a purely visual top-to-bottom reading order. A rare or
destructive action belongs in the hard zone — the inconvenience is the
safety margin.

## Related

[[mobile-gesture-conflicts]], [[touch-fallback]]
