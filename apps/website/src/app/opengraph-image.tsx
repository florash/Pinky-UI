import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
// Required for `output: "export"` (static export) — this image never
// varies per-request, so it's safe to generate once at build time.
export const dynamic = "force-static";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "96px",
          background: "#fcfbf8",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -140,
            right: -120,
            width: 520,
            height: 520,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(244,199,215,0.65), rgba(244,199,215,0))",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -180,
            left: -100,
            width: 480,
            height: 480,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(200,228,247,0.6), rgba(200,228,247,0))",
            display: "flex",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #f4c7d7, #c8e4f7)",
              display: "flex",
            }}
          />
          <span style={{ fontSize: 34, fontWeight: 600, color: "#252933", letterSpacing: "-0.01em" }}>
            Pinky UI
          </span>
        </div>
        <div style={{ display: "flex", marginTop: 48 }}>
          <span style={{ fontSize: 84, fontWeight: 700, color: "#252933", letterSpacing: "-0.02em", lineHeight: 1.05 }}>
            A React library for interactive motion.
          </span>
        </div>
        <div style={{ display: "flex", marginTop: 28 }}>
          <span style={{ fontSize: 28, color: "#7b8492" }}>
            75 building blocks — every one has a live preview and an import path.
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
