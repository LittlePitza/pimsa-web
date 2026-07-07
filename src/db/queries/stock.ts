import { asc, count, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { stockItems, type NewStockItem, type StockItem } from "@/db/schema";

/** Public reader — resilient: /stock renders an empty catalog on DB outage. */
export async function getPublishedStockItems(): Promise<StockItem[]> {
  try {
    return await db
      .select()
      .from(stockItems)
      .where(eq(stockItems.published, true))
      .orderBy(asc(stockItems.material), asc(stockItems.form));
  } catch (error) {
    console.error("[db] getPublishedStockItems failed:", error);
    return [];
  }
}

// ── Admin ────────────────────────────────────────────────────────────────

export async function listStockItems(): Promise<StockItem[]> {
  return db.select().from(stockItems).orderBy(desc(stockItems.updatedAt));
}

export async function getStockItemById(id: number): Promise<StockItem | null> {
  const rows = await db.select().from(stockItems).where(eq(stockItems.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function createStockItem(data: NewStockItem): Promise<number> {
  const [result] = await db.insert(stockItems).values(data);
  return result.insertId;
}

export async function updateStockItem(id: number, data: Partial<NewStockItem>): Promise<void> {
  await db.update(stockItems).set(data).where(eq(stockItems.id, id));
}

export async function setStockItemPublished(id: number, published: boolean): Promise<void> {
  await db.update(stockItems).set({ published }).where(eq(stockItems.id, id));
}

export async function deleteStockItem(id: number): Promise<void> {
  await db.delete(stockItems).where(eq(stockItems.id, id));
}

export async function countPublishedStockItems(): Promise<number> {
  const [row] = await db
    .select({ value: count() })
    .from(stockItems)
    .where(eq(stockItems.published, true));
  return row?.value ?? 0;
}
