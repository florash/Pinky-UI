# Releasing Pinky UI

Pinky UI is released as one initial `0.1.0` unit: all seven `@pinky-ui/*` packages share the same
version and are published only after the dependency and external-state checks below pass.

## Local release-candidate gate

Run from a clean checkout:

```bash
npm ci
NEXT_PUBLIC_SITE_URL=https://your-real-site.example npm run verify:release
git diff --check
```

The gate covers the website build and metadata, Skill invariants, package metadata, package
builds, tarball hygiene, npm publish dry-runs, the production security audit and an isolated
external consumer install, TypeScript check and Vite production build.

## 3.0E security dependency constraints

The 15.5.x line currently ends at Next `15.5.23`, whose published manifest still requests
`postcss@8.4.31` and `sharp@^0.34.3`. The root overrides keep the Next major unchanged while
selecting `postcss@8.5.26` and `sharp@0.35.3`, the patched versions used by the reviewed Next
16.3.1 dependency contract. PostCSS remains on the same major line; Sharp 0.35.x is the
upstream patched line and is exercised by the complete website/package/consumer regression
suite. The lockfile must resolve one patched copy of each and no nested vulnerable PostCSS.

## Publication order

Publish the dependency layers in this order, with packages in the same layer safe to publish in
parallel:

1. `@pinky-ui/primitives`, `@pinky-ui/registry`
2. `@pinky-ui/components`, `@pinky-ui/layouts`, `@pinky-ui/effects`, `@pinky-ui/systems`
3. `@pinky-ui/experiences`

All seven packages currently use exact internal `0.1.0` dependency ranges. Scoped packages carry
`publishConfig.access: public`; npm authentication and 2FA remain operator responsibilities.

## Before real publication

- Confirm the GitHub repository, issue URL and package ownership are real and accessible.
- Confirm the actual hosting origin is set as `NEXT_PUBLIC_SITE_URL` and verify live sitemap,
  robots and canonical output.
- Confirm npm account access, public scoped-package permission, 2FA and the desired provenance/
  trusted-publishing policy.
- Review the npm dry-run artifact list and then publish only the approved package layers.
- Run the external consumer smoke test against registry-installed packages after publication.
- Create the Git tag and release notes only after registry and live-site verification.

This repository checkpoint performs no authentication, publication, tagging, GitHub release,
deployment or DNS changes.
