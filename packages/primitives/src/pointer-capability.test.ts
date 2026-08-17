import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { setPointerCapability } from "../../../vitest.setup";
import { usePointerCapability } from "./internal/use-pointer-capability";

describe("usePointerCapability", () => {
  it("defaults to touch — no hover, no fine pointer — before a capability is confirmed", () => {
    const { result } = renderHook(() => usePointerCapability());
    expect(result.current).toEqual({ hasHover: false, isFine: false, isTouch: true });
  });

  it("reports hover-capable once (hover: hover) and (pointer: fine) resolve true", () => {
    setPointerCapability(true);
    const { result } = renderHook(() => usePointerCapability());
    expect(result.current).toEqual({ hasHover: true, isFine: true, isTouch: false });
  });
});
