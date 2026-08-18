# Contributing to Pinky UI

Pinky UI is an interaction-first React system. Contributions should preserve direct
previews, structural variety and the quiet Milk / White / Blush Pink / Cloud Blue visual
language instead of turning the library into a uniform card catalogue.

## Local setup

```bash
npm install
npm run dev
```

For a lockfile-exact install, use `npm ci`. The repository targets Node 22 and npm 10;
the root `package.json` records the package-manager contract used by CI.

The website runs at `http://localhost:3000`. Before opening a pull request, run the same
checks used by the repository:

```bash
npm run typecheck
npm run lint
npm test
npm run build
git diff --check
```

Production metadata uses the `NEXT_PUBLIC_SITE_URL` origin. Local development falls back to
`http://localhost:3000`; release verification uses a non-local origin explicitly:

```bash
NEXT_PUBLIC_SITE_URL=https://pinky-ui.example.test npm run verify:release
```

Set the real public deployment origin in the hosting environment before publishing. The value
must be an `http` or `https` origin without credentials, a path, query string or fragment.

When changing a public package or preparing a release checkpoint, run the complete gate:

```bash
npm run build:packages
npm run verify:release
```

## Project shape

- `apps/website` is the Next.js documentation and live-preview site.
- `packages/primitives` contains reusable interaction behaviours.
- `packages/components`, `layouts`, `effects`, `experiences` and `systems` contain the
  public source families used by the site.
- `packages/registry` describes the discoverable library and its relationships.
- `packages/skills` contains the canonical Markdown interaction recipes.

The `@pinky-ui/*` packages have publish-like `dist` and declaration contracts, but are not
published automatically. Do not publish packages or change package visibility without a
dedicated release decision.

## Adding or updating a Skill

Only add a Skill when it describes a genuinely distinct interaction concept. Keep the recipe,
registry entry, route and live preview aligned. A recipe should explain when to use the pattern,
when not to use it, the interaction states, a stable import path, accessibility expectations,
mobile behaviour and reduced-motion fallback. Avoid placeholder copy and screenshots in place
of the real interaction.

## Quality expectations

- Make the core interaction usable with keyboard, focus and touch where those inputs apply.
- Never make hover the only way to understand or complete an action.
- Use text, structure and semantics in addition to colour for status, validation and selection.
- Preserve `prefers-reduced-motion` fallbacks; motion must not carry the only meaning.
- Keep primary touch targets close to 44px and keep horizontal gestures inside their own rail.
- Prefer white as the dominant surface, with restrained blush, cloud and approved ink tones.
- Test representative desktop and 390px mobile states for every changed live preview.

Please keep changes focused. Do not reset or rewrite unrelated work in a dirty worktree, and do
not add generated build output, screenshots, logs or local environment files.
