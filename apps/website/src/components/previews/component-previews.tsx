"use client";

import {
  BasicCard,
  BorderBeamCard,
  ElasticToggle,
  EmailTemplate,
  EmptyStateCard,
  FlipDigits,
  ExpandCard,
  FlipCard,
  FloatingDock,
  FluidTabs,
  FormCard,
  GlowBorder,
  GlowCard,
  GooeyMenu,
  GradientBorderCard,
  HorizontalCard,
  JellyCard,
  LiftCard,
  LiquidCard,
  ListCard,
  MagneticButton,
  MediaCard,
  MorphCard,
  NotificationCard,
  PillNav,
  PricingCard,
  ProfileCard,
  RevealCard,
  RippleButton,
  ShineCard,
  SpotlightCard,
  StackCard,
  StatCard,
  TiltCard,
  ZoomCard,
} from "@pinky-ui/components";
import { useState, type ReactNode } from "react";

import { SOFT_MEDIA_SOURCES } from "./soft-surface";

/**
 * One place where every component's live preview is defined.
 *
 * The homepage, the gallery and the detail pages all render from this map, so a
 * component's demo is written once and can never drift between surfaces.
 */
export const COMPONENT_PREVIEWS: Record<string, ReactNode> = {
  "jelly-card": <JellyCardPreview />,
  "liquid-card": <LiquidCardPreview />,
  "morph-card": <MorphCardPreview />,
  "spotlight-card": <SpotlightCardPreview />,
  "tilt-card": <TiltCardPreview />,
  "lift-card": <LiftCardPreview />,
  "zoom-card": <ZoomCardPreview />,
  "gradient-border-card": <GradientBorderCardPreview />,
  "border-beam-card": <BorderBeamCardPreview />,
  "glow-card": <GlowCardPreview />,
  "shine-card": <ShineCardPreview />,
  "reveal-card": <RevealCardPreview />,
  "flip-card": <FlipCardPreview />,
  "expand-card": <ExpandCardPreview />,
  "stack-card": <StackCardPreview />,
  "basic-card": <BasicCardPreview />,
  "media-card": <MediaCardPreview />,
  "horizontal-card": <HorizontalCardPreview />,
  "list-card": <ListCardPreview />,
  "profile-card": <ProfileCardPreview />,
  "stat-card": <StatCardPreview />,
  "pricing-card": <PricingCardPreview />,
  "form-card": <FormCardPreview />,
  "notification-card": <NotificationCardPreview />,
  "empty-state-card": <EmptyStateCardPreview />,
  "magnetic-button": <MagneticButtonPreview />,
  "ripple-button": <RippleButtonPreview />,
  "glow-border": <GlowBorderPreview />,
  "fluid-tabs": <FluidTabsPreview />,
  "pill-nav": <PillNavPreview />,
  "gooey-menu": <GooeyMenuPreview />,
  "floating-dock": <FloatingDockPreview />,
  "elastic-toggle": <ElasticTogglePreview />,
  "email-template": <EmailTemplatePreview />,
  "flip-digits": <FlipDigitsPreview />,
};

export function ComponentPreview({ slug }: { slug: string }) {
  const preview = COMPONENT_PREVIEWS[slug];
  if (preview) return <>{preview}</>;
  return null;
}

export { hasComponentPreview } from "./preview-manifest";

function Avatar({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={className ?? "size-10 rounded-pill"}
      style={{
        background: "linear-gradient(140deg, var(--color-blush-200), var(--color-cloud-200))",
      }}
    />
  );
}

function JellyCardPreview() {
  return (
    <JellyCard className="w-full max-w-[17rem]" radius="xl">
      <div className="flex items-center gap-3">
        <Avatar />
        <div>
          <p className="text-sm font-medium">Elastic surface</p>
          <p className="text-xs text-ink-500">Leans, drifts, settles</p>
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-ink-700">
        Pointer-driven deformation with a spring return.
      </p>
    </JellyCard>
  );
}

function LiquidCardPreview() {
  return (
    <div className="relative w-full max-w-[18rem]">
      {/* Something worth seeing through — glass over nothing is just a panel. */}
      <span
        aria-hidden
        className="absolute -top-6 -left-6 size-32 rounded-pill blur-[26px]"
        style={{ background: "var(--color-blush-300)", opacity: 0.75 }}
      />
      <span
        aria-hidden
        className="absolute -right-4 -bottom-8 size-28 rounded-pill blur-[26px]"
        style={{ background: "var(--color-cloud-300)", opacity: 0.8 }}
      />
      <LiquidCard tint="clear" intensity={0.24} className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[0.625rem] tracking-[0.14em] text-ink-500 uppercase">Liquid Card</p>
            <p className="mt-2 text-sm font-medium">Quiet priority</p>
          </div>
          <span className="rounded-lg bg-white/70 px-2 py-1 font-mono text-[0.6rem] text-ink-500">LIVE</span>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-ink-700">
          The surface redistributes light and keeps the action attached to the content.
        </p>
        <div className="mt-5 flex items-center justify-between border-t border-white/70 pt-3">
          <span className="text-xs text-ink-500">Pointer-aware material</span>
          <span className="text-xs font-medium text-ink-900">Inspect →</span>
        </div>
      </LiquidCard>
    </div>
  );
}

function MorphCardPreview() {
  return (
    <MorphCard
      label="Mira Odaka"
      maxWidth={520}
      className="w-full max-w-[17rem]"
      expandedContent={
        <div className="p-7">
          <div className="flex items-center gap-3">
            <Avatar className="size-12 rounded-pill" />
            <div>
              <p className="font-display text-lg font-semibold tracking-tight">Mira Odaka</p>
              <p className="text-sm text-ink-500">Interaction designer, Kyoto</p>
            </div>
          </div>
          <p className="mt-5 text-sm leading-relaxed text-ink-700">
            The card you clicked is the panel you are reading — it travelled and resized rather
            than fading out behind a modal. Press Escape, or click outside, to send it back.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-ink-700">
            Focus moved in here when it opened, and returns to the card when it closes.
          </p>
        </div>
      }
    >
      <div className="p-5">
        <div className="flex items-center gap-3">
          <Avatar />
          <div>
            <p className="text-sm font-medium">Mira Odaka</p>
            <p className="text-xs text-ink-500">Tap to expand</p>
          </div>
        </div>
      </div>
    </MorphCard>
  );
}

function SpotlightCardPreview() {
  return (
    <SpotlightCard className="w-full max-w-[17rem]">
      <p className="font-mono text-[0.625rem] tracking-[0.14em] text-ink-500 uppercase">
        Spotlight
      </p>
      <p className="mt-3 text-sm leading-relaxed text-ink-700">
        Nothing moves. The surface just notices where you are.
      </p>
    </SpotlightCard>
  );
}

function TiltCardPreview() {
  return (
    <TiltCard
      className="w-full max-w-[18rem]"
      padded={false}
      foreground={
        <span className="absolute top-4 right-4 rounded-pill bg-white/90 px-2.5 py-1 font-mono text-[0.625rem] tracking-[0.1em] text-ink-700 uppercase shadow-soft">
          Vol. 1
        </span>
      }
    >
      <div
        className="relative h-48 w-full bg-white/70 p-4"
        style={{
          background:
            "linear-gradient(160deg, var(--color-white), var(--color-blush-100) 45%, var(--color-cloud-200))",
        }}
      >
        <div className="flex h-full flex-col justify-between">
          <span className="font-mono text-[0.6rem] tracking-[0.14em] text-ink-500 uppercase">Field notes / 01</span>
          <div>
            <p className="font-display text-lg font-semibold tracking-tight text-ink-900">Solid, not loud.</p>
            <p className="mt-1 max-w-[13rem] text-xs text-ink-700">A rigid surface catches light without moving the reading.</p>
          </div>
        </div>
      </div>
    </TiltCard>
  );
}

function LiftCardPreview() {
  return (
    <LiftCard className="w-full max-w-[18rem]" onClick={() => {}}>
      <p className="font-display text-lg font-semibold tracking-tight text-ink-900">Weekly digest</p>
      <p className="mt-2 text-sm leading-relaxed text-ink-700">A plain lift, cheap enough for a grid of fifty.</p>
    </LiftCard>
  );
}

function ZoomCardPreview() {
  return (
    <ZoomCard
      className="w-full max-w-[18rem]"
      media={<img src={SOFT_MEDIA_SOURCES[0]} alt="" />}
      title="Field notes"
      description="Hover to look closer."
    />
  );
}

function GradientBorderCardPreview() {
  return (
    <GradientBorderCard className="w-full max-w-[18rem]">
      <p className="font-display text-lg font-semibold tracking-tight text-ink-900">Studio plan</p>
      <p className="mt-2 text-sm leading-relaxed text-ink-700">A static two-stop ring, no motion required.</p>
    </GradientBorderCard>
  );
}

function BorderBeamCardPreview() {
  return (
    <BorderBeamCard className="w-full max-w-[18rem]">
      <p className="font-display text-lg font-semibold tracking-tight text-ink-900">Live users</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-ink-900 tabular-nums">1,204</p>
    </BorderBeamCard>
  );
}

function GlowCardPreview() {
  return (
    <GlowCard className="w-full max-w-[18rem]">
      <p className="font-display text-lg font-semibold tracking-tight text-ink-900">Studio plan</p>
      <p className="mt-2 text-sm leading-relaxed text-ink-700">A halo that widens on hover.</p>
    </GlowCard>
  );
}

function ShineCardPreview() {
  return (
    <ShineCard className="w-full max-w-[18rem]">
      <p className="font-display text-lg font-semibold tracking-tight text-ink-900">Studio plan</p>
      <p className="mt-2 text-sm leading-relaxed text-ink-700">A gloss streak on hover, nothing else.</p>
    </ShineCard>
  );
}

function RevealCardPreview() {
  return (
    <RevealCard
      className="w-full max-w-[18rem]"
      media={<img src={SOFT_MEDIA_SOURCES[1]} alt="" />}
      title="Field notes"
      description="Three weeks in the studio."
    />
  );
}

function FlipCardPreview() {
  return (
    <FlipCard
      className="w-full max-w-[16rem]"
      front={
        <div className="flex h-full flex-col justify-between">
          <span className="font-mono text-[0.6rem] tracking-[0.14em] text-ink-500 uppercase">Score</span>
          <p className="font-display text-3xl font-semibold tracking-tight text-ink-900">94</p>
        </div>
      }
      back={<p className="text-sm leading-relaxed text-ink-700">Up 12% from last quarter.</p>}
    />
  );
}

function ExpandCardPreview() {
  return (
    <ExpandCard className="w-full max-w-[18rem]" title="Shipping details" summary="Arrives in 3–5 days" defaultOpen>
      <p className="text-sm leading-relaxed text-ink-700">Full carrier and tracking details once the order ships.</p>
    </ExpandCard>
  );
}

function StackCardPreview() {
  return (
    <StackCard className="w-full max-w-[18rem]" depth={2}>
      <p className="font-display text-lg font-semibold tracking-tight text-ink-900">Design system audit</p>
      <p className="mt-2 text-sm leading-relaxed text-ink-700">3 more saved searches behind this one.</p>
    </StackCard>
  );
}

function BasicCardPreview() {
  return (
    <BasicCard
      className="w-full max-w-[18rem]"
      title="Studio plan"
      description="Everything a small team needs to ship together."
      footer={
        <span className="inline-flex items-center rounded-pill bg-ink-900 px-3.5 py-2 text-sm text-milk">
          Choose plan
        </span>
      }
    />
  );
}

function MediaCardPreview() {
  return (
    <MediaCard
      className="w-full max-w-[18rem]"
      media={<img src={SOFT_MEDIA_SOURCES[0]} alt="" />}
      title="Field notes"
      description="Three weeks in the studio."
    />
  );
}

function HorizontalCardPreview() {
  return (
    <HorizontalCard
      className="w-full max-w-[20rem]"
      media={<img src={SOFT_MEDIA_SOURCES[1]} alt="" />}
      title="Mira Odaka"
      description="Product design, six years."
    />
  );
}

function ListCardPreview() {
  return (
    <ListCard
      className="w-full max-w-[18rem]"
      title="Recent activity"
      items={[
        { id: "one", content: "Release notes published" },
        { id: "two", content: "North star doc updated" },
        { id: "three", content: "Research log shared" },
      ]}
    />
  );
}

function ProfileCardPreview() {
  return (
    <ProfileCard
      className="w-full max-w-[18rem]"
      avatarSrc={SOFT_MEDIA_SOURCES[0]}
      name="Mira Odaka"
      subtitle="Product design, six years"
      tags={["Design systems", "Motion", "Figma"]}
    />
  );
}

function StatCardPreview() {
  return (
    <StatCard
      className="w-full max-w-[18rem]"
      label="Monthly active users"
      value="48,203"
      trend={{ direction: "up", label: "12.4% this week" }}
    />
  );
}

function PricingCardPreview() {
  return (
    <PricingCard
      className="w-full max-w-[18rem]"
      name="Studio"
      price="$24"
      period="/mo"
      features={["Unlimited projects", "Priority support"]}
      footer={
        <span className="inline-flex items-center rounded-pill bg-ink-900 px-3.5 py-2 text-sm text-milk">
          Choose plan
        </span>
      }
      highlight
    />
  );
}

function FormCardPreview() {
  return (
    <FormCard
      className="w-full max-w-[18rem]"
      title="Sign in"
      footer={
        <span className="inline-flex w-full items-center justify-center rounded-pill bg-ink-900 px-3.5 py-2 text-sm text-milk">
          Continue
        </span>
      }
    >
      <label className="block text-sm text-ink-700">
        Email
        <input
          type="email"
          readOnly
          value="mira@example.com"
          className="mt-1.5 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink-900"
        />
      </label>
      <label className="block text-sm text-ink-700">
        Password
        <input
          type="password"
          readOnly
          value="········"
          className="mt-1.5 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink-900"
        />
      </label>
    </FormCard>
  );
}

function NotificationCardPreview() {
  return (
    <NotificationCard
      className="w-full max-w-[20rem]"
      variant="success"
      title="Changes saved"
      description="Your profile is up to date."
      onDismiss={() => {}}
    />
  );
}

function EmptyStateCardPreview() {
  return (
    <EmptyStateCard
      className="w-full max-w-[18rem]"
      title="No projects yet"
      description="Create your first project to get started."
      action={
        <span className="inline-flex items-center rounded-pill bg-ink-900 px-3.5 py-2 text-sm text-milk">
          New project
        </span>
      }
    />
  );
}

function MagneticButtonPreview() {
  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <MagneticButton>Primary</MagneticButton>
        <MagneticButton variant="soft">Soft</MagneticButton>
      </div>
      <p className="font-mono text-[0.625rem] tracking-[0.12em] text-ink-500 uppercase">
        move your pointer nearby
      </p>
    </div>
  );
}

function RippleButtonPreview() {
  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <RippleButton>Save changes</RippleButton>
        <RippleButton variant="soft" rippleColor="var(--color-blush-200)">
          Cancel
        </RippleButton>
      </div>
      <p className="font-mono text-[0.625rem] tracking-[0.12em] text-ink-500 uppercase">
        local pressure · bounded response
      </p>
    </div>
  );
}

function GlowBorderPreview() {
  return (
    <GlowBorder radius="lg" size={200} className="w-full max-w-[17rem]">
      <div className="rounded-lg bg-white p-5 shadow-soft ring-1 ring-line">
        <p className="text-sm font-medium">Studio</p>
        <p className="mt-1 text-xs text-ink-500">$24 / month</p>
        <p className="mt-4 text-sm leading-relaxed text-ink-700">
          Move closer — the edge finds your pointer.
        </p>
      </div>
    </GlowBorder>
  );
}

function FluidTabsPreview() {
  return (
    <div className="w-full max-w-[19rem]">
      <FluidTabs
        aria-label="Preview tabs"
        size="sm"
        fill
        items={[
          {
            id: "overview",
            label: "Overview",
            content: <PanelLine>Twelve components, twelve primitives.</PanelLine>,
          },
          {
            id: "motion",
            label: "Motion",
            content: <PanelLine>Springs, never long easings.</PanelLine>,
          },
          {
            id: "a11y",
            label: "A11y",
            content: <PanelLine>Roving tab stop, arrow keys.</PanelLine>,
          },
        ]}
      />
    </div>
  );
}

function PillNavPreview() {
  const [active, setActive] = useState("explore");
  const ids = ["explore", "docs", "skills"];
  return (
    <PillNav
      aria-label="Preview navigation"
      size="sm"
      items={ids.map((id) => ({
        id,
        label: id[0]!.toUpperCase() + id.slice(1),
        // No `href` here on purpose: this preview is embedded inside the
        // gallery card's own <Link>, and PillNav renders a real <a> whenever
        // an item has an href — nesting an anchor inside an anchor is
        // invalid HTML and was failing hydration. onClick alone renders a
        // <button>, which still demonstrates the sliding pill/active-state
        // mechanic without the conflict.
        active: active === id,
        onClick: () => setActive(id),
      }))}
    />
  );
}

function GooeyMenuPreview() {
  return (
    <GooeyMenu
      aria-label="Preview sections"
      items={[
        { id: "work", label: "Work" },
        { id: "studio", label: "Studio" },
        { id: "contact", label: "Contact" },
      ]}
    />
  );
}

function FloatingDockPreview() {
  const [active, setActive] = useState("home");

  const items = [
    { id: "home", label: "Home", icon: <DockGlyph shape="square" /> },
    { id: "work", label: "Work", icon: <DockGlyph shape="circle" /> },
    { id: "notes", label: "Notes", icon: <DockGlyph shape="bar" /> },
    { id: "settings", label: "Settings", icon: <DockGlyph shape="ring" /> },
  ];

  return (
    <FloatingDock
      items={items.map((item) => ({
        ...item,
        active: item.id === active,
        onSelect: () => setActive(item.id),
      }))}
      aria-label="Preview dock"
    />
  );
}

function DockGlyph({ shape }: { shape: "square" | "circle" | "bar" | "ring" }) {
  const base = "block bg-current";
  if (shape === "circle") return <span className={`${base} size-4 rounded-pill`} />;
  if (shape === "bar") return <span className={`${base} h-1.5 w-4.5 rounded-pill`} />;
  if (shape === "ring")
    return <span className="block size-4 rounded-pill border-[1.5px] border-current" />;
  return <span className={`${base} size-4 rounded-[5px]`} />;
}

function ElasticTogglePreview() {
  const [notifications, setNotifications] = useState(true);
  const [sounds, setSounds] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <ElasticToggle
        label="Notifications"
        checked={notifications}
        onCheckedChange={setNotifications}
      />
      <ElasticToggle label="Sounds" checked={sounds} onCheckedChange={setSounds} />
    </div>
  );
}

const EMAIL_TEMPLATE_VARIANTS = [
  {
    id: "subscription",
    label: "Subscription",
    props: {
      eyebrow: "Subscription confirmed",
      heading: "You're on the list.",
      body: "We'll send the next release notes straight to this inbox — no spam, unsubscribe any time.",
      ctaLabel: "Manage subscription",
      footer: "Sent to you@example.com because you subscribed at pinkyui.com.",
    },
  },
  {
    id: "reset",
    label: "Password reset",
    props: {
      eyebrow: undefined,
      heading: "Reset your password",
      body: "We got a request to reset your password. This link expires in 1 hour — if this wasn't you, you can ignore this email.",
      ctaLabel: "Reset password",
      footer: "Sent to you@example.com. Didn't request this? Contact support.",
    },
  },
  {
    id: "welcome",
    label: "Welcome",
    props: {
      eyebrow: undefined,
      heading: "Welcome to Pinky UI",
      body: "Your account is ready. Explore the component library or jump straight into the docs to get building.",
      ctaLabel: undefined,
      footer: "Sent to you@example.com.",
    },
  },
  {
    id: "order",
    label: "Order",
    props: {
      eyebrow: "Order confirmed",
      heading: "Order #4821 is on its way.",
      body: "We've charged your card on file and started packing. You'll get a tracking link the moment it ships.",
      ctaLabel: "View order",
      footer: "Sent to you@example.com about order #4821.",
    },
  },
  {
    id: "security",
    label: "Security",
    props: {
      eyebrow: "New sign-in detected",
      heading: "New sign-in from Chrome on macOS",
      body: "We noticed a sign-in from a device we haven't seen before, near Sydney, Australia. If this was you, no action is needed.",
      ctaLabel: "Review activity",
      footer: "Sent to you@example.com. Wasn't you? Secure your account immediately.",
    },
  },
] as const;

function EmailTemplatePreview() {
  const [variant, setVariant] = useState<(typeof EMAIL_TEMPLATE_VARIANTS)[number]["id"]>("subscription");
  const active = EMAIL_TEMPLATE_VARIANTS.find((item) => item.id === variant) ?? EMAIL_TEMPLATE_VARIANTS[0];
  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-1.5">
        {EMAIL_TEMPLATE_VARIANTS.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={item.id === variant}
            onClick={() => setVariant(item.id)}
            className={`min-h-8 rounded-pill px-3 text-xs ${item.id === variant ? "bg-ink-900 text-milk" : "border border-line text-ink-700"}`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <EmailTemplate brand="Pinky UI" {...active.props} />
    </div>
  );
}

function FlipDigitsPreview() {
  const [stat, setStat] = useState(1249);
  const [seconds, setSeconds] = useState(45);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <FlipDigits value={stat} size="lg" label="Members" />
        <button
          type="button"
          onClick={() => setStat(100 + Math.floor(Math.random() * 9000))}
          className="min-h-8 rounded-pill border border-line px-3 text-xs text-ink-700"
        >
          Randomize
        </button>
      </div>
      <div className="flex flex-col items-center gap-2">
        <FlipDigits value={`00:${String(seconds).padStart(2, "0")}`} size="md" label="Time remaining" />
        <button
          type="button"
          onClick={() => setSeconds((current) => Math.max(0, current - 1))}
          className="min-h-8 rounded-pill border border-line px-3 text-xs text-ink-700"
        >
          Tick down
        </button>
      </div>
    </div>
  );
}

function PanelLine({ children }: { children: ReactNode }) {
  return <p className="px-1 text-center text-sm leading-relaxed text-ink-700">{children}</p>;
}
