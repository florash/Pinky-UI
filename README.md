# Pinky UI

**Soft, fluid and interactive React components for modern interfaces.**

Pinky UI is an open-source collection of expressive React components and motion primitives built for interfaces that feel responsive, playful and alive.

Explore jelly, magnetic, glow and depth interactions designed to remain composable, accessible and practical to use — with liquid and morph primitives in progress.

React · TypeScript · Tailwind CSS · Motion · Accessible · Open Source

## Why Pinky UI?

- Interaction-first React components
- Reusable motion primitives you can compose yourself
- Subtle animation tuned for real products, not demos
- Reduced-motion aware: motion is the enhancement, never the content
- Designed for composition rather than rigid themes

## What's inside

### Primitives — `@pinky/primitives`

| Primitive | What it does | Status |
| --- | --- | --- |
| `Magnetic` | Pulls its child toward the pointer, with smooth falloff and a hard travel cap | Ready |
| `Jelly` | Elastic lean, drift and settle | Ready |
| `Tilt` | Rigid perspective tilt with an optional specular highlight | Ready |
| `Spring` | Shared spring vocabulary plus hover, focus and press feedback | Ready |
| `CursorGlow` | Ambient light that follows the pointer across a region | Ready |
| `usePointerGlow` | Writes pointer position into CSS variables, so lighting stays pure CSS | Ready |
| `Morph` | Shared-element transitions between two UI states | In progress |
| `LiquidSurface` | Displacement and refraction driven by pointer velocity | In progress |

### Components — `@pinky/components`

| Component | Built on | Status |
| --- | --- | --- |
| `JellyCard` | jelly, spring, glow | Ready |
| `MagneticButton` | magnetic, spring | Ready |
| `GlowBorder` | glow | Ready |
| `FluidTabs` | spring | Ready |
| `LiquidCard`, `MorphCard`, `GooeyMenu`, `FloatingDock` | — | In progress |

```tsx
import { JellyCard, MagneticButton } from "@pinky/components";
import { Magnetic } from "@pinky/primitives";
```

## Repository

```text
apps/website        Next.js site — component gallery, playground, showcase
packages/primitives Interaction primitives
packages/components Components built on top of the primitives
packages/registry   Metadata describing every component and primitive
packages/skills     Usage guidance for coding agents
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
