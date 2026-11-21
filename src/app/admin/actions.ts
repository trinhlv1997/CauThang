"use server";

// Server actions của trang quản trị. Mỗi action là một endpoint công khai,
// nên PHẢI gọi requireAdmin() và kiểm tra kiểu tham số trước khi làm bất cứ việc gì.
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isOwnerType, SETTING_FIELDS, type OwnerType, type Settings } from "@/lib/types";
import { checkPassword, endSession, requireAdmin, startSession } from "@/server/auth";
import { type FieldErrors, parseCategory, parseProduct, parseProject } from "@/server/forms";
import { deleteImage, deleteOwner, reorderImages } from "@/server/images";
import {
  createCategory,
  createProduct,
  createProject,
  deleteLead,
  moveItem,
  saveSettings,
  setActive,
  setLeadStatus,
  updateCategory,
  updateProduct,
  updateProject,
} from "@/server/mutations";

export type FormState = { error?: string; errors?: FieldErrors; message?: string } | undefined;

const PATH: Record<OwnerType, string> = { category: "/admin/categories", product: "/admin/products", project: "/admin/projects" };
const validId = (id: unknown): id is number => Number.isInteger(id) && (id as number) > 0;

export async function loginAction(_prev: FormState, fd: FormData): Promise<FormState> {
  const password = String(fd.get("password") ?? "");
  if (!password || !(await checkPassword(password))) {
    await new Promise((r) => setTimeout(r, 800)); // làm chậm thử mật khẩu hàng loạt
    return { error: "Mật khẩu không đúng." };
  }
  await startSession();
  const next = String(fd.get("next") ?? "");
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logoutAction(): Promise<void> {
  await endSession();
  redirect("/admin/login");
}

/* ----------------------------- Danh mục ----------------------------- */

export async function saveCategoryAction(id: number | null, _prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  if (id !== null && !validId(id)) return { error: "Mục không hợp lệ." };
  const parsed = parseCategory(fd);
  if (!parsed.ok) return { error: "Vui lòng kiểm tra lại các trường được đánh dấu.", errors: parsed.errors };
  let newId: number | null = null;
  try {
    if (id) await updateCategory(id, parsed.data);
    else newId = await createCategory(parsed.data);
  } catch (err) {
    if (String(err).includes("UNIQUE")) return { error: "Đường dẫn đã được dùng cho danh mục khác.", errors: { slug: "Đường dẫn bị trùng." } };
    throw err;
  }
  revalidatePath("/admin/categories");
  if (newId) redirect(`/admin/categories/${newId}?created=1`);
  return { message: "Đã lưu." };
}

/* ----------------------------- Sản phẩm ----------------------------- */

export async function saveProductAction(id: number | null, _prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  if (id !== null && !validId(id)) return { error: "Mục không hợp lệ." };
  const parsed = parseProduct(fd);
  if (!parsed.ok) return { error: "Vui lòng kiểm tra lại các trường được đánh dấu.", errors: parsed.errors };
  if (id) await updateProduct(id, parsed.data);
  else redirect(`/admin/products/${await createProduct(parsed.data)}?created=1`);
  revalidatePath("/admin/products");
  return { message: "Đã lưu." };
}

/* ----------------------------- Công trình ---------------------------- */

export async function saveProjectAction(id: number | null, _prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  if (id !== null && !validId(id)) return { error: "Mục không hợp lệ." };
  const parsed = parseProject(fd);
  if (!parsed.ok) return { error: "Vui lòng kiểm tra lại các trường được đánh dấu.", errors: parsed.errors };
  if (id) await updateProject(id, parsed.data);
  else redirect(`/admin/projects/${await createProject(parsed.data)}?created=1`);
  revalidatePath("/admin/projects");
  return { message: "Đã lưu." };
}

/* --------------------- Thao tác chung trên danh sách --------------------- */

export async function deleteItemAction(type: OwnerType, id: number): Promise<void> {
  await requireAdmin();
  if (!isOwnerType(type) || !validId(id)) return;
  await deleteOwner(type, id);
  revalidatePath(PATH[type]);
  redirect(PATH[type]);
}

export async function moveItemAction(type: OwnerType, id: number, dir: -1 | 1): Promise<void> {
  await requireAdmin();
  if (!isOwnerType(type) || !validId(id) || (dir !== -1 && dir !== 1)) return;
  await moveItem(type, id, dir);
  revalidatePath(PATH[type]);
}

export async function setActiveAction(type: OwnerType, id: number, active: boolean): Promise<void> {
  await requireAdmin();
  if (!isOwnerType(type) || !validId(id) || typeof active !== "boolean") return;
  await setActive(type, id, active);
  revalidatePath(PATH[type]);
}

/* -------------------------------- Ảnh -------------------------------- */

export async function deleteImageAction(imageId: string): Promise<void> {
  await requireAdmin();
  if (typeof imageId !== "string" || !/^[a-f0-9]{16}$/.test(imageId)) return;
  const owner = await deleteImage(imageId);
  if (owner) revalidatePath(`${PATH[owner.ownerType]}/${owner.ownerId}`);
}

export async function reorderImagesAction(type: OwnerType, ownerId: number, orderedIds: string[]): Promise<void> {
  await requireAdmin();
  if (!isOwnerType(type) || !validId(ownerId)) return;
  if (!Array.isArray(orderedIds) || orderedIds.length > 50 || !orderedIds.every((x) => typeof x === "string")) return;
  await reorderImages(type, ownerId, orderedIds);
  revalidatePath(`${PATH[type]}/${ownerId}`);
}

/* ----------------------------- Thông tin chung ----------------------------- */

export async function saveSettingsAction(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const s = {} as Settings;
  for (const { key } of SETTING_FIELDS) s[key] = String(fd.get(key) ?? "").trim().slice(0, 300);
  if (!s.brandMain) return { error: "Nhập tên thương hiệu.", errors: { brandMain: "Bắt buộc." } };
  await saveSettings(s);
  revalidatePath("/admin/settings");
  return { message: "Đã lưu." };
}

/* ------------------------------ Khách hàng ------------------------------ */

export async function leadStatusAction(id: number, status: "new" | "done"): Promise<void> {
  await requireAdmin();
  if (!validId(id) || (status !== "new" && status !== "done")) return;
  await setLeadStatus(id, status);
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
}

export async function deleteLeadAction(id: number): Promise<void> {
  await requireAdmin();
  if (!validId(id)) return;
  await deleteLead(id);
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
}
