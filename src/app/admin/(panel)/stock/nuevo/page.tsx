import { createStockItemAction } from "@/app/admin/actions";
import { StockForm } from "@/components/admin/stock-form";

export default function NewStockItemPage() {
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
