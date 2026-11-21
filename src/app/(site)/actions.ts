"use server";

import { createLead } from "@/server/mutations";

export type LeadState = { ok?: boolean; error?: string; errors?: { name?: string; phone?: string } } | undefined;

// Form "Đăng ký tư vấn" (công khai). Ô "website" là bẫy bot: người thật không thấy nên để trống.
export async function submitLeadAction(_prev: LeadState, fd: FormData): Promise<LeadState> {
  const get = (k: string, max: number) => String(fd.get(k) ?? "").trim().slice(0, max);
  if (get("website", 100)) return { ok: true };

  const name = get("name", 80);
  const phone = get("phone", 20);
  const errors: NonNullable<LeadState>["errors"] = {};
  if (!name) errors.name = "Vui lòng nhập họ tên.";
  if (!/^(0|\+84)[0-9\s.]{8,12}$/.test(phone)) errors.phone = "Số điện thoại không hợp lệ.";
  if (errors.name || errors.phone) return { errors };

  await createLead({ name, phone, interest: get("interest", 120), message: get("message", 1000) });
  return { ok: true };
}
