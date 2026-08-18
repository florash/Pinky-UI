import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";
// Required for `output: "export"` (static export) — this image never
// varies per-request, so it's safe to generate once at build time.
export const dynamic = "force-static";

// Matches PinkyMark in components/site/site-header.tsx: two soft
// overlapping fields, blush over cloud, on a white rounded square.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 9,
          background: "#ffffff",
        }}
      >
        <div style={{ position: "relative", width: 22, height: 22, display: "flex" }}>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 4,
              width: 15,
              height: 15,
              borderRadius: "50%",
              background: "#f4c7d7",
              display: "flex",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: 0,
              top: 4,
              width: 15,
              height: 15,
              borderRadius: "50%",
              background: "#c8e4f7",
              mixBlendMode: "multiply",
              display: "flex",
            }}
          />
        </div>
      </div>
    ),
    { ...size },
  );
}
