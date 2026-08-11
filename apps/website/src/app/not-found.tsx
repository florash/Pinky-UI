import { Container } from "@/components/site/layout";
import { MagneticLink } from "@/components/site/magnetic-link";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="font-mono text-[0.6875rem] tracking-[0.18em] text-ink-500 uppercase">404</p>
      <h1 className="mt-5 text-section">Nothing moves here.</h1>
      <p className="mt-4 max-w-sm text-base leading-relaxed text-ink-700">
        That page does not exist. The components, at least, are still where you left them.
      </p>
      <div className="mt-8">
        <MagneticLink href="/components">Browse components</MagneticLink>
      </div>
    </Container>
  );
}
