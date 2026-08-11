# Pinky UI

**Soft, fluid and interactive React components for modern interfaces.**

Pinky UI is an open-source collection of expressive React components and motion primitives built for interfaces that feel responsive, playful and alive.

Explore jelly, liquid, magnetic, morph, glow, depth, elastic and proximity interactions — twelve components and twelve primitives, designed to stay composable, accessible and practical to use.

React · TypeScript · Tailwind CSS · Motion · Accessible · Open Source

## Why Pinky UI?

- Interaction-first React components
- Reusable motion primitives you can compose yourself
- Subtle animation tuned for real products, not demos
- Reduced-motion aware: motion is the enhancement, never the content
- Designed for composition rather than rigid themes

## What's inside

### Primitives — `@pinky/primitives`

| Primitive | What it does |
| --- | --- |
| `Magnetic` | Pulls its child toward the pointer, with smooth falloff and a hard travel cap |
| `Jelly` | Elastic lean, drift and settle, with squash and stretch on press |
| `Tilt` | Rigid perspective tilt with an optional specular highlight |
| `Morph` | Expands one surface into another as a single object, with dialog semantics |
| `LiquidSurface` | Translucent surface with pointer-tracked highlight and refracting edge |
| `Proximity` | One shared pointer subscription giving each item a springed 0–1 closeness |
| `Spotlight` | Lights the face of a surface under the pointer |
| `Parallax` | Layered depth from one shared pair of motion values |
| `usePressSpring` | Press feedback that answers pointer and keyboard alike |
| `Spring` | The shared motion vocabulary, plus hover, focus and press feedback |
| `CursorGlow` | Ambient light that follows the pointer across a region |
| `usePointerGlow` | Writes pointer position into CSS variables, so lighting stays pure CSS |

## Components

- Jelly Card
- Liquid Card
- Morph Card
- Spotlight Card
- Tilt Card
- Magnetic Button
- Ripple Button
- Glow Border
- Fluid Tabs
- Gooey Menu
- Floating Dock
- Elastic Toggle

```tsx
import { JellyCard, MagneticButton } from "@pinky/components";
import { Magnetic } from "@pinky/primitives";
```

## Layouts

Ways to arrange many things, where the arrangement itself is the interaction.

- Polaroid Wall
- Stack to Grid
- Masonry Gallery
- Draggable Card Stack
- Expandable Bento
- Card Fan

```tsx
import { PolaroidWall, StackGrid } from "@pinky/layouts";
```

Depth Carousel, Shuffle Grid, Peek Carousel, Focus Gallery, Parallax Gallery and
Infinite Gallery are planned and **not implemented** — they do not appear on the
site.

## Skills

Pinky UI ships **agent-readable interaction Skills**: markdown in
`packages/skills` covering what each component is for, when it is the wrong
choice, recommended defaults, accessibility constraints and composition
patterns — plus system-level patterns on interaction density, reduced motion,
landing-page motion, choosing a card, and composition.

The website renders those files directly, so there is no second copy to fall out
of date.

## Repository

```text
apps/website        Next.js site — components, layouts, playground, skills
packages/primitives Interaction primitives
packages/components Components built on top of the primitives
packages/registry   Metadata describing every component and primitive
packages/layouts    Galleries, grids and stacks
packages/skills     Agent-readable Skills (components, layouts, primitives, patterns)
content/components  Long-form component guidance
examples/           Small standalone compositions
```

The website compiles `packages/*` straight from TypeScript source through the
path aliases in `apps/website/tsconfig.json`, so editing a primitive shows up on
the site with no build step in between. The packages are internal to this
repository and are not published to npm yet — there is also no CLI, despite what
`packages/registry` is eventually designed to support.

## Local development

```bash
npm install
```

```bash
npm run dev
```

Then open `http://localhost:3000`.

Other scripts: `npm run build`, `npm run typecheck`.

ESLint is not configured yet — `next lint` is deprecated in Next 15, and a flat
config with the Next plugin is still to be added.

## Accessibility

Every primitive reads `prefers-reduced-motion` and renders a complete, usable UI
when motion is disabled. Interactive components remain keyboard operable and
carry their own focus and ARIA semantics.

## License

MIT
