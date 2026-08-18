import Link from "next/link";

import type { NavLeaf } from "@/config/navigation";

/**
 * Home -> L1 -> L2 -> current, rendered from whatever trail the caller
 * already resolved. `trail` holds the clickable ancestors; `current` is the
 * page's own name, shown last and unlinked.
 */
export function Breadcrumbs({ trail, current, className }: { trail: NavLeaf[]; current: string; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={className ?? "text-xs text-ink-500"}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <li>
          <Link href="/" className="transition-colors hover:text-ink-900">
            Pinky UI
          </Link>
        </li>
        {trail.map((step) => (
          <li key={step.href} className="flex items-center gap-2">
            <span aria-hidden>/</span>
            <Link href={step.href} className="transition-colors hover:text-ink-900">
              {step.label}
            </Link>
          </li>
        ))}
        <li className="flex items-center gap-2">
          <span aria-hidden>/</span>
          <span className="text-ink-900">{current}</span>
        </li>
      </ol>
    </nav>
  );
}
