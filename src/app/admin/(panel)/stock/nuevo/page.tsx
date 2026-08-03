import { createStockItemAction } from "@/app/admin/actions";
import { StockForm } from "@/components/admin/stock-form";
import { requireArea } from "@/lib/auth";

export default async function NewStockItemPage() {
  await requireArea("marketing");

  return (
    <>
      <h1 className="font-display text-navy-500 text-2xl font-bold">Nuevo material</h1>
      <div className="mt-8">
        <StockForm
          action={createStockItemAction}
          submitLabel="Agregar material"
          values={{
            material: "",
            form: "Molido",
            color: "",
            availability: "Consultar",
            notes: "",
            published: true,
          }}
        />
      </div>
    </>
  );
}
