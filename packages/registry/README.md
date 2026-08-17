# @pinky-ui/registry

The typed metadata registry for Pinky UI's public components, layouts, effects, experiences and
product systems. It is useful for catalogue tooling and discovery surfaces rather than rendering
UI by itself.

## Registry installation

The `@pinky-ui/*` `0.1.0` packages are prepared for public release but are not published to npm yet. Until publication, use Pinky UI from the repository source.

### After npm publication

```bash
npm install @pinky-ui/registry
```

## Use

```ts
import { getComponent } from "@pinky-ui/registry";

const entry = getComponent("jelly-card");
```

Registry entries describe names, routes, import paths, usage, accessibility and relationships.
MIT licensed.
