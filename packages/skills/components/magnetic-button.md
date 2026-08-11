# Magnetic Button

## Purpose

Use Magnetic Button for primary actions that deserve to feel responsive before
they are even clicked. The button leans toward an approaching pointer and the
label drifts slightly further, which reads as depth rather than as dragging.

## Good for

- primary calls to action with space around them
- hero and landing-page actions
- sparse toolbars

## Avoid for

- dense button groups, where overlapping proximity fields fight each other
- destructive actions, which should feel deliberate rather than eager
- rows inside tables and lists

## Recommended defaults

`strength={0.4} range={110} maxOffset={8}`. The 8px cap is a house rule: the
user must still perceive the button as anchored to its position. If a button
appears to chase the cursor, the effect has failed.

Use `wrapperClassName` for layout (display, visibility, grid placement) and
`className` for the button's own styling.

## Accessibility

- It is a real `<button>` — every native attribute and event is forwarded.
- Keyboard focus and activation work with no pointer involved.
- Disabled buttons opt out of magnetism as well as clicks.
- The hit area never separates from the visible label.

## Performance

Proximity is computed from one shared pointer subscription; the rect is cached
and re-measured only on resize and scroll. Many magnetic buttons on a page are
cheap. The reason to limit them is visual, not computational.

## Composition

Good: `<Magnetic strength={0.12}><GlowBorder><Button /></GlowBorder></Magnetic>`
for a framed CTA.

For dense toolbars or touch-first interfaces, prefer Ripple Button — press
feedback beats proximity where pointers are scarce.
