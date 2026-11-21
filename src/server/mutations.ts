// Ghi dữ liệu. Chỉ gọi từ server action đã requireAdmin() (trừ createLead — form công khai).
import { SETTING_FIELDS, type OwnerType, type Settings } from "@/lib/types";
import { getDb } from "./db";
import type { CategoryInput, ProductInput, ProjectInput } from "./forms";
import { OWNER_TABLE } from "./images";

const b = (v: boolean) => (v ? 1 : 0);

async function nextSortOrder(table: string): Promise<number> {
  const db = await getDb();
  const row = await db.prepare(`SELECT COALESCE(MAX(sort_order), -1) + 1 AS n FROM ${table}`).first<{ n: number }>();
  return row?.n ?? 0;
}

export async function createCategory(d: CategoryInput): Promise<number> {
  const db = await getDb();
  const row = await db
    .prepare("INSERT INTO categories (slug, name, description, tag, tone, active, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id")
    .bind(d.slug, d.name, d.description, d.tag, d.tone, b(d.active), await nextSortOrder("categories"))
    .first<{ id: number }>();
  return row!.id;
}

export async function updateCategory(id: number, d: CategoryInput): Promise<void> {
  const db = await getDb();
  await db
    .prepare("UPDATE categories SET slug = ?, name = ?, description = ?, tag = ?, tone = ?, active = ? WHERE id = ?")
    .bind(d.slug, d.name, d.description, d.tag, d.tone, b(d.active), id)
    .run();
}

export async function createProduct(d: ProductInput): Promise<number> {
  const db = await getDb();
  const row = await db
    .prepare(
      `INSERT INTO products (category_id, name, sku, description, price, old_price, unit, tone, featured, active, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`,
    )
    .bind(d.categoryId, d.name, d.sku, d.description, d.price, d.oldPrice, d.unit, d.tone, b(d.featured), b(d.active), await nextSortOrder("products"))
    .first<{ id: number }>();
  return row!.id;
}

export async function updateProduct(id: number, d: ProductInput): Promise<void> {
  const db = await getDb();
  await db
    .prepare(
      `UPDATE products SET category_id = ?, name = ?, sku = ?, description = ?, price = ?, old_price = ?, unit = ?, tone = ?, featured = ?, active = ?
       WHERE id = ?`,
    )
    .bind(d.categoryId, d.name, d.sku, d.description, d.price, d.oldPrice, d.unit, d.tone, b(d.featured), b(d.active), id)
    .run();
}

export async function createProject(d: ProjectInput): Promise<number> {
  const db = await getDb();
  const row = await db
    .prepare("INSERT INTO projects (category_id, name, tone, active, sort_order) VALUES (?, ?, ?, ?, ?) RETURNING id")
    .bind(d.categoryId, d.name, d.tone, b(d.active), await nextSortOrder("projects"))
    .first<{ id: number }>();
  return row!.id;
}

export async function updateProject(id: number, d: ProjectInput): Promise<void> {
  const db = await getDb();
  await db
    .prepare("UPDATE projects SET category_id = ?, name = ?, tone = ?, active = ? WHERE id = ?")
    .bind(d.categoryId, d.name, d.tone, b(d.active), id)
    .run();
}

/** Đổi chỗ một mục với mục liền trước/sau trong danh sách (đánh số lại sort_order 0..n-1). */
export async function moveItem(type: OwnerType, id: number, dir: -1 | 1): Promise<void> {
  const db = await getDb();
  const table = OWNER_TABLE[type];
  const { results } = await db.prepare(`SELECT id FROM ${table} ORDER BY sort_order, id`).all<{ id: number }>();
  const ids = results.map((r) => r.id);
  const i = ids.indexOf(id);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= ids.length) return;
  [ids[i], ids[j]] = [ids[j], ids[i]];
  await db.batch(ids.map((x, k) => db.prepare(`UPDATE ${table} SET sort_order = ? WHERE id = ?`).bind(k, x)));
}

export async function setActive(type: OwnerType, id: number, active: boolean): Promise<void> {
  const db = await getDb();
  await db.prepare(`UPDATE ${OWNER_TABLE[type]} SET active = ? WHERE id = ?`).bind(b(active), id).run();
}

export async function saveSettings(s: Settings): Promise<void> {
  const db = await getDb();
  await db.batch(
    SETTING_FIELDS.map(({ key }) =>
      db.prepare("INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value").bind(key, s[key]),
    ),
  );
}

export async function createLead(d: { name: string; phone: string; interest: string; message: string }): Promise<void> {
  const db = await getDb();
  await db.prepare("INSERT INTO leads (name, phone, interest, message) VALUES (?, ?, ?, ?)").bind(d.name, d.phone, d.interest, d.message).run();
}

export async function setLeadStatus(id: number, status: "new" | "done"): Promise<void> {
  const db = await getDb();
  await db.prepare("UPDATE leads SET status = ? WHERE id = ?").bind(status, id).run();
}

export async function deleteLead(id: number): Promise<void> {
  const db = await getDb();
  await db.prepare("DELETE FROM leads WHERE id = ?").bind(id).run();
}
