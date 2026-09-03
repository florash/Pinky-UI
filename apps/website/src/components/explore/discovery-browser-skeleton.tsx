/**
 * Suspense fallback for <DiscoveryBrowser> (which needs useSearchParams and
 * so can't be part of the static shell). The previous fallback was `null` —
 * the entire browse section rendered as empty space until client JS
 * hydrated, then popped in at full height and shoved the footer down by
 * ~1600px. This reserves roughly the same shape so that jump doesn't happen.
 *
 * Proportions approximate the curated view's real sections (featured wall,
 * browse header, quick links, search, filter chips, a couple of family
 * rows) — close enough to kill the layout shift, not a pixel-perfect replica.
 */
function Block({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-2xl bg-cloud-50 ${className}`} />;
}

export function DiscoveryBrowserSkeleton() {
  return (
    <div aria-hidden className="mx-auto max-w-[76rem] px-5 sm:px-8">
      {/* Featured interaction wall (compact) */}
      <div className="mt-8 grid gap-3 lg:grid-cols-12">
        <Block className="h-[22rem] lg:col-span-7" />
        <div className="grid gap-3 lg:col-span-5">
          <Block className="h-[10.5rem]" />
          <Block className="h-[10.5rem]" />
        </div>
      </div>

      {/* Browse header */}
      <div className="mt-16 space-y-3">
        <Block className="h-3 w-40" />
        <Block className="h-9 w-96 max-w-full" />
        <Block className="h-5 w-full max-w-xl" />
      </div>

      {/* Quick links */}
      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <Block className="h-20" />
        <Block className="h-20" />
        <Block className="h-20" />
      </div>

      {/* Search */}
      <Block className="mt-8 h-14 w-full max-w-2xl rounded-full" />

      {/* Filter chips */}
      <div className="mt-5 flex flex-wrap gap-2">
        {Array.from({ length: 8 }, (_, index) => (
          <Block key={index} className="h-9 w-20 rounded-full" />
        ))}
      </div>

      {/* A couple of family sections */}
      {[0, 1].map((section) => (
        <div key={section} className="mt-14">
          <Block className="h-6 w-32" />
          <div className="mt-6 grid grid-cols-1 gap-[var(--pinky-grid-gap)] sm:grid-cols-12">
            <Block className="h-[var(--pinky-card-h-md)] sm:col-span-6 lg:col-span-4" />
            <Block className="h-[var(--pinky-card-h-md)] sm:col-span-6 lg:col-span-4" />
            <Block className="hidden h-[var(--pinky-card-h-md)] lg:col-span-4 lg:block" />
          </div>
        </div>
      ))}
    </div>
  );
}
