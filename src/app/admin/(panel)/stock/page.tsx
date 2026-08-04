import Link from "next/link";
import { deleteStockItemAction, setStockPublishedAction } from "@/app/admin/actions";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { ListingCount } from "@/components/admin/listing-count";
import { listStockItems, stockCounts } from "@/db/queries/stock";
import { requireArea } from "@/lib/auth";
import { ADMIN_LIST_LIMIT } from "@/lib/metrics";
import { cn, formatDate } from "@/lib/utils";

export default async function AdminStockPage() {
  await requireArea("marketing");
  const [items, counts] = await Promise.all([listStockItems(ADMIN_LIST_LIMIT), stockCounts()]);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-navy-500 text-2xl font-bold">Stock</h1>
        <ButtonLink href="/admin/stock/nuevo" size="sm">
          Nuevo material
        </ButtonLink>
      </div>
      <p className="text-ink-muted mt-2 text-sm">
        Los materiales marcados como visibles aparecen en{" "}
        <Link href="/stock" className="text-blue-600 underline">
          /stock
        </Link>{" "}
        (el sitio se actualiza en menos de un minuto).
      </p>
      <ListingCount shown={items.length} total={counts.total} noun="materiales" />

      <ul className="border-line bg-surface shadow-card mt-8 divide-y divide-(--color-line) rounded-md border">
        {items.map((item) => (
          <li key={item.id} className="flex flex-wrap items-center gap-4 p-5">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href={`/admin/stock/${item.id}`}
                  className="text-navy-500 hover:text-blue-600 font-display font-semibold"
                >
                  {item.material}
                </Link>
                <Badge>{item.form}</Badge>
                <Badge
                  className={cn(
                    item.published ? "border-green-600 text-green-600" : "text-ink-muted",
                  )}
                >
                  {item.published ? "Visible" : "Oculto"}
                </Badge>
              </div>
              <p className="text-ink-muted mt-1 text-sm">
                {item.color || "Sin color"} · {item.availability} · Actualizado{" "}
                {formatDate(item.updatedAt)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <form action={setStockPublishedAction.bind(null, item.id)}>
                <input type="hidden" name="published" value={item.published ? "false" : "true"} />
                <button
                  type="submit"
                  className={cn(
                    "rounded-sm px-3 py-1.5 text-sm font-medium",
                    item.published
                      ? "text-ink-muted hover:bg-navy-500/10"
                      : "text-green-600 hover:bg-green-600/10",
                  )}
                >
                  {item.published ? "Ocultar" : "Publicar"}
                </button>
              </form>
              <Link
                href={`/admin/stock/${item.id}`}
                className="text-navy-500 hover:bg-navy-500/10 rounded-sm px-3 py-1.5 text-sm font-medium"
              >
                Editar
              </Link>
              <form action={deleteStockItemAction.bind(null, item.id)}>
                <ConfirmButton
                  message={`¿Eliminar "${item.material} ${item.form}" del catálogo?`}
                  className="text-red-700 hover:bg-red-50 rounded-sm px-3 py-1.5 text-sm font-medium"
                >
                  Eliminar
                </ConfirmButton>
              </form>
            </div>
          </li>
        ))}
        {items.length === 0 ? (
          <li className="text-ink-muted p-6 text-sm">
            El catálogo está vacío. Agrega el primer material con «Nuevo material».
          </li>
        ) : null}
      </ul>
    </>
  );
}
