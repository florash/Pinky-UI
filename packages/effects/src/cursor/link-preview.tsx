"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { springs, useMotionEnabled } from "@pinky-ui/primitives";
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

import { useFinePointer, usePointerSource } from "../internal/pointer-motion";

type PreviewCard = { key: string; title: string; description?: string; image?: string };
type PreviewSource = "pointer" | "focus";

type PreviewContextValue = {
  show: (card: PreviewCard, source: PreviewSource, node: HTMLElement | null) => void;
  hide: (card: PreviewCard) => void;
};

const PreviewContext = createContext<PreviewContextValue | null>(null);

export type LinkPreviewProps = {
  children: ReactNode;
  width?: number;
  className?: string;
  zIndex?: number;
  disabled?: boolean;
};

/**
 * Reveals a floating card — thumbnail, title, one line of description — while
 * a link below is hovered or focused. The card is `LinkPreviewItem`'s content,
 * not this component's decision: pass whatever summary the link deserves.
 *
 * Keyboard users are not a fallback here: focusing a link shows the same card,
 * anchored beside it instead of chasing a pointer that does not exist, and
 * that path works under reduced motion and on touch too.
 */
export function LinkPreview({ children, width = 280, className, zIndex = 40, disabled = false }: LinkPreviewProps) {
  const motionEnabled = useMotionEnabled();
  const fine = useFinePointer();
  const follows = motionEnabled && fine && !disabled;
  const pointer = usePointerSource(follows);

  const [card, setCard] = useState<PreviewCard | null>(null);
  const [source, setSource] = useState<PreviewSource>("pointer");
  const current = useRef<string | null>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const left = useSpring(rawX, springs.soft);
  const top = useSpring(rawY, springs.soft);

  const show = useCallback<PreviewContextValue["show"]>(
    (next, from, node) => {
      current.current = next.key;
      setCard(next);
      setSource(from);

      if (from === "focus" && node) {
        // Anchor beside the link, clamped into the viewport.
        const box = node.getBoundingClientRect();
        const anchorX = Math.min(box.right + width / 2 + 24, window.innerWidth - width / 2 - 12);
        const anchorY = Math.max(box.top, 12);
        rawX.jump(anchorX);
        rawY.jump(anchorY);
      } else {
        rawX.jump(pointer.x.get() + 20);
        rawY.jump(pointer.y.get() + 20);
      }
    },
    [pointer.x, pointer.y, rawX, rawY, width],
  );

  const hide = useCallback<PreviewContextValue["hide"]>((next) => {
    // Ignore a leave that arrives after another link has already taken over.
    if (current.current !== next.key) return;
    current.current = null;
    setCard(null);
  }, []);

  // While a pointer-sourced preview is open, follow the pointer with a small
  // offset so the card never sits directly under the cursor it belongs to.
  useEffect(() => {
    if (!follows || !card || source !== "pointer") return;

    const write = () => {
      rawX.set(pointer.x.get() + 20);
      rawY.set(pointer.y.get() + 20);
    };

    const stopX = pointer.x.on("change", write);
    const stopY = pointer.y.on("change", write);
    return () => {
      stopX();
      stopY();
    };
  }, [follows, card, source, pointer.x, pointer.y, rawX, rawY]);

  const context = useMemo<PreviewContextValue>(() => ({ show, hide }), [show, hide]);
  const still = !motionEnabled;

  return (
    <PreviewContext.Provider value={context}>
      <div className={className}>{children}</div>

      <AnimatePresence>
        {card ? (
          <motion.div
            aria-hidden
            data-pinky-preview={source}
            initial={still ? false : { opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={still ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
            transition={still ? { duration: 0 } : { type: "spring", ...springs.snappy }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              zIndex,
              width,
              pointerEvents: "none",
              overflow: "hidden",
              borderRadius: 18,
              boxShadow: "var(--shadow-lift)",
              background: "var(--color-white)",
              border: "1px solid var(--color-line)",
              x: left,
              y: top,
            }}
          >
            {card.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={card.image} alt="" width={width} height={Math.round(width * 0.56)} style={{ width: "100%", height: Math.round(width * 0.56), objectFit: "cover", display: "block" }} />
            ) : null}
            <div style={{ padding: "0.75rem 0.875rem" }}>
              <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--color-ink-900)", margin: 0 }}>{card.title}</p>
              {card.description ? (
                <p style={{ marginTop: "0.25rem", fontSize: "0.75rem", lineHeight: 1.5, color: "var(--color-ink-700)" }}>{card.description}</p>
              ) : null}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </PreviewContext.Provider>
  );
}

export type LinkPreviewItemProps = {
  children: ReactNode;
  title: string;
  description?: string;
  image?: string;
  as?: ElementType;
  className?: string;
};

/**
 * One link that reveals a preview card.
 *
 * Put a real `<a>` inside it — this wrapper adds no semantics and no tab stop
 * of its own, so the link stays a link.
 */
export function LinkPreviewItem({ children, title, description, image, as: Tag = "div", className }: LinkPreviewItemProps) {
  const context = useContext(PreviewContext);
  const ref = useRef<HTMLElement>(null);
  const card = useMemo<PreviewCard>(
    () => ({ key: `${title}::${description ?? ""}::${image ?? ""}`, title, description, image }),
    [title, description, image],
  );

  // A link can unmount or be filtered away while hovered.
  useEffect(() => () => context?.hide(card), [context, card]);

  if (!context) return <Tag className={className}>{children}</Tag>;

  return (
    <Tag
      ref={ref}
      className={className}
      onPointerEnter={(event: ReactPointerEvent) => {
        if (event.pointerType !== "touch" && event.pointerType !== "pen") {
          context.show(card, "pointer", ref.current);
        }
      }}
      onPointerLeave={(event: ReactPointerEvent) => {
        if (event.relatedTarget instanceof Node && event.currentTarget.contains(event.relatedTarget)) return;
        context.hide(card);
      }}
      onPointerCancel={() => context.hide(card)}
      onFocus={() => context.show(card, "focus", ref.current)}
      onBlur={(event: ReactFocusEvent) => {
        if (event.relatedTarget instanceof Node && event.currentTarget.contains(event.relatedTarget)) return;
        context.hide(card);
      }}
    >
      {children}
    </Tag>
  );
}
