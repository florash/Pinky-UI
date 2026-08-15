# @pinky/registry

The typed metadata registry for Pinky UI's public components, layouts, effects, experiences and
product systems. It is useful for catalogue tooling and discovery surfaces rather than rendering
UI by itself.

## Install

```bash
npm install @pinky/registry
```

## Use

```ts
import { getComponent } from "@pinky/registry";

const entry = getComponent("jelly-card");
```

Registry entries describe names, routes, import paths, usage, accessibility and relationships.
MIT licensed.
