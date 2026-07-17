"use client";

/**
 * Last-resort boundary for errors in the root layout itself. Must render its
 * own <html>/<body> and stay dependency-free (global CSS may not be loaded).
 */
export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="es">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          display: "grid",
          placeItems: "center",
          minHeight: "100svh",
          margin: 0,
          background: "#f7f6f2",
          color: "#0e1b2e",
        }}
      >
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <h1 style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>
            Ocurrió un error inesperado
          </h1>
          <p style={{ marginBottom: "1.5rem", color: "#4b5563" }}>
            Reintenta o vuelve a intentarlo en unos minutos.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              padding: "0.6rem 1.4rem",
              border: "none",
              borderRadius: "4px",
              background: "#0e1b2e",
              color: "#fff",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            Reintentar
          </button>
        </div>
      </body>
    </html>
  );
}
