// Truy vấn đọc nội dung. Mỗi trang gom các câu SQL vào một db.batch() = 1 lượt gọi D1,
// giữ thời gian phản hồi thấp và nằm trong giới hạn CPU của gói Free.
import { cache } from "react";
import type { Category, Lead, OwnerType, Product, Project, Settings } from "@/lib/types";
import { getDb } from "./db";
import {
  CAT_COLS,
  type CategoryRow,
  groupImages,
  IMG_COLS,
  IMG_ORDER,
  type ImageRow,
  PROD_COLS,
  type ProductRow,
  PROJ_COLS,
  type ProjectRow,
  toCategory,
  toProduct,
  toProject,
  toSettings,
} from "./rows";

export const HOME_PRODUCTS = 8;
export const HOME_PROJECTS = 8;

/* ------------------------------- Website ------------------------------- */

/** Thông tin chung + danh mục đang hiện. cache() để layout và page dùng chung trong 1 request. */
export const getSiteBase = cache(async (): Promise<{ settings: Settings; categories: Category[] }> => {
  const db = await getDb();
  const [settings, cats, images] = await db.batch([
    db.prepare("SELECT key, value FROM settings"),
    db.prepare(`SELECT ${CAT_COLS} FROM categories WHERE active = 1 ORDER BY sort_order, id`),
    db.prepare(
      `SELECT ${IMG_COLS} FROM images WHERE owner_type = 'category' AND owner_id IN (SELECT id FROM categories WHERE active = 1)${IMG_ORDER}`,
    ),
  ]);
  const map = groupImages(images.results as ImageRow[]);
  return {
    settings: toSettings(settings.results as { key: string; value: string }[]),
    categories: (cats.results as CategoryRow[]).map((r) => toCategory(r, map)),
  };
});

export async function getHomeData(): Promise<{ products: Product[]; projects: Project[] }> {
  const db = await getDb();
  const prodWhere = `FROM products WHERE active = 1 AND featured = 1 ORDER BY sort_order, id LIMIT ${HOME_PRODUCTS}`;
  const projWhere = `FROM projects WHERE active = 1 ORDER BY sort_order, id LIMIT ${HOME_PROJECTS}`;
  const [prods, projs, images] = await db.batch([
    db.prepare(`SELECT ${PROD_COLS} ${prodWhere}`),
    db.prepare(`SELECT ${PROJ_COLS} ${projWhere}`),
    db.prepare(
      `SELECT ${IMG_COLS} FROM images WHERE (owner_type = 'product' AND owner_id IN (SELECT id ${prodWhere}))
         OR (owner_type = 'project' AND owner_id IN (SELECT id ${projWhere}))${IMG_ORDER}`,
    ),
  ]);
  const map = groupImages(images.results as ImageRow[]);
  return {
    products: (prods.results as ProductRow[]).map((r) => toProduct(r, map)),
    projects: (projs.results as ProjectRow[]).map((r) => toProject(r, map)),
  };
}

export async function getCategoryContent(categoryId: number): Promise<{ products: Product[]; projects: Project[] }> {
  const db = await getDb();
  const [prods, projs, images] = await db.batch([
    db.prepare(`SELECT ${PROD_COLS} FROM products WHERE active = 1 AND category_id = ?1 ORDER BY sort_order, id`).bind(categoryId),
    db.prepare(`SELECT ${PROJ_COLS} FROM projects WHERE active = 1 AND category_id = ?1 ORDER BY sort_order, id`).bind(categoryId),
    db
      .prepare(
        `SELECT ${IMG_COLS} FROM images WHERE (owner_type = 'product' AND owner_id IN (SELECT id FROM products WHERE active = 1 AND category_id = ?1))
           OR (owner_type = 'project' AND owner_id IN (SELECT id FROM projects WHERE active = 1 AND category_id = ?1))${IMG_ORDER}`,
      )
      .bind(categoryId),
  ]);
  const map = groupImages(images.results as ImageRow[]);
  return {
    products: (prods.results as ProductRow[]).map((r) => toProduct(r, map)),
    projects: (projs.results as ProjectRow[]).map((r) => toProject(r, map)),
  };
}

/* -------------------------------- Admin -------------------------------- */

async function imagesOf(type: OwnerType, id?: number) {
  const db = await getDb();
  const stmt =
    id === undefined
      ? db.prepare(`SELECT ${IMG_COLS} FROM images WHERE owner_type = ?${IMG_ORDER}`).bind(type)
      : db.prepare(`SELECT ${IMG_COLS} FROM images WHERE owner_type = ? AND owner_id = ?${IMG_ORDER}`).bind(type, id);
  return groupImages((await stmt.all<ImageRow>()).results);
}

export async function getSettings(): Promise<Settings> {
  const db = await getDb();
  return toSettings((await db.prepare("SELECT key, value FROM settings").all<{ key: string; value: string }>()).results);
}

export async function listCategories(): Promise<Category[]> {
  const db = await getDb();
  const [rows, map] = await Promise.all([
    db.prepare(`SELECT ${CAT_COLS} FROM categories ORDER BY sort_order, id`).all<CategoryRow>(),
    imagesOf("category"),
  ]);
  return rows.results.map((r) => toCategory(r, map));
}

export async function getCategory(id: number): Promise<Category | null> {
  if (!Number.isSafeInteger(id) || id < 1) return null;
  const db = await getDb();
  const [row, map] = await Promise.all([
    db.prepare(`SELECT ${CAT_COLS} FROM categories WHERE id = ?`).bind(id).first<CategoryRow>(),
    imagesOf("category", id),
  ]);
  return row ? toCategory(row, map) : null;
}

export async function listProducts(): Promise<Product[]> {
  const db = await getDb();
  const [rows, map] = await Promise.all([
    db.prepare(`SELECT ${PROD_COLS} FROM products ORDER BY sort_order, id`).all<ProductRow>(),
    imagesOf("product"),
  ]);
  return rows.results.map((r) => toProduct(r, map));
}

export async function getProduct(id: number): Promise<Product | null> {
  if (!Number.isSafeInteger(id) || id < 1) return null;
  const db = await getDb();
  const [row, map] = await Promise.all([
    db.prepare(`SELECT ${PROD_COLS} FROM products WHERE id = ?`).bind(id).first<ProductRow>(),
    imagesOf("product", id),
  ]);
  return row ? toProduct(row, map) : null;
}

export async function listProjects(): Promise<Project[]> {
  const db = await getDb();
  const [rows, map] = await Promise.all([
    db.prepare(`SELECT ${PROJ_COLS} FROM projects ORDER BY sort_order, id`).all<ProjectRow>(),
    imagesOf("project"),
  ]);
  return rows.results.map((r) => toProject(r, map));
}

export async function getProject(id: number): Promise<Project | null> {
  if (!Number.isSafeInteger(id) || id < 1) return null;
  const db = await getDb();
  const [row, map] = await Promise.all([
    db.prepare(`SELECT ${PROJ_COLS} FROM projects WHERE id = ?`).bind(id).first<ProjectRow>(),
    imagesOf("project", id),
  ]);
  return row ? toProject(row, map) : null;
}

interface LeadRow {
  id: number;
  name: string;
  phone: string;
  interest: string;
  message: string;
  status: "new" | "done";
  created_at: string;
}

export async function listLeads(limit = 200): Promise<Lead[]> {
  const db = await getDb();
  const { results } = await db
    .prepare("SELECT id, name, phone, interest, message, status, created_at FROM leads ORDER BY status = 'done', created_at DESC LIMIT ?")
    .bind(limit)
    .all<LeadRow>();
  return results.map((r) => ({ ...r, createdAt: r.created_at }));
}

export async function getDashboardCounts() {
  const db = await getDb();
  return (await db
    .prepare(
      `SELECT (SELECT COUNT(*) FROM categories) AS categories, (SELECT COUNT(*) FROM products) AS products,
              (SELECT COUNT(*) FROM projects) AS projects, (SELECT COUNT(*) FROM images) AS images,
              (SELECT COALESCE(SUM(bytes), 0) FROM images) AS bytes, (SELECT COUNT(*) FROM leads WHERE status = 'new') AS newLeads`,
    )
    .first<{ categories: number; products: number; projects: number; images: number; bytes: number; newLeads: number }>())!;
}
