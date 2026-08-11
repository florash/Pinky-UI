import type { PrimitiveEntry } from "./types";

export const primitives: PrimitiveEntry[] = [
  {
    slug: "magnetic",
    name: "Magnetic",
    description: "Pulls its child toward the pointer, with a smooth falloff and a hard travel cap.",
    status: "ready",
    usage: `<Magnetic strength={0.4} range={110}>
  <button>Get started</button>
</Magnetic>`,
  },
  {
    slug: "jelly",
    name: "Jelly",
    description: "Elastic lean, drift and settle, with squash and stretch on press.",
    status: "ready",
    usage: `<Jelly elasticity={0.35} intensity={0.18}>
  <Card />
</Jelly>`,
  },
  {
    slug: "tilt",
    name: "Tilt",
    description: "Rigid perspective tilt with an optional specular highlight.",
    status: "ready",
    usage: `<Tilt max={4} glare>
  <Cover />
</Tilt>`,
  },
  {
    slug: "morph",
    name: "Morph",
    description:
      "Expands one surface into another as a single object, with dialog semantics, a focus trap and focus restoration.",
    status: "ready",
    usage: `<Morph label="Details" expanded={<Details />}>
  <Preview />
</Morph>`,
  },
  {
    slug: "liquid-surface",
    name: "Liquid Surface",
    description:
      "Translucent surface with a pointer-tracked specular highlight and refracting edge. No SVG filters, no per-frame JavaScript.",
    status: "ready",
    usage: `<LiquidSurface intensity={0.2} blur={18} tint="cloud">
  <Content />
</LiquidSurface>`,
  },
  {
    slug: "proximity",
    name: "Proximity",
    description:
      "Shares one pointer subscription across a set of items, giving each a springed 0–1 closeness value.",
    status: "ready",
    usage: `<Proximity distance={120} axis="x">
  {items.map((item) => <DockItem key={item.id} {...item} />)}
</Proximity>`,
  },
  {
    slug: "spotlight",
    name: "Spotlight",
    description: "Lights the face of a surface under the pointer — the counterpart to edge glow.",
    status: "ready",
    usage: `<Spotlight size={300} intensity={0.5}>
  <Card />
</Spotlight>`,
  },
  {
    slug: "parallax",
    name: "Parallax",
    description:
      "Pointer-driven depth: layers inside move by different amounts from one shared pair of motion values.",
    status: "ready",
    usage: `<Parallax>
  <Face />
  <ParallaxLayer depth={0.6}><Badge /></ParallaxLayer>
</Parallax>`,
  },
  {
    slug: "press-spring",
    name: "Press Spring",
    description:
      "Press feedback that answers pointer and keyboard alike, as spreadable handlers plus a scale motion value.",
    status: "ready",
    usage: `const press = usePressSpring({ scale: 0.96 });
<motion.button style={{ scale: press.scale }} {...press.handlers} />`,
  },
  {
    slug: "spring",
    name: "Spring",
    description: "The shared motion vocabulary, plus hover, focus and press feedback in one wrapper.",
    status: "ready",
    usage: `<Spring hoverScale={1.03} preset="snappy">
  <Chip />
</Spring>`,
  },
  {
    slug: "cursor",
    name: "Cursor Glow",
    description: "Ambient light that follows the pointer across a region.",
    status: "ready",
    usage: `<CursorGlow size={420}>
  <section>…</section>
</CursorGlow>`,
  },
  {
    slug: "glow",
    name: "Pointer Glow",
    description:
      "The hook underneath the light: writes pointer position into CSS variables so lighting stays pure CSS.",
    status: "ready",
    usage: `const ref = usePointerGlow<HTMLDivElement>({ range: 80 });`,
  },
];
