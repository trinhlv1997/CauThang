// Ánh xạ hàng D1 (snake_case) sang kiểu camelCase trong lib/types.ts.
import { DEFAULT_SETTINGS, isTone, type Category, type Img, type OwnerType, type Product, type Project, type Settings } from "@/lib/types";

export const CAT_COLS = "id, slug, name, description, tag, tone, sort_order, active";
export const PROD_COLS = "id, category_id, name, sku, description, price, old_price, unit, tone, featured, sort_order, active";
export const PROJ_COLS = "id, category_id, name, tone, sort_order, active";
export const IMG_COLS = "id, owner_type, owner_id, width, height";
export const IMG_ORDER = " ORDER BY owner_type, owner_id, sort_order, created_at";

export interface CategoryRow {
  id: number;
  slug: string;
  name: string;
  description: string;
  tag: string;
  tone: string;
  sort_order: number;
  active: number;
}
export interface ProductRow {
  id: number;
  category_id: number | null;
  name: string;
  sku: string;
  description: string;
  price: number | null;
  old_price: number | null;
  unit: string;
  tone: string;
  featured: number;
  sort_order: number;
  active: number;
}
export interface ProjectRow {
  id: number;
  category_id: number | null;
  name: string;
  tone: string;
  sort_order: number;
  active: number;
}
export interface ImageRow {
  id: string;
  owner_type: OwnerType;
  owner_id: number;
  width: number;
  height: number;
}

export type ImageMap = Map<string, Img[]>;

export function groupImages(rows: ImageRow[]): ImageMap {
  const map: ImageMap = new Map();
  for (const r of rows) {
    const key = `${r.owner_type}:${r.owner_id}`;
    const list = map.get(key) ?? [];
    list.push({ id: r.id, width: r.width, height: r.height });
    map.set(key, list);
  }
  return map;
}

const imgs = (map: ImageMap, type: OwnerType, id: number) => map.get(`${type}:${id}`) ?? [];
const tone = (t: string) => (isTone(t) ? t : "glass");

export function toCategory(r: CategoryRow, map: ImageMap): Category {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    description: r.description,
    tag: r.tag,
    tone: tone(r.tone),
    sortOrder: r.sort_order,
    active: r.active === 1,
    images: imgs(map, "category", r.id),
  };
}

export function toProduct(r: ProductRow, map: ImageMap): Product {
  return {
    id: r.id,
    categoryId: r.category_id,
    name: r.name,
    sku: r.sku,
    description: r.description,
    price: r.price,
    oldPrice: r.old_price,
    unit: r.unit,
    tone: tone(r.tone),
    featured: r.featured === 1,
    sortOrder: r.sort_order,
    active: r.active === 1,
    images: imgs(map, "product", r.id),
  };
}

export function toProject(r: ProjectRow, map: ImageMap): Project {
  return {
    id: r.id,
    categoryId: r.category_id,
    name: r.name,
    tone: tone(r.tone),
    sortOrder: r.sort_order,
    active: r.active === 1,
    images: imgs(map, "project", r.id),
  };
}

export function toSettings(rows: { key: string; value: string }[]): Settings {
  const s: Settings = { ...DEFAULT_SETTINGS };
  for (const { key, value } of rows) if (key in s) s[key as keyof Settings] = value;
  return s;
}
