export * from "./cursor";
export * from "./motion";
export * from "./text";
export * from "./scroll";

// Shared effect infrastructure used by the public experiences package. These
// hooks are exported from the package boundary deliberately; consumers should
// never need to reach into the package's private implementation paths to
// compose an effect.
export {
  useFinePointer,
  usePointerSource,
  type PointerSource,
} from "./internal/pointer-motion";
export {
  useInView,
  type InViewOptions,
} from "./internal/in-view";
export {
  useRect,
  type TrackedRect,
} from "./internal/use-rect";
export {
  useScrollSource,
  useViewportProgress,
  type ScrollSource,
} from "./internal/scroll-motion";
