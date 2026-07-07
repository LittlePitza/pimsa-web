import { ImageResponse } from "next/og";
import { company } from "@/content/company";

/**
 * Default Open Graph image, generated at build time.
 * TODO(marketing): replace with branded per-page OG art once photography
 * and the official logo are delivered.
 */

export const alt = "Plásticos PIMSA — Ingeniería en reciclaje de plásticos";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
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
          {`${company.address.municipality}, ${company.address.state} · ISO 9001:2015`}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", fontSize: 84, fontWeight: 700, lineHeight: 1.05 }}>
            Ingeniería en reciclaje de plásticos
          </div>
          <div style={{ display: "flex", fontSize: 34, color: "#517aad" }}>
            plasticospimsa.com
          </div>
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
          <div style={{ display: "flex", fontWeight: 700 }}>PIMSA</div>
          <div style={{ display: "flex", color: "#7f9d41" }}>Economía circular industrial</div>
        </div>
      </div>
    ),
    size,
  );
}
