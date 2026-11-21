// Ảnh: metadata trong D1 (bảng images), file trong KV (binding MEDIA).
// Id ảnh ngẫu nhiên và file không bao giờ bị ghi đè → URL /img/<id>/<size> cache vĩnh viễn được.
import { type ImageSize, MAX_IMAGES, MAX_UPLOAD_BYTES } from "@/lib/images";
import type { Img, OwnerType } from "@/lib/types";
import { getDb, getEnv } from "./db";

export const OWNER_TABLE: Record<OwnerType, string> = { category: "categories", product: "products", project: "projects" };

const kvKey = (id: string, size: ImageSize) => `img/${id}/${size}`;
const ALLOWED_MIME = ["image/webp", "image/jpeg", "image/png"];

export type UploadResult = { ok: true; image: Img } | { ok: false; error: string; status: number };

export async function addImage(input: {
  ownerType: OwnerType;
  ownerId: number;
  lg: File;
  sm: File;
  width: number;
  height: number;
}): Promise<UploadResult> {
  const { ownerType, ownerId, lg, sm, width, height } = input;
  for (const [size, file] of [["lg", lg], ["sm", sm]] as const) {
    if (!ALLOWED_MIME.includes(file.type)) return { ok: false, status: 415, error: "Chỉ nhận ảnh WebP, JPEG hoặc PNG." };
    if (file.size > MAX_UPLOAD_BYTES[size]) return { ok: false, status: 413, error: "Ảnh quá lớn sau khi nén." };
  }
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1 || width > 4000 || height > 4000) {
    return { ok: false, status: 400, error: "Kích thước ảnh không hợp lệ." };
  }

  const db = await getDb();
  const stats = await db
    .prepare(
      `SELECT (SELECT COUNT(*) FROM ${OWNER_TABLE[ownerType]} WHERE id = ?2) AS owner, COUNT(*) AS n, COALESCE(MAX(sort_order), -1) AS max_order
       FROM images WHERE owner_type = ?1 AND owner_id = ?2`,
    )
    .bind(ownerType, ownerId)
    .first<{ owner: number; n: number; max_order: number }>();
  if (!stats?.owner) return { ok: false, status: 404, error: "Không tìm thấy mục cần thêm ảnh." };
  const max = MAX_IMAGES[ownerType];
  if (stats.n >= max) return { ok: false, status: 400, error: `Tối đa ${max} ảnh cho mỗi mục.` };

  const id = crypto.randomUUID().replace(/-/g, "").slice(0, 16);
  const { MEDIA } = await getEnv();
  // Ghi KV trước, D1 sau: nếu D1 lỗi thì chỉ còn file mồ côi trong KV (vô hại), không có record trỏ tới file không tồn tại.
  await Promise.all([
    MEDIA.put(kvKey(id, "lg"), await lg.arrayBuffer(), { metadata: { mime: lg.type } }),
    MEDIA.put(kvKey(id, "sm"), await sm.arrayBuffer(), { metadata: { mime: sm.type } }),
  ]);
  await db
    .prepare("INSERT INTO images (id, owner_type, owner_id, sort_order, width, height, bytes, mime) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
    .bind(id, ownerType, ownerId, stats.max_order + 1, width, height, lg.size + sm.size, lg.type)
    .run();
  return { ok: true, image: { id, width, height } };
}

export async function getImageFile(id: string, size: ImageSize) {
  const { MEDIA } = await getEnv();
  // cacheTtl: KV giữ bản sao ở edge 1 ngày → đọc lại nhanh, không tính thêm lượt đọc từ kho trung tâm.
  return MEDIA.getWithMetadata<{ mime: string }>(kvKey(id, size), { type: "arrayBuffer", cacheTtl: 86400 });
}

export async function deleteKvFiles(ids: string[]): Promise<void> {
  if (ids.length === 0) return;
  const { MEDIA } = await getEnv();
  await Promise.all(ids.flatMap((id) => [MEDIA.delete(kvKey(id, "lg")), MEDIA.delete(kvKey(id, "sm"))]));
}

export async function deleteImage(imageId: string): Promise<{ ownerType: OwnerType; ownerId: number } | null> {
  const db = await getDb();
  const row = await db
    .prepare("DELETE FROM images WHERE id = ? RETURNING owner_type, owner_id")
    .bind(imageId)
    .first<{ owner_type: OwnerType; owner_id: number }>();
  if (!row) return null;
  await deleteKvFiles([imageId]);
  return { ownerType: row.owner_type, ownerId: row.owner_id };
}

/** Xoá một mục (danh mục/sản phẩm/công trình) cùng toàn bộ ảnh của nó (D1 + KV). */
export async function deleteOwner(ownerType: OwnerType, ownerId: number): Promise<void> {
  const db = await getDb();
  const { results } = await db
    .prepare("SELECT id FROM images WHERE owner_type = ? AND owner_id = ?")
    .bind(ownerType, ownerId)
    .all<{ id: string }>();
  await db.batch([
    db.prepare("DELETE FROM images WHERE owner_type = ? AND owner_id = ?").bind(ownerType, ownerId),
    db.prepare(`DELETE FROM ${OWNER_TABLE[ownerType]} WHERE id = ?`).bind(ownerId),
  ]);
  await deleteKvFiles(results.map((r) => r.id));
}

/** Ghi lại thứ tự ảnh theo mảng id (phần tử đầu = ảnh bìa). */
export async function reorderImages(ownerType: OwnerType, ownerId: number, orderedIds: string[]): Promise<void> {
  if (orderedIds.length === 0) return;
  const db = await getDb();
  await db.batch(
    orderedIds.map((id, i) =>
      db.prepare("UPDATE images SET sort_order = ? WHERE id = ? AND owner_type = ? AND owner_id = ?").bind(i, id, ownerType, ownerId),
    ),
  );
}
