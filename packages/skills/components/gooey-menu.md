# Gooey Menu

## Purpose

Use Gooey Menu when navigation should carry personality. The selection is two
shapes moving at different speeds, fused by a blur-and-contrast layer, so it
appears to stretch between items and snap back together.

## Good for

- section switchers with three to five items
- playful marketing and portfolio navigation
- filter bars where character is welcome

## Avoid for

- dense application chrome
- long lists — the blob has to travel too far and the effect turns sluggish
- anywhere selection must be readable instantly from a distance

## Recommended defaults

`stickiness={1}`. Above `1.6` the trailing shape lags far enough that the menu
starts to feel slow, which is the usual failure of gooey navigation. Set
`stickiness={0}` for a plain, fast indicator.

## Accessibility

- Real links or buttons inside a `nav` landmark; the goo is one `aria-hidden`
  layer behind them.
- Labels sit above the filtered layer, so text stays perfectly crisp. Never put
  text inside the filtered layer.
- Selection is conveyed by `aria-current`.
- Standard Tab order — there is no custom key handling to learn.

## Performance

The blur-and-contrast filter is confined to one small decorative layer, not
applied to a container full of text, and it is dropped entirely under reduced
motion. Do not scale this technique up to a large area: filtered layers get
expensive with size, not with element count.

## Composition

Use as a section switcher, not as a component wrapper. Do not nest interactive
Pinky components inside menu items.
