# Card API conventions

The shape every card in `packages/components/src/cards/` follows, so a
caller who's learned one has learned the family. Established while
building the structural batch (Basic/Media/Horizontal/List); the existing
effect cards (Jelly/Liquid/Morph/Spotlight/Tilt) predate this document and
aren't retrofitted to it retroactively — new cards, including the rest of
the effect batch, follow it from the start.

## Props every card accepts

```ts
type CardBaseProps = {
  radius?: "md" | "lg" | "xl" | "2xl";
  padded?: boolean;
  shadow?: "neutral" | "pink";
  className?: string;
  surfaceClassName?: string;
  disabled?: boolean;
};
```

- **`radius`** — same four-step scale as the existing cards
  (`rounded-md/lg/xl/2xl`), default `"xl"`. Don't introduce a fifth step
  without a real layout that needs it.
- **`padded`** — `true` by default (`p-6 sm:p-7`, matching Liquid Card).
  `false` for edge-to-edge media (Media Card's image slot, for example) —
  never invent a second padding prop for that, turn this one off and let
  the caller's own content control spacing inside.
- **`shadow`** — `"neutral"` by default, using the site-wide
  `shadow-soft`/`shadow-lift` tokens (cool blue-grey — see their comment in
  `globals.css` for why). `"pink"` opts into `shadow-pink-soft`/
  `shadow-pink-lift` instead. Structural cards (Basic, Media, Horizontal,
  List, Profile, Stat, Pricing, Form, Notification, EmptyState) should
  leave this at the default — a shadow isn't their visual point. Reach for
  `"pink"` on the effect cards where the shadow *is* part of the effect
  (Glow Card, Lift Card) — decide per component, don't flip the family
  default without a reason logged in that component's own file, the way
  Lift Card's doc comment explains why it exists next to Jelly Card.
- **`className`** — the outer element. Grid/flex placement (`col-span-2`,
  `self-start`) goes here, never on the surface.
- **`surfaceClassName`** — the inner surface. Background/text-color
  overrides go here, matching Jelly Card and Liquid Card today.
- **`disabled`** — turns off any pointer-driven effect the card has (a
  no-op on purely structural cards that don't have one — accept the prop
  anyway so a caller swapping between card types doesn't hit a type error).

Radius, padded and shadow all use a plain `Record<..., string>` lookup
table at the top of the file (`RADIUS`, same pattern in every existing
card) — not a `cva`/`class-variance-authority` dependency. Keep it that
way; the variant counts here don't justify the package.

## Polymorphism — `as`

Any card that can reasonably be the *whole* clickable/navigable target
(Basic Card, Media Card, Horizontal Card, Pricing Card's own surface, a
Profile Card acting as a link to the profile) accepts:

```ts
as?: ElementType; // default "div"
href?: string;     // present only when as={Link} makes sense
```

Same escape hatch `KineticUnderline` already uses (`as={Link}` from
`next/link`, not `as="a"` — seeing why is the entire point of this
session's nested-anchor and broken-internal-link fixes: a raw `"a"` or
`"button"` string bypasses `next/link`'s automatic `basePath` prefixing
and can't be composed safely inside another interactive element). A card
that will only ever be a static container (List Card, Form Card,
Notification Card, EmptyState Card) doesn't need `as` at all — don't add
it speculatively.

## Focus rule — decided now, applies to every future card

**Any card that accepts `onClick` or `href` must be focusable as a whole
and must show a `focus-visible` ring equivalent to its hover state** — not
the browser default outline, and not nothing. Concretely:

```ts
"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25 focus-visible:ring-offset-2"
```

(the exact class list `Morph` and Tilt Card already use — copy it, don't
reinvent the ring color/width). A purely-decorative container with no
`onClick`/`href` of its own doesn't need this: focus feedback belongs to
whatever focusable child the caller puts inside it instead. This is the
one place the existing effect cards fall short of this document — Jelly,
Liquid and Spotlight Card have no focus-visible ring on their own shell,
because none of them currently accept `onClick`/`href`. That's consistent
with this rule as written, not an exception to it; it'd become a real gap
the moment any of them grew a click handler.

## Hover — the house rules, restated for cards specifically

- Every hover effect wrapped in `@media (hover: hover)` (or gated through
  `usePointerCapability()`/`usePointerGlow`'s own `pointer.coarse` check —
  see `packages/primitives/src/glow/use-pointer-glow.ts` for the canonical
  pattern). A touch device gets a complete, usable static card, never an
  empty shell waiting for a hover that will never come.
- Transitions use the house easing, `cubic-bezier(.22,1,.36,1)` (Tailwind's
  `ease-[var(--ease-soft)]` already resolves to this — use that token, not
  a raw `cubic-bezier(...)` literal), 200–350ms. No `linear`.
- Every transform/motion effect gated behind `useMotionEnabled()` (or its
  inverse, `useReducedMotion()`), same as every existing card. Reduced
  motion gets the settled end-state instantly, never a half-finished frame.
- If two cards in the same grid both want a hover effect that touches
  neighbouring space (a lift with a wide shadow spread, a scale over 1.02),
  check `card-density.md` before shipping the default — that doc is about
  *when* to reach for an expressive card at all; this document is about
  *how* to build one once you've decided to.

## Slots — naming, not a formal API

Structural cards don't get a rigid slot-prop API (`headerSlot`,
`footerSlot`, ...) — they take `children` like the existing cards do, and
compose sub-pieces as plain exported functions from the same file when a
card has genuinely distinct regions (e.g. a `CardFooter` used only by
Pricing Card and Form Card). Keep names consistent when the same region
shows up in more than one card: `title`, `description`, `media`, `footer`,
`actions` — reuse those words, don't invent synonyms per component.

## Self-check, every batch

Before calling a batch done:

- [ ] Do any two hover effects on the same card visually fight (a scale
      and a shadow spread both trying to claim the same 8px of breathing
      room)?
- [ ] Legible on both the milk background and inside a dark section (check
      `bg-ink-900` contexts — `systems-showcase.tsx`'s dark CTA block is a
      real one to test against)?
- [ ] `focus-visible` present and equivalent to hover, on every card that
      accepts `onClick`/`href` (see above) — tab to it, don't just read the
      className
- [ ] `npm run verify:hover-coverage` and `npm run verify:nested-anchors`
      still pass (a card composed with a live preview, the way the gallery
      cards render these, is exactly the shape that broke once already
      this session)
