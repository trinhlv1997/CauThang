const vnd = new Intl.NumberFormat("vi-VN");

/** 800000 → "800.000đ" */
export function formatPrice(value: number): string {
  return `${vnd.format(value)}đ`;
}

/** Bỏ dấu tiếng Việt, chữ thường. */
export function normalizeText(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/Đ/g, "d").toLowerCase();
}

export function slugify(s: string): string {
  return normalizeText(s).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}

/** "0900 000 000" → "0900000000" (dùng cho tel: và zalo.me) */
export function phoneDigits(s: string): string {
  return s.replace(/[^\d+]/g, "");
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", dateStyle: "short", timeStyle: "short" });
}
