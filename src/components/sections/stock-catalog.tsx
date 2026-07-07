"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { stockFilters, stockItems } from "@/content/stock";
import { cn } from "@/lib/utils";

/**
 * Filterable stock catalog (DESIGN.md §7): static data today, and Phase 3
 * only swaps src/content/stock.ts for a database query.
 */
export function StockCatalog() {
  const [form, setForm] = useState<string>("Todos");

  const items = useMemo(
    () => (form === "Todos" ? stockItems : stockItems.filter((item) => item.form === form)),
    [form],
  );

  const filterOptions = ["Todos", ...stockFilters.forms];

  return (
    <div>
      {/* Form filter */}
      <div role="group" aria-label="Filtrar por presentación" className="flex flex-wrap gap-2">
        {filterOptions.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={form === option}
            onClick={() => setForm(option)}
            className={cn(
              "rounded-sm border px-4 py-2 font-mono text-xs tracking-wider uppercase transition-colors duration-150",
              form === option
                ? "bg-navy-500 border-navy-500 text-white"
                : "border-line bg-surface text-ink-muted hover:border-navy-500 hover:text-navy-500",
            )}
          >
            {option}
          </button>
        ))}
      </div>

      <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.id}>
            <Card lift className="h-full">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-navy-500 text-lg font-semibold">{item.material}</h3>
                <Badge>{item.form}</Badge>
              </div>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-muted font-mono text-xs tracking-wider uppercase">Color</dt>
                  <dd className="text-ink">{item.color}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-muted font-mono text-xs tracking-wider uppercase">
                    Disponibilidad
                  </dt>
                  <dd className="text-green-600 font-medium">{item.availability}</dd>
                </div>
              </dl>
              {item.notes ? <p className="text-ink-muted mt-3 text-sm">{item.notes}</p> : null}
            </Card>
          </li>
        ))}
      </ul>

      {items.length === 0 ? (
        <p className="text-ink-muted mt-8">No hay materiales con ese filtro por el momento.</p>
      ) : null}
    </div>
  );
}
