# Domain migration checklist — pinkyui.com

Run through this after `node scripts/migrate-domain.mjs` (no `--dry-run`)
and before pushing. Everything here is verifiable locally except DNS
propagation and the live post-deploy checks at the end.

**Do not start this until told to.** The domain is registered at
Cloudflare but DNS is not necessarily pointed at GitHub Pages yet — running
the migration script before that's confirmed just means the deploy
temporarily serves at a domain that doesn't resolve. See
[the migration plan](#migration-plan-reference) below for the full
investigation this checklist is based on.

## Pre-flight

- [ ] DNS at Cloudflare actually points `pinkyui.com` at GitHub Pages
      (an `A`/`AAAA` record set to GitHub's Pages IPs, or a `CNAME` record
      to `florash.github.io`, per GitHub's custom-domain docs) — confirm
      before running the script, not after
- [ ] `git status` clean, on a fresh branch off `main` (or `split/
      audit-and-components` if that hasn't merged yet)

## Run the migration

- [ ] `node scripts/migrate-domain.mjs --dry-run` — read the output, confirm
      the 5 expected changes across `.github/workflows/pages.yml`,
      `scripts/verify-release.mjs`, and `README.md` are all found (✓, not ✗)
- [ ] `node scripts/migrate-domain.mjs` (no flag) — writes the changes
- [ ] `git diff` — read it. Should be small: two env-var lines in
      `pages.yml`, two fallback-default strings in `verify-release.mjs`,
      one badge line in `README.md`

## Build verification

- [ ] `npm run build` — plain build still succeeds (confirms the edit
      didn't break anything unrelated)
- [ ] `NEXT_PUBLIC_SITE_URL=https://pinkyui.com NEXT_PUBLIC_STATIC_EXPORT=true npm run build`
      (no `NEXT_PUBLIC_BASE_PATH` — matches the migrated `pages.yml`)
      succeeds
- [ ] `cat apps/website/out/CNAME` → exactly `pinkyui.com`
- [ ] `npm run verify:release` passes end to end (this now also runs the
      static-export + CNAME assertion itself, so a plain pass here already
      covers the point above — do both anyway once, so a verify:release
      regression there doesn't hide behind a coincidentally-passing manual
      check)

## No leftover references

- [ ] `grep -rn "florash.github.io" --include="*.ts" --include="*.tsx" --include="*.mjs" --include="*.yml" --include="*.md" .`
      (excluding `node_modules`, `.next`, `out`, `dist`) → **zero** hits.
      If anything shows up, it's either a new hardcoded reference that
      should have gone through `SITE.url` instead, or this checklist's own
      grep command showing up in itself — check which
- [ ] `grep -rn "/Pinky-UI" apps/website/src scripts .github` → zero hits
      that are actually the *base path* (not the GitHub repo name/URL,
      which stays `github.com/florash/Pinky-UI` — the repo doesn't rename)
- [ ] Built HTML has no `/Pinky-UI` prefix on internal links: `grep -r
      "/Pinky-UI/" apps/website/out --include="*.html" -l | head` → empty

## Absolute-URL correctness (the part that breaks quietly)

- [ ] View source on the built home page (`apps/website/out/index.html`)
      → `<meta property="og:url">`, `<link rel="canonical">`, and any
      `<meta property="og:image">` all say `https://pinkyui.com/...`, not
      `florash.github.io` and not a bare relative path
- [ ] `cat apps/website/out/sitemap.xml/index.html` (or wherever the
      static export puts it — check the actual path in `out/`) — every
      `<loc>` starts with `https://pinkyui.com`
- [ ] Fetch `apps/website/out/opengraph-image` and `.../twitter-image` (or
      open them in a browser after `npx serve apps/website/out`) — the
      images render, aren't broken/blank

## Local smoke test

- [ ] `npx serve apps/website/out` (or equivalent static server) →
      confirm the site loads at `/` with no basePath prefix needed
- [ ] Pick 20 random routes from `apps/website/out/**/index.html` and load
      each — no 404s, no broken layout
- [ ] Open the mobile nav, expand a couple of groups — this branch's fix
      still works after the URL changes underneath it (it doesn't depend
      on the domain, but confirm anyway — cheap check)
- [ ] Fonts and any images load (check the Network tab for 404s on
      `/_next/static/...` — a leftover basePath assumption anywhere would
      show up here first)

## Known pre-existing issue, not part of this migration

A handful of internal links use a raw `<a href="/...">` instead of
`next/link`'s `<Link>`, which means they never picked up the `/Pinky-UI`
prefix even under the current deploy (`components/home/
featured-interaction-wall.tsx:457`, `components/effects/
effects-showcase.tsx:131` via `KineticUnderline as="a"`, and several in
`components/workflows/workflow-showcase.tsx`). Migrating to a root-domain
deploy incidentally "fixes" these by making the missing prefix irrelevant
— worth noting during the smoke test above, but the underlying bug (raw
`<a>` instead of `<Link>`) should still get its own fix independent of the
domain, since the same mistake will break again the next time a base path
is ever reintroduced (a preview deployment, a docs subpath, anything).

## Post-deploy (after DNS propagates)

- [ ] `https://pinkyui.com` loads over HTTPS with a valid certificate
      (GitHub Pages provisions this automatically once DNS + CNAME are
      both correct — can take up to ~24h)
- [ ] `https://florash.github.io/Pinky-UI` — confirm what happens (GitHub
      typically keeps serving the project-pages URL alongside a custom
      domain; if it now 404s or redirects, decide whether that's wanted or
      whether old links pointing at the github.io URL need a redirect)
- [ ] Share a link to `pinkyui.com` in Slack/iMessage/X and confirm the
      og:image preview renders — this is the one check that can't be done
      from `out/` alone, since it depends on the crawler actually fetching
      the live, DNS-resolved URL

## Migration plan reference

The full investigation this checklist and `scripts/migrate-domain.mjs` are
based on: `apps/website/src/lib/site.ts` already reads the site origin
(`NEXT_PUBLIC_SITE_URL`) and base path (`NEXT_PUBLIC_BASE_PATH`) from the
environment at build time, and every absolute-URL call site in the app —
`metadataBase` in `app/layout.tsx`, `sitemap.ts`, `robots.ts`, and
`pageMetadata()`'s canonical/og:url — already goes through `SITE.url` /
`absoluteSiteUrl()` rather than a hardcoded origin. `next.config.mjs`
reads `basePath` from the same env var and Next's own router prefixes
every `next/link` `<Link>` with it automatically. That's why the
migration is two CI env-var lines and one doc link, not a sweeping
find-and-replace: the codebase was already built for this.
