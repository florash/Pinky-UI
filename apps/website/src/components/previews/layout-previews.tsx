"use client";

import { SpotlightCard, cn } from "@pinky/components";
import {
  CardFan,
  DraggableCardStack,
  ExpandableBento,
  MasonryGallery,
  PolaroidWall,
  StackGrid,
} from "@pinky/layouts";
import type { ReactNode } from "react";

import { MODERN_LAYOUT_PREVIEWS } from "./modern-layout-previews";

/**
 * Live demos for every layout, defined once and rendered by the gallery, the
 * detail pages and the homepage section.
 *
 * The sample content is deliberately abstract — tinted panels rather than
 * photographs. A layout demo should show the arrangement, and stock photos
 * would both distract from it and make the page heavy.
 */
export const LAYOUT_PREVIEWS: Record<string, ReactNode> = {
  "polaroid-wall": <PolaroidWallDemo />,
  "stack-grid": <StackGridDemo />,
  "masonry-gallery": <MasonryGalleryDemo />,
  "draggable-card-stack": <DraggableCardStackDemo />,
  "expandable-bento": <ExpandableBentoDemo />,
  "card-fan": <CardFanDemo />,
  ...MODERN_LAYOUT_PREVIEWS,
};

export function LayoutPreview({ slug }: { slug: string }) {
  const preview = LAYOUT_PREVIEWS[slug];
  if (preview) return <>{preview}</>;
  return null;
}

export { hasLayoutPreview } from "./preview-manifest";

/** Six repeatable tints, so a collection reads as varied without imagery. */
const TINTS = [
  "linear-gradient(150deg, var(--color-blush-100), var(--color-blush-300))",
  "linear-gradient(150deg, var(--color-cloud-100), var(--color-cloud-300))",
  "linear-gradient(150deg, var(--color-white), var(--color-blush-200))",
  "linear-gradient(150deg, var(--color-cloud-50), var(--color-blush-200))",
  "linear-gradient(150deg, var(--color-blush-50), var(--color-cloud-300))",
  "linear-gradient(150deg, var(--color-white), var(--color-cloud-200))",
];

function Swatch({
  index,
  ratio = "4 / 3",
  className,
}: {
  index: number;
  ratio?: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn("block w-full rounded-[10px]", className)}
      style={{ aspectRatio: ratio, background: TINTS[index % TINTS.length] }}
    />
  );
}

function Polaroid({ index, caption }: { index: number; caption: string }) {
  return (
    <figure className="m-0 rounded-[12px] bg-white p-2 pb-6 shadow-soft ring-1 ring-line">
      <Swatch index={index} ratio="1 / 1" />
      <figcaption className="mt-2 text-center font-mono text-[0.5625rem] tracking-[0.12em] text-ink-500 uppercase">
        {caption}
      </figcaption>
    </figure>
  );
}

function PolaroidWallDemo() {
  const captions = ["Kyoto", "Lisbon", "Oslo", "Taipei", "Porto", "Kobe"];

  return (
    <PolaroidWall columns={3} spread="soft" rotation={6} className="w-full max-w-md">
      {captions.map((caption, index) => (
        <Polaroid key={caption} index={index} caption={caption} />
      ))}
    </PolaroidWall>
  );
}

function StackGridDemo() {
  const titles = ["Motion", "Surfaces", "Light", "Depth", "Layout", "Controls"];

  return (
    <StackGrid columns={3} className="w-full max-w-lg">
      {titles.map((title, index) => (
        <SpotlightCard key={title} radius="lg" padded={false} className="h-full">
          <div className="p-4">
            <p className="mb-3 text-sm font-medium">{title}</p>
            <Swatch index={index} ratio="16 / 10" />
          </div>
        </SpotlightCard>
      ))}
    </StackGrid>
  );
}

function MasonryGalleryDemo() {
  const ratios = ["3 / 4", "1 / 1", "4 / 3", "2 / 3", "1 / 1", "4 / 5", "3 / 4", "16 / 10"];
  const captions = ["Quiet study", "Blue hour", "Open table", "Soft archive", "Field notes", "After rain", "A small room", "Last light"];

  return (
    <MasonryGallery
      label="Sample gallery"
      columns={{ mobile: 2, tablet: 3, desktop: 3 }}
      gap={10}
      className="w-full max-w-md"
    >
      {ratios.map((ratio, index) => (
        <figure key={captions[index]} className="m-0 overflow-hidden rounded-xl bg-white/80 p-1.5 ring-1 ring-line/70">
          <Swatch index={index} ratio={ratio} />
          <figcaption className="px-1.5 py-2 font-mono text-[0.55rem] tracking-[0.1em] text-ink-500 uppercase">
            {captions[index]}
          </figcaption>
        </figure>
      ))}
    </MasonryGallery>
  );
}

function DraggableCardStackDemo() {
  const cards = [
    { title: "Drag me sideways", body: "Or use the buttons — they do the same thing." },
    { title: "Spring back", body: "A hesitant drag returns the card to the deck." },
    { title: "Looping", body: "Dismissed cards go to the back by default." },
  ];

  return (
    <DraggableCardStack className="w-full max-w-sm" label="Sample deck">
      {cards.map((card) => (
        <div key={card.title} className="rounded-xl bg-white p-6 shadow-lift ring-1 ring-line">
          <Swatch index={cards.indexOf(card)} ratio="16 / 9" />
          <p className="mt-4 font-display text-lg font-semibold tracking-tight">{card.title}</p>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-700">{card.body}</p>
        </div>
      ))}
    </DraggableCardStack>
  );
}

function ExpandableBentoDemo() {
  const items = [
    {
      id: "motion",
      label: "Motion",
      span: 2 as const,
      preview: <BentoPreview index={0} title="Motion" note="Springs, not easings" />,
      detail: (
        <p className="text-sm leading-relaxed text-ink-700">
          Four springs cover the whole library: soft, responsive, snappy, elastic. Components pick
          one by name instead of inventing physics.
        </p>
      ),
    },
    {
      id: "light",
      label: "Light",
      preview: <BentoPreview index={1} title="Light" note="Edge and face" />,
      detail: (
        <p className="text-sm leading-relaxed text-ink-700">
          Glow Border lights an edge; Spotlight lights a face. Using both on one surface doubles the
          effect and halves the meaning.
        </p>
      ),
    },
    {
      id: "depth",
      label: "Depth",
      preview: <BentoPreview index={2} title="Depth" note="Tilt and parallax" />,
      detail: (
        <p className="text-sm leading-relaxed text-ink-700">
          Four degrees of rotation is the house limit. Past eight, a card stops reading as a surface
          in space and starts reading as an effect.
        </p>
      ),
    },
    {
      id: "layout",
      label: "Layout",
      span: 2 as const,
      preview: <BentoPreview index={3} title="Layout" note="Arrangement as interaction" />,
      detail: (
        <p className="text-sm leading-relaxed text-ink-700">
          Either the layout moves or the items move — not both. This grid rearranges, so its tiles
          stay calm.
        </p>
      ),
    },
  ];

  return <ExpandableBento items={items} columns={3} className="w-full max-w-lg" />;
}

function BentoPreview({ index, title, note }: { index: number; title: string; note: string }) {
  return (
    <div className="flex items-center gap-3">
      <span
        aria-hidden
        className="size-9 shrink-0 rounded-[10px]"
        style={{ background: TINTS[index % TINTS.length] }}
      />
      <span>
        <span className="block text-sm font-medium">{title}</span>
        <span className="block text-xs text-ink-500">{note}</span>
      </span>
    </div>
  );
}

function CardFanDemo() {
  const cards = [
    ["Arrival", "01 / entry"],
    ["Commons", "02 / shared"],
    ["Threshold", "03 / edge"],
    ["Work table", "04 / focus"],
  ];

  return (
    <CardFan
      spread={24}
      rotation={7}
      className="w-full max-w-lg"
      label="Curated studio deck"
    >
      {cards.map(([title, meta], index) => (
        <div
          key={title}
          className="w-36 overflow-hidden rounded-[18px] bg-white shadow-lift ring-1 ring-line"
        >
          <Swatch index={index} ratio="4 / 3" className="rounded-none" />
          <div className="p-3">
            <p className="text-sm font-medium">{title}</p>
            <p className="mt-1 font-mono text-[0.58rem] text-ink-500">{meta}</p>
          </div>
        </div>
      ))}
    </CardFan>
  );
}
