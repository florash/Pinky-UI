import { GitHubMark } from "@/components/site/icons";
import { Container, Section } from "@/components/site/layout";
import { MagneticLink } from "@/components/site/magnetic-link";
import { SITE } from "@/lib/site";

export function OpenSourceCta() {
  return (
    <Section id="open-source" className="pb-8">
      <Container>
        {/* `isolate` keeps the -z-10 lighting inside this card instead of
            dropping it behind the page background. */}
        <div className="relative isolate overflow-hidden rounded-2xl border border-line bg-white/80 px-6 py-16 text-center sm:px-16 sm:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 left-1/2 -z-10 size-[30rem] -translate-x-1/2 rounded-pill blur-[90px]"
            style={{ background: "var(--pinky-halo-a)" }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-32 right-[-6rem] -z-10 size-[26rem] rounded-pill blur-[90px]"
            style={{ background: "var(--pinky-halo-b)" }}
          />

          <p className="font-mono text-[0.6875rem] tracking-[0.18em] text-ink-500 uppercase">
            Open source
          </p>
          <h2 className="mx-auto mt-5 max-w-2xl text-section text-balance-tight">
            Built in the open, one interaction at a time.
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-ink-700">
            The catalogue, the code and the motion decisions are all public, so every interaction
            can be inspected before it becomes part of your interface.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <MagneticLink href={SITE.github} size="lg" external>
              <GitHubMark className="size-4" />
              View on GitHub
            </MagneticLink>
            <MagneticLink href="/components" variant="soft" size="lg">
              Browse components
            </MagneticLink>
          </div>
        </div>
      </Container>
    </Section>
  );
}
