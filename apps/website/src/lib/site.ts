/** Single place for site-wide constants. */
export const SITE = {
  name: "Pinky UI",
  tagline: "Soft, fluid and interactive React components for modern interfaces.",
  short: "UI that likes to move.",
  github: "https://github.com/florash/Pinky-UI",
  /** No production domain yet — set NEXT_PUBLIC_SITE_URL once the site is deployed. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;

export const NAV_LINKS = [
  { href: "/components", label: "Components", matchPrefixes: [] },
  { href: "/layouts", label: "Layouts", matchPrefixes: [] },
  {
    href: "/effects",
    label: "Effects",
    matchPrefixes: ["/experiences", "/navigation", "/heroes", "/backgrounds", "/transitions", "/spatial"],
  },
  { href: "/skills", label: "Skills", matchPrefixes: [] },
  { href: "/docs", label: "Docs", matchPrefixes: [] },
] as const;
