import Link from "next/link";

/**
 * Guarantees every detail page has at least a couple of outbound links back
 * into the catalogue, independent of whatever curated `related` list the
 * registry entry happens to carry. No page should be a dead end.
 */
export function FamilyLinks({
  heading,
  items,
}: {
  heading: string;
  items: Array<{ slug: string; name: string; href: string }>;
}) {
  if (items.length === 0) return null;

  return (
    <>
      <p className="mt-8 font-mono text-[0.6875rem] tracking-[0.14em] text-ink-500 uppercase">{heading}</p>
      <ul className="mt-3 flex flex-col gap-2">
        {items.map((item) => (
          <li key={item.slug}>
            <Link href={item.href} className="text-sm text-ink-700 transition-colors hover:text-ink-900">
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
