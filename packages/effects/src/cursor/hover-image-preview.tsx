"use client";

import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { springs, useMotionEnabled } from "@pinky/primitives";
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

type PreviewImage = { src: string };
type PreviewSource = "pointer" | "focus";

type PreviewContextValue = {
  show: (image: PreviewImage, source: PreviewSource, node: HTMLElement | null) => void;
  hide: (image: PreviewImage) => void;
};

const PreviewContext = createContext<PreviewContextValue | null>(null);

export type HoverImagePreviewProps = {
  children: ReactNode;
  width?: number;
  height?: number;
  /** Maximum tilt of the floating image, in degrees. */
  rotation?: number;
  className?: string;
  zIndex?: number;
  disabled?: boolean;
};

/**
 * Reveals a floating image while a row in the list below is hovered or focused.
 *
 * The pattern belongs to project indexes and article lists: the list stays a
 * list — scannable, linkable, cheap to render — and the imagery arrives only
 * for the row you are actually considering.
 *
 * Keyboard users are not a fallback here. Focusing a row shows the same image,
 * anchored beside the row instead of chasing a pointer that does not exist, and
 * that path works under reduced motion and on touch too.
 */
export function HoverImagePreview({
  children,
  width = 260,
  height = 180,
  rotation = 4,
  className,
  zIndex = 40,
  disabled = false,
}: HoverImagePreviewProps) {
  const motionEnabled = useMotionEnabled();
  const fine = useFinePointer();
  const follows = motionEnabled && fine && !disabled;
  const pointer = usePointerSource(follows);

  const [image, setImage] = useState<PreviewImage | null>(null);
  const [source, setSource] = useState<PreviewSource>("pointer");
  const current = useRef<string | null>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, springs.soft);
  const y = useSpring(rawY, springs.soft);

  // Tilt with horizontal speed: the image leans into the direction of travel.
  const tilt = useTransform(pointer.velocityX, [-2200, 2200], [-rotation, rotation], {
    clamp: true,
  });
  const angle = useSpring(tilt, springs.soft);

  const left = useTransform(x, (value) => value - width / 2);
  const top = useTransform(y, (value) => value - height / 2);

  const show = useCallback<PreviewContextValue["show"]>(
    (next, from, node) => {
      current.current = next.src;
      setImage(next);
      setSource(from);

      if (from === "focus" && node) {
        // Anchor beside the row, clamped into the viewport so a row near the
        // bottom of the screen does not push the preview off it.
        const box = node.getBoundingClientRect();
        const anchorX = Math.min(box.right + width / 2 + 24, window.innerWidth - width / 2 - 12);
        const anchorY = Math.min(
          Math.max(box.top + box.height / 2, height / 2 + 12),
          window.innerHeight - height / 2 - 12,
        );
        rawX.jump(anchorX);
        rawY.jump(anchorY);
      }
    },
    [height, rawX, rawY, width],
  );

  const hide = useCallback<PreviewContextValue["hide"]>((next) => {
    // Ignore a leave that arrives after another row has already taken over.
    if (current.current !== next.src) return;
    current.current = null;
    setImage(null);
  }, []);

  // While a pointer-sourced preview is open, follow the pointer. The
  // subscription exists only for that window, and writes motion values only.
  useEffect(() => {
    if (!follows || !image || source !== "pointer") return;

    const write = () => {
      rawX.set(pointer.x.get());
      rawY.set(pointer.y.get());
    };

    rawX.jump(pointer.x.get());
    rawY.jump(pointer.y.get());

    const stopX = pointer.x.on("change", write);
    const stopY = pointer.y.on("change", write);
    return () => {
      stopX();
      stopY();
    };
  }, [follows, image, source, pointer.x, pointer.y, rawX, rawY]);

  const context = useMemo<PreviewContextValue>(() => ({ show, hide }), [show, hide]);

  const still = !motionEnabled;

  return (
    <PreviewContext.Provider value={context}>
      <div className={className}>{children}</div>

      <AnimatePresence>
        {image ? (
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
              height,
              pointerEvents: "none",
              overflow: "hidden",
              borderRadius: 18,
              boxShadow: "var(--shadow-lift)",
              background: "var(--color-white)",
              x: left,
              y: top,
              rotate: still || source === "focus" ? 0 : angle,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.src}
              alt=""
              width={width}
              height={height}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </PreviewContext.Provider>
  );
}

export type HoverImagePreviewItemProps = {
  children: ReactNode;
  /** Image URL revealed for this row. */
  src: string;
  as?: ElementType;
  className?: string;
};

/**
 * One row that reveals an image.
 *
 * Put a real link or button inside it — this wrapper adds no semantics and no
 * tab stop of its own, so the row stays whatever you made it.
 */
export function HoverImagePreviewItem({
  children,
  src,
  as: Tag = "div",
  className,
}: HoverImagePreviewItemProps) {
  const context = useContext(PreviewContext);
  const ref = useRef<HTMLElement>(null);
  const image = useMemo<PreviewImage>(() => ({ src }), [src]);

  // A row can unmount or be filtered away while hovered.
  useEffect(() => () => context?.hide(image), [context, image]);

  if (!context) return <Tag className={className}>{children}</Tag>;

  return (
    <Tag
      ref={ref}
      className={className}
      onPointerEnter={(event: ReactPointerEvent) => {
        if (event.pointerType !== "touch" && event.pointerType !== "pen") {
          context.show(image, "pointer", ref.current);
        }
      }}
      onPointerLeave={(event: ReactPointerEvent) => {
        if (event.relatedTarget instanceof Node && event.currentTarget.contains(event.relatedTarget)) return;
        context.hide(image);
      }}
      onPointerCancel={() => context.hide(image)}
      onFocus={() => context.show(image, "focus", ref.current)}
      onBlur={(event: ReactFocusEvent) => {
        if (event.relatedTarget instanceof Node && event.currentTarget.contains(event.relatedTarget)) return;
        context.hide(image);
      }}
    >
      {children}
    </Tag>
  );
}
