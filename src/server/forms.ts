// Đọc + kiểm tra dữ liệu form admin. Trả về lỗi theo từng trường để hiển thị cạnh ô nhập.
import { slugify } from "@/lib/format";
import { isTone, type Tone } from "@/lib/types";

export type FieldErrors = Partial<Record<string, string>>;
type Parsed<T> = { ok: true; data: T } | { ok: false; errors: FieldErrors };

const str = (fd: FormData, k: string, max = 500) => String(fd.get(k) ?? "").trim().slice(0, max);
const bool = (fd: FormData, k: string) => fd.get(k) === "on";

function money(fd: FormData, k: string): number | null | "invalid" {
  const raw = str(fd, k).replace(/[.,\s₫đ]/gi, "");
  if (raw === "") return null;
  const n = Number(raw);
  return Number.isSafeInteger(n) && n >= 0 ? n : "invalid";
}

function categoryId(fd: FormData): number | null {
  const n = Number(str(fd, "categoryId"));
  return Number.isInteger(n) && n > 0 ? n : null;
}

function toneOf(fd: FormData): Tone {
  const t = str(fd, "tone");
  return isTone(t) ? t : "glass";
}

export interface CategoryInput {
  slug: string;
  name: string;
  description: string;
  tag: string;
  tone: Tone;
  active: boolean;
}

export function parseCategory(fd: FormData): Parsed<CategoryInput> {
  const name = str(fd, "name", 120);
  const slug = slugify(str(fd, "slug") || name);
  const errors: FieldErrors = {};
  if (!name) errors.name = "Nhập tên danh mục.";
  if (!slug) errors.slug = "Đường dẫn không hợp lệ.";
  if (Object.keys(errors).length) return { ok: false, errors };
  return {
    ok: true,
    data: { slug, name, description: str(fd, "description", 2000), tag: str(fd, "tag", 40), tone: toneOf(fd), active: bool(fd, "active") },
  };
}

export interface ProductInput {
  categoryId: number | null;
  name: string;
  sku: string;
  description: string;
  price: number | null;
  oldPrice: number | null;
  unit: string;
  tone: Tone;
  featured: boolean;
  active: boolean;
}

export function parseProduct(fd: FormData): Parsed<ProductInput> {
  const name = str(fd, "name", 160);
  const price = money(fd, "price");
  const oldPrice = money(fd, "oldPrice");
  const errors: FieldErrors = {};
  if (!name) errors.name = "Nhập tên mẫu cầu thang.";
  if (price === "invalid") errors.price = "Giá phải là số nguyên ≥ 0 (bỏ trống = Liên hệ báo giá).";
  if (oldPrice === "invalid") errors.oldPrice = "Giá cũ phải là số nguyên ≥ 0.";
  else if (oldPrice !== null && (price === null || price === "invalid" || oldPrice <= price)) {
    errors.oldPrice = "Giá cũ phải lớn hơn giá bán (bỏ trống nếu không giảm giá).";
  }
  if (price === "invalid" || oldPrice === "invalid" || Object.keys(errors).length) return { ok: false, errors };
  return {
    ok: true,
    data: {
      categoryId: categoryId(fd),
      name,
      sku: str(fd, "sku", 40),
      description: str(fd, "description", 2000),
      price,
      oldPrice,
      unit: str(fd, "unit", 20),
      tone: toneOf(fd),
      featured: bool(fd, "featured"),
      active: bool(fd, "active"),
    },
  };
}

export interface ProjectInput {
  categoryId: number | null;
  name: string;
  tone: Tone;
  active: boolean;
}

export function parseProject(fd: FormData): Parsed<ProjectInput> {
  const name = str(fd, "name", 200);
  if (!name) return { ok: false, errors: { name: "Nhập tên công trình." } };
  return { ok: true, data: { categoryId: categoryId(fd), name, tone: toneOf(fd), active: bool(fd, "active") } };
}
