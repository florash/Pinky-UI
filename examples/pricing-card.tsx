/**
 * Composition example: a pricing card that lights up as you approach and gives
 * slightly under the pointer.
 *
 * Nothing here is a new component — Glow Border frames a Jelly Card, and the
 * action inside is magnetic on its own.
 */
import { GlowBorder, JellyCard, MagneticButton } from "@pinky/components";

const FEATURES = ["Unlimited projects", "Interaction presets", "Priority support"];

export function PricingCard() {
  return (
    <GlowBorder radius="2xl" className="w-full max-w-sm">
      <JellyCard radius="2xl" elasticity={0.25} intensity={0.12}>
        <p className="font-mono text-[0.6875rem] tracking-[0.14em] text-ink-500 uppercase">
          Studio
        </p>

        <p className="mt-4 font-display text-3xl font-semibold tracking-tight">
          $24
          <span className="ml-1 text-base font-normal text-ink-500">/ month</span>
        </p>

        <ul className="mt-5 flex flex-col gap-2 text-sm text-ink-700">
          {FEATURES.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>

        <div className="mt-7">
          <MagneticButton size="sm">Choose plan</MagneticButton>
        </div>
      </JellyCard>
    </GlowBorder>
  );
}
