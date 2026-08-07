import type { Metadata } from "next";
import { CtaBand } from "@/components/sections/cta-band";
import { PageHero } from "@/components/sections/page-hero";
import { StockCatalog } from "@/components/sections/stock-catalog";
import { Container } from "@/components/ui/container";
import { getPublishedStockItems } from "@/db/queries/stock";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = buildMetadata({
  title: "Stock de plástico reciclado disponible",
  description:
    "Consulta la disponibilidad de polímeros de ingeniería reciclados: ABS, PC, PA, PP, HDPE y más, en molido o pellet. El inventario cambia constantemente — contáctanos.",
  path: "/stock",
  keywords: [
    "venta de plástico reciclado",
    "stock de resinas recicladas",
    "plástico molido en venta",
  ],
});

export default async function StockPage() {
  const items = await getPublishedStockItems();

  return (
    <>
      <PageHero
        eyebrow="Stock"
        title="Materiales disponibles"
        intro="Nuestro inventario rota constantemente según las campañas de reciclaje. Si no ves el material que buscas, contáctanos: podemos conseguirlo o avisarte cuando llegue."
        breadcrumbs={[
          { name: "Inicio", path: "/" },
          { name: "Stock", path: "/stock" },
        ]}
      />

      <section className="py-16 md:py-24">
        <Container>
          <StockCatalog items={items} />
          <p className="text-ink-muted mt-10 max-w-[68ch] text-sm">
            * Disponibilidad y precios sujetos a existencias. Solicita ficha técnica y muestra del
            lote actual antes de tu compra.
          </p>
        </Container>
      </section>

      <CtaBand
        title="¿Buscas un material en específico?"
        intro="Dinos resina, forma, color y volumen: revisamos existencias y te cotizamos el mismo día hábil."
      />
    </>
  );
}
