import { ImageResponse } from "next/og";
import { isotypePaths, LOGO_GREEN, wordmarkPaths } from "@/components/layout/logo-paths";

/** Default Open Graph image, generated at build time, with the official lockup. */

export const alt = "Plásticos PIMSA — Ingeniería en polímeros reciclados";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        backgroundColor: "#0e1b2e",
        color: "#f7f8f5",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 26,
          letterSpacing: 6,
          textTransform: "uppercase",
          color: "#b0cd75",
        }}
      >
        {"Cobertura nacional · ISO 9001:2015"}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ display: "flex", fontSize: 84, fontWeight: 700, lineHeight: 1.05 }}>
          Polímeros de ingeniería
        </div>
        <div style={{ display: "flex", fontSize: 34, color: "#517aad" }}>plasticospimsa.com</div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderTop: "1px solid #294466",
          paddingTop: 28,
          fontSize: 28,
        }}
      >
        <svg viewBox="0 0 1461 311" width={216} height={46}>
          <g transform="translate(-305.59 -145.16) scale(1.3462)">
            {isotypePaths.map((path) => (
              <path
                key={path.d.slice(0, 24)}
                d={path.d}
                fill={path.green ? LOGO_GREEN : "#f7f8f5"}
              />
            ))}
          </g>
          <g transform="translate(598.06 -373)">
            {wordmarkPaths.map((path) => (
              <path
                key={path.d.slice(0, 24)}
                d={path.d}
                fill={path.green ? LOGO_GREEN : "#f7f8f5"}
              />
            ))}
          </g>
        </svg>
        <div style={{ display: "flex", color: "#7f9d41" }}>Economía circular industrial</div>
      </div>
    </div>,
    size,
  );
}
