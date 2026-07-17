import { notFound } from "next/navigation";
import { updateStockItemAction } from "@/app/admin/actions";
import { StockForm } from "@/components/admin/stock-form";
import { getStockItemById } from "@/db/queries/stock";
import { requireAdmin } from "@/lib/auth";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditStockItemPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;
  const itemId = Number(id);
  if (!Number.isInteger(itemId)) notFound();

  const item = await getStockItemById(itemId);
  if (!item) notFound();

  return (
    <>
      <h1 className="font-display text-navy-500 text-2xl font-bold">Editar material</h1>
      <div className="mt-8">
        <StockForm
          action={updateStockItemAction.bind(null, item.id)}
          submitLabel="Guardar cambios"
          values={{
            material: item.material,
            form: item.form,
            color: item.color,
            availability: item.availability,
            notes: item.notes,
            published: item.published,
          }}
        />
      </div>
    </>
  );
}
