# Releasing Pinky UI

Pinky UI is released as one initial `0.1.0` unit: all seven `@pinky/*` packages share the same
version and are published only after the dependency and external-state checks below pass.

## Local release-candidate gate

Run from a clean checkout:

```bash
npm ci
NEXT_PUBLIC_SITE_URL=https://your-real-site.example npm run verify:release
git diff --check
```

The gate covers the website build and metadata, Skill invariants, package metadata, package
builds, tarball hygiene, npm publish dry-runs and an isolated external consumer install,
TypeScript check and Vite production build.

## Publication order

Publish the dependency layers in this order, with packages in the same layer safe to publish in
parallel:

1. `@pinky/primitives`, `@pinky/registry`
2. `@pinky/components`, `@pinky/layouts`, `@pinky/effects`, `@pinky/systems`
3. `@pinky/experiences`

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
