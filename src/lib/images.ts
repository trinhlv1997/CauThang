import type { Img, OwnerType } from "@/lib/types";

// Ảnh được nén ở trình duyệt trước khi upload (imageCompress.ts) thành 2 bản và lưu trong KV.
export const IMAGE_SIZES = { lg: 1600, sm: 640 } as const;
export type ImageSize = keyof typeof IMAGE_SIZES;
export const MAX_UPLOAD_BYTES = { lg: 2_000_000, sm: 400_000 } as const;
export const MAX_IMAGES: Record<OwnerType, number> = { category: 30, product: 12, project: 20 };

export function imageSrc(id: string, size: ImageSize): string {
  return `/img/${id}/${size}`;
}

/** srcset: trình duyệt tự chọn bản 640px hay 1600px theo kích thước hiển thị và mật độ điểm ảnh. */
export function imageSrcSet(img: Img): string {
  const lg = Math.min(img.width, IMAGE_SIZES.lg);
  const sm = Math.min(img.width, IMAGE_SIZES.sm);
  return lg > sm ? `${imageSrc(img.id, "sm")} ${sm}w, ${imageSrc(img.id, "lg")} ${lg}w` : `${imageSrc(img.id, "lg")} ${lg}w`;
}

/** Cạnh của bản sm (để đặt width/height cho <img>, tránh nhảy layout). */
export function smSize(img: Img): { width: number; height: number } {
  const scale = Math.min(1, IMAGE_SIZES.sm / Math.max(img.width, img.height));
  return { width: Math.round(img.width * scale), height: Math.round(img.height * scale) };
}
