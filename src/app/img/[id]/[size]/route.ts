import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getImageFile } from "@/server/images";

// GET /img/<id>/<lg|sm>: ảnh từ KV, cache 3 lớp:
//  1. Trình duyệt: "immutable" 1 năm — id ảnh ngẫu nhiên, nội dung không bao giờ đổi (sửa = upload id mới).
//  2. Cache API của Cloudflare (data center gần khách): lần sau không đọc KV nữa.
//     Chỉ có tác dụng trên tên miền riêng; trên *.workers.dev Cache API không lưu gì.
//  3. KV cacheTtl (server/images.ts).
const CACHE_CONTROL = "public, max-age=31536000, immutable";

function edgeCache(): Cache | null {
  const c = (globalThis as { caches?: CacheStorage & { default?: Cache } }).caches;
  return c?.default ?? null; // không có khi chạy `next dev` trên Node
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string; size: string }> }) {
  const { id, size } = await params;
  if (!/^[a-f0-9]{16}$/.test(id) || (size !== "lg" && size !== "sm")) {
    return new Response("Not found", { status: 404 });
  }

  const etag = `"${id}-${size}"`;
  if (req.headers.get("If-None-Match") === etag) {
    return new Response(null, { status: 304, headers: { ETag: etag, "Cache-Control": CACHE_CONTROL } });
  }

  const cache = edgeCache();
  const cacheKey = new Request(new URL(req.url).origin + `/img/${id}/${size}`);
  const hit = await cache?.match(cacheKey);
  if (hit) return hit;

  const { value, metadata } = await getImageFile(id, size);
  if (!value) return new Response("Not found", { status: 404, headers: { "Cache-Control": "public, max-age=60" } });

  const res = new Response(value, {
    headers: {
      "Content-Type": metadata?.mime ?? "image/webp",
      "Cache-Control": CACHE_CONTROL,
      ETag: etag,
      "X-Content-Type-Options": "nosniff",
    },
  });
  if (cache) {
    const { ctx } = await getCloudflareContext({ async: true });
    ctx.waitUntil(cache.put(cacheKey, res.clone()));
  }
  return res;
}
