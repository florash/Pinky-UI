"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ElementType,
  type FocusEvent as ReactFocusEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";

/** What a region tells the cursor about itself while it is hovered or focused. */
export type CursorTargetState = {
  /** Short verb shown by Cursor Text — "View", "Open", "Drag". */
  label?: string;
  /** Free-form name a cursor layer can style against. */
  variant?: string;
  /** Multiplier on the follower's resting size. Keep it near 1. */
  scale?: number;
};

type Claim = { id: number; state: CursorTargetState };

type CursorContextValue = {
  /** The innermost target currently claiming the cursor, or null. */
  target: CursorTargetState | null;
  /** Claim the cursor. Returns a release function; calling it is mandatory. */
  claim: (state: CursorTargetState) => () => void;
};

const CursorContext = createContext<CursorContextValue | null>(null);

export type CursorProviderProps = { children: ReactNode };

/**
 * Shared state for cursor effects that need to know what the pointer is over.
 *
 * The alternative — every cursor layer attaching its own document-level
 * `mouseover` handler and guessing from selectors — cannot express intent:
 * a region knows it means "View project", and a selector never will. Regions
 * declare, the cursor reads.
 *
 * Claims are a stack, so nested targets behave (the innermost wins) and an
 * unmount while hovered cannot leave a stale label behind.
 *
 * State changes here happen on enter and leave only — never per pointer frame.
 */
export function CursorProvider({ children }: CursorProviderProps) {
  const stack = useRef<Claim[]>([]);
  const nextId = useRef(0);
  const [target, setTarget] = useState<CursorTargetState | null>(null);

  const sync = useCallback(() => {
    setTarget(stack.current.at(-1)?.state ?? null);
  }, []);

  const claim = useCallback<CursorContextValue["claim"]>(
    (state) => {
      const id = nextId.current++;
      stack.current.push({ id, state });
      sync();

      return () => {
        const index = stack.current.findIndex((entry) => entry.id === id);
        if (index === -1) return;
        stack.current.splice(index, 1);
        sync();
      };
    },
    [sync],
  );

  const value = useMemo<CursorContextValue>(() => ({ target, claim }), [target, claim]);

  return <CursorContext.Provider value={value}>{children}</CursorContext.Provider>;
}

/**
 * Reads the current cursor target.
 *
 * Returns a null target outside a provider rather than throwing, so a cursor
 * layer can be dropped into any page and simply behave as its plain self.
 */
export function useCursorTarget(): CursorTargetState | null {
  return useContext(CursorContext)?.target ?? null;
}

/** Low-level access for components that claim the cursor themselves. */
export function useCursorClaim(): CursorContextValue["claim"] | null {
  return useContext(CursorContext)?.claim ?? null;
}

/**
 * Claims the cursor while `active` is true. Releases on unmount, always.
 */
export function useCursorClaimWhile(active: boolean, state: CursorTargetState) {
  const claim = useCursorClaim();
  const { label, variant, scale } = state;

  useEffect(() => {
    if (!active || !claim) return;
    return claim({ label, variant, scale });
  }, [active, claim, label, variant, scale]);
}

export type CursorTargetProps = {
  children: ReactNode;
  /** Shown by Cursor Text while this region is hovered or focused. */
  label?: string;
  variant?: string;
  scale?: number;
  /** Element to render. Use `li`, `a` or `section` to keep semantics intact. */
  as?: ElementType;
  className?: string;
  disabled?: boolean;
};

/**
 * Marks a region as meaningful to the cursor.
 *
 * Focus counts as hover here: a keyboard user tabbing through a project list
 * gets the same "Open" state a mouse user gets, which is the difference between
 * a cursor effect being decoration and being an interface.
 */
export function CursorTarget({
  children,
  label,
  variant,
  scale,
  as: Tag = "div",
  className,
  disabled = false,
}: CursorTargetProps) {
  const claim = useCursorClaim();
  const release = useRef<(() => void) | null>(null);

  const take = useCallback(() => {
    if (!claim || disabled || release.current) return;
    release.current = claim({ label, variant, scale });
  }, [claim, disabled, label, variant, scale]);

  const drop = useCallback(() => {
    release.current?.();
    release.current = null;
  }, []);

  // A target can unmount while hovered — a filtered list, a route change.
  useEffect(() => drop, [drop]);

  // Re-claim when the label changes mid-hover, so a row that renames itself
  // does not keep showing the old verb.
  useEffect(() => {
    if (!release.current) return;
    release.current();
    release.current = null;
    take();
  }, [take]);

  return (
    <Tag
      className={className}
      onPointerEnter={(event: ReactPointerEvent) => {
        // PointerType is empty in a few synthetic events. Treat that as an
        // unknown fine-pointer event; only explicit touch/pen should skip the
        // desktop cursor claim.
        if (event.pointerType !== "touch" && event.pointerType !== "pen") take();
      }}
      onPointerLeave={(event: ReactPointerEvent) => {
        if (event.relatedTarget instanceof Node && event.currentTarget.contains(event.relatedTarget)) return;
        drop();
      }}
      onPointerCancel={drop}
      onFocus={take}
      onBlur={(event: ReactFocusEvent) => {
        if (event.relatedTarget instanceof Node && event.currentTarget.contains(event.relatedTarget)) return;
        drop();
      }}
    >
      {children}
    </Tag>
  );
}
