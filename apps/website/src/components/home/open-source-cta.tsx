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
        <div className="relative isolate overflow-hidden rounded-2xl px-6 py-16 text-center sm:px-16 sm:py-20">
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

          <h2 className="mx-auto max-w-xl text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.06] tracking-[-0.03em] text-balance-tight">
            Built in the open, one interaction at a time.
          </h2>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
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
