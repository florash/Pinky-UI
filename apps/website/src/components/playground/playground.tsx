"use client";

import {
  cn,
  FluidTabs,
  JellyCard,
  LiquidCard,
  MagneticButton,
  TiltCard,
  type LiquidCardProps,
} from "@pinky/components";
import { useId, useMemo, useState } from "react";

import { CodeBlock } from "@/components/site/code-block";

type Control =
  | { kind: "range"; key: string; label: string; min: number; max: number; step: number }
  | { kind: "choice"; key: string; label: string; options: string[] }
  | { kind: "toggle"; key: string; label: string };

type Config = Record<string, number | string | boolean>;

type PlaygroundComponent = {
  slug: string;
  name: string;
  /** Controls are named for what they do, not for the physics behind them. */
  controls: Control[];
  defaults: Config;
  presets: { name: string; props: Config }[];
  render: (config: Config) => React.ReactNode;
  code: (config: Config) => string;
};

const num = (config: Config, key: string, fallback: number) =>
  typeof config[key] === "number" ? (config[key] as number) : fallback;
const str = (config: Config, key: string, fallback: string) =>
  typeof config[key] === "string" ? (config[key] as string) : fallback;
const bool = (config: Config, key: string, fallback: boolean) =>
  typeof config[key] === "boolean" ? (config[key] as boolean) : fallback;

const SampleContent = ({ title, body }: { title: string; body: string }) => (
  <>
    <div className="flex items-center gap-3">
      <span
        aria-hidden
        className="size-10 rounded-pill"
        style={{
          background: "linear-gradient(140deg, var(--color-blush-200), var(--color-cloud-200))",
        }}
      />
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-ink-500">Interaction designer</p>
      </div>
    </div>
    <p className="mt-4 text-sm leading-relaxed text-ink-700">{body}</p>
  </>
);

const COMPONENTS: PlaygroundComponent[] = [
  {
    slug: "jelly-card",
    name: "Jelly Card",
    controls: [
      { kind: "range", key: "softness", label: "Softness", min: 0, max: 1, step: 0.05 },
      { kind: "range", key: "strength", label: "Strength", min: 0, max: 0.6, step: 0.02 },
      { kind: "range", key: "response", label: "Hover lift", min: 1, max: 1.06, step: 0.005 },
      { kind: "choice", key: "radius", label: "Radius", options: ["md", "lg", "xl", "2xl"] },
      { kind: "toggle", key: "glow", label: "Glow" },
    ],
    defaults: { softness: 0.35, strength: 0.18, response: 1.02, radius: "xl", glow: true },
    presets: [
      { name: "Subtle", props: { softness: 0.15, strength: 0.08, response: 1.01 } },
      { name: "Soft", props: { softness: 0.35, strength: 0.18, response: 1.02 } },
      { name: "Responsive", props: { softness: 0.55, strength: 0.24, response: 1.03 } },
      { name: "Playful", props: { softness: 0.9, strength: 0.4, response: 1.04 } },
    ],
    render: (config) => (
      <JellyCard
        key={`${num(config, "softness", 0.35)}-${num(config, "strength", 0.18)}`}
        elasticity={num(config, "softness", 0.35)}
        intensity={num(config, "strength", 0.18)}
        hoverScale={num(config, "response", 1.02)}
        radius={str(config, "radius", "xl") as "md" | "lg" | "xl" | "2xl"}
        glow={bool(config, "glow", true)}
        className="w-full max-w-sm"
      >
        <SampleContent
          title="Mira Odaka"
          body="Drag your pointer across this card and watch how the parameters change its character."
        />
      </JellyCard>
    ),
    code: (config) =>
      [
        "<JellyCard",
        `  elasticity={${num(config, "softness", 0.35)}}`,
        `  intensity={${num(config, "strength", 0.18)}}`,
        `  hoverScale={${num(config, "response", 1.02)}}`,
        `  radius="${str(config, "radius", "xl")}"`,
        bool(config, "glow", true) ? "" : "  glow={false}",
        ">",
        "  <ProfileCard />",
        "</JellyCard>",
      ]
        .filter(Boolean)
        .join("\n"),
  },
  {
    slug: "liquid-card",
    name: "Liquid Card",
    controls: [
      { kind: "range", key: "strength", label: "Light", min: 0, max: 0.6, step: 0.02 },
      { kind: "range", key: "blur", label: "Blur", min: 0, max: 30, step: 1 },
      { kind: "range", key: "depth", label: "Depth", min: 0, max: 0.4, step: 0.02 },
      { kind: "choice", key: "tint", label: "Tint", options: ["clear", "cloud", "blush"] },
    ],
    defaults: { strength: 0.2, blur: 18, depth: 0.12, tint: "clear" },
    presets: [
      { name: "Clear", props: { tint: "clear", blur: 18, strength: 0.2 } },
      { name: "Soft", props: { tint: "clear", blur: 10, strength: 0.14 } },
      { name: "Cloud", props: { tint: "cloud", blur: 18, strength: 0.24 } },
      { name: "Blush", props: { tint: "blush", blur: 18, strength: 0.24 } },
    ],
    render: (config) => (
      <div className="relative w-full max-w-sm">
        <span
          aria-hidden
          className="absolute -top-8 -left-6 size-40 rounded-pill blur-[30px]"
          style={{ background: "var(--color-blush-300)", opacity: 0.8 }}
        />
        <span
          aria-hidden
          className="absolute -right-6 -bottom-10 size-36 rounded-pill blur-[30px]"
          style={{ background: "var(--color-cloud-300)", opacity: 0.85 }}
        />
        <LiquidCard
          className="relative"
          intensity={num(config, "strength", 0.2)}
          blur={num(config, "blur", 18)}
          depth={num(config, "depth", 0.12)}
          tint={str(config, "tint", "clear") as LiquidCardProps["tint"]}
        >
          <SampleContent
            title="Mira Odaka"
            body="Light gathers under your pointer and the edge bends with it. Drop the blur to zero to see how much of that is free."
          />
        </LiquidCard>
      </div>
    ),
    code: (config) =>
      [
        "<LiquidCard",
        `  intensity={${num(config, "strength", 0.2)}}`,
        `  blur={${num(config, "blur", 18)}}`,
        `  depth={${num(config, "depth", 0.12)}}`,
        `  tint="${str(config, "tint", "clear")}"`,
        ">",
        "  <FeatureSummary />",
        "</LiquidCard>",
      ].join("\n"),
  },
  {
    slug: "magnetic-button",
    name: "Magnetic Button",
    controls: [
      { kind: "range", key: "strength", label: "Strength", min: 0, max: 0.8, step: 0.05 },
      { kind: "range", key: "reach", label: "Reach", min: 40, max: 220, step: 10 },
      { kind: "range", key: "travel", label: "Max travel", min: 2, max: 16, step: 1 },
      { kind: "choice", key: "variant", label: "Variant", options: ["primary", "soft", "ghost"] },
    ],
    defaults: { strength: 0.4, reach: 110, travel: 8, variant: "primary" },
    presets: [
      { name: "Subtle", props: { strength: 0.25, reach: 70, travel: 5 } },
      { name: "Soft", props: { strength: 0.4, reach: 110, travel: 8 } },
      { name: "Responsive", props: { strength: 0.5, reach: 150, travel: 10 } },
      { name: "Playful", props: { strength: 0.7, reach: 200, travel: 14 } },
    ],
    render: (config) => (
      <MagneticButton
        size="lg"
        strength={num(config, "strength", 0.4)}
        range={num(config, "reach", 110)}
        maxOffset={num(config, "travel", 8)}
        variant={str(config, "variant", "primary") as "primary" | "soft" | "ghost"}
      >
        Explore components
      </MagneticButton>
    ),
    code: (config) =>
      [
        "<MagneticButton",
        `  variant="${str(config, "variant", "primary")}"`,
        `  strength={${num(config, "strength", 0.4)}}`,
        `  range={${num(config, "reach", 110)}}`,
        `  maxOffset={${num(config, "travel", 8)}}`,
        ">",
        "  Explore components",
        "</MagneticButton>",
      ].join("\n"),
  },
  {
    slug: "tilt-card",
    name: "Tilt Card",
    controls: [
      { kind: "range", key: "strength", label: "Rotation", min: 0, max: 10, step: 0.5 },
      { kind: "range", key: "depth", label: "Layer depth", min: 0, max: 1.4, step: 0.1 },
      { kind: "toggle", key: "glare", label: "Glare" },
    ],
    defaults: { strength: 4, depth: 0.6, glare: true },
    presets: [
      { name: "Subtle", props: { strength: 2.5, depth: 0.3 } },
      { name: "Soft", props: { strength: 4, depth: 0.6 } },
      { name: "Responsive", props: { strength: 6, depth: 0.9 } },
      { name: "Playful", props: { strength: 9, depth: 1.3 } },
    ],
    render: (config) => (
      <TiltCard
        className="w-[15rem]"
        padded={false}
        max={num(config, "strength", 4)}
        parallax={num(config, "depth", 0.6)}
        glare={bool(config, "glare", true)}
        foreground={
          <span className="absolute right-4 bottom-4 rounded-pill bg-white/90 px-2.5 py-1 font-mono text-[0.625rem] tracking-[0.1em] text-ink-700 uppercase shadow-soft">
            Vol. 1
          </span>
        }
      >
        <div
          className="h-52 w-full"
          style={{
            background:
              "linear-gradient(160deg, var(--color-white), var(--color-blush-100) 45%, var(--color-cloud-200))",
          }}
        />
      </TiltCard>
    ),
    code: (config) =>
      [
        "<TiltCard",
        `  max={${num(config, "strength", 4)}}`,
        `  parallax={${num(config, "depth", 0.6)}}`,
        bool(config, "glare", true) ? "  glare" : "  glare={false}",
        "  foreground={<Badge />}",
        ">",
        "  <Cover />",
        "</TiltCard>",
      ].join("\n"),
  },
];

/**
 * A real configurator: the preview is the actual component, and the code is
 * generated from the same state that drives it.
 *
 * Controls are named for the feeling they produce — Softness, Strength, Depth —
 * rather than for stiffness and damping. The physics is the implementation, not
 * the interface.
 */
export function Playground({ className }: { className?: string }) {
  const [slug, setSlug] = useState(COMPONENTS[0]!.slug);
  const active = COMPONENTS.find((entry) => entry.slug === slug) ?? COMPONENTS[0]!;

  const [configs, setConfigs] = useState<Record<string, Config>>(() =>
    Object.fromEntries(COMPONENTS.map((entry) => [entry.slug, entry.defaults])),
  );

  const config = configs[active.slug] ?? active.defaults;
  const setConfig = (next: Config) =>
    setConfigs((current) => ({ ...current, [active.slug]: { ...current[active.slug], ...next } }));

  const code = useMemo(() => active.code(config), [active, config]);

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <FluidTabs
        aria-label="Component"
        value={active.slug}
        onValueChange={setSlug}
        items={COMPONENTS.map((entry) => ({ id: entry.slug, label: entry.name }))}
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="flex min-h-[24rem] items-center justify-center overflow-hidden rounded-xl bg-milk/60 p-8 ring-1 ring-line/60">
          {active.render(config)}
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-xl bg-white/80 p-5 ring-1 ring-line/60">
            <div className="flex flex-wrap gap-2">
              {active.presets.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => setConfig(preset.props)}
                  className="rounded-pill px-3 py-1.5 text-xs font-medium text-ink-700 ring-1 ring-line transition-colors hover:bg-blush-50 hover:text-ink-900"
                >
                  {preset.name}
                </button>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-5">
              {active.controls.map((control) => (
                <ControlRow
                  key={control.key}
                  control={control}
                  config={config}
                  onChange={setConfig}
                />
              ))}
            </div>
          </div>

          <CodeBlock code={code} label="generated" />
        </div>
      </div>
    </div>
  );
}

function ControlRow({
  control,
  config,
  onChange,
}: {
  control: Control;
  config: Config;
  onChange: (next: Config) => void;
}) {
  const id = useId();

  if (control.kind === "toggle") {
    return (
      <label className="flex items-center justify-between gap-3">
        <span className="font-mono text-[0.6875rem] tracking-[0.14em] text-ink-500 uppercase">
          {control.label}
        </span>
        <input
          type="checkbox"
          checked={bool(config, control.key, true)}
          onChange={(event) => onChange({ [control.key]: event.target.checked })}
          className="size-4 accent-ink-900"
        />
      </label>
    );
  }

  if (control.kind === "choice") {
    return (
      <fieldset>
        <legend className="font-mono text-[0.6875rem] tracking-[0.14em] text-ink-500 uppercase">
          {control.label}
        </legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {control.options.map((option) => {
            const selected = str(config, control.key, control.options[0] ?? "") === option;
            return (
              <button
                key={option}
                type="button"
                aria-pressed={selected}
                onClick={() => onChange({ [control.key]: option })}
                className={cn(
                  "rounded-pill px-3 py-1.5 font-mono text-xs transition-colors",
                  selected
                    ? "bg-ink-900 text-milk"
                    : "text-ink-700 ring-1 ring-line hover:ring-line-strong",
                )}
              >
                {option}
              </button>
            );
          })}
        </div>
      </fieldset>
    );
  }

  const value = num(config, control.key, control.min);

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label
          htmlFor={id}
          className="font-mono text-[0.6875rem] tracking-[0.14em] text-ink-500 uppercase"
        >
          {control.label}
        </label>
        <span className="font-mono text-xs text-ink-700">{value}</span>
      </div>
      <input
        id={id}
        type="range"
        min={control.min}
        max={control.max}
        step={control.step}
        value={value}
        onChange={(event) => onChange({ [control.key]: Number(event.target.value) })}
        className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-pill bg-line accent-ink-900"
      />
    </div>
  );
}
