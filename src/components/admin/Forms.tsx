"use client";

import { useActionState } from "react";
import { saveCategoryAction, saveProductAction, saveProjectAction, saveSettingsAction } from "@/app/admin/actions";
import { SETTING_FIELDS, type Category, type Product, type Project, type Settings } from "@/lib/types";
import { Check, Field, FormFooter, inputCls, ToneSelect } from "./ui";

type CategoryOption = { id: number; name: string };
const card = "space-y-4 rounded-2xl bg-white p-6 shadow-sm";

function CategorySelect({ categories, value }: { categories: CategoryOption[]; value: number | null | undefined }) {
  return (
    <Field label="Danh mục">
      <select name="categoryId" defaultValue={value ?? ""} className={inputCls}>
        <option value="">— Không thuộc danh mục —</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function CategoryForm({ category }: { category?: Category }) {
  const [state, action, pending] = useActionState(saveCategoryAction.bind(null, category?.id ?? null), undefined);
  const e = state?.errors ?? {};
  return (
    <form action={action} className={card}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Tên danh mục *" error={e.name}>
          <input name="name" required defaultValue={category?.name} className={inputCls} placeholder="Cầu thang kính" />
        </Field>
        <Field label="Đường dẫn (slug)" error={e.slug} hint="Bỏ trống để tự tạo từ tên. Ví dụ: cau-thang-kinh → /danh-muc/cau-thang-kinh">
          <input name="slug" defaultValue={category?.slug} className={inputCls} />
        </Field>
      </div>
      <Field label="Mô tả">
        <textarea name="description" rows={4} defaultValue={category?.description} className={inputCls} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nhãn nhỏ trên ảnh" hint="Ví dụ: Phổ biến nhất. Bỏ trống nếu không cần.">
          <input name="tag" defaultValue={category?.tag} className={inputCls} />
        </Field>
        <ToneSelect value={category?.tone} />
      </div>
      <Check name="active" label="Hiển thị trên website" defaultChecked={category?.active ?? true} />
      <FormFooter pending={pending} state={state} cancelHref="/admin/categories" />
    </form>
  );
}

export function ProductForm({ product, categories }: { product?: Product; categories: CategoryOption[] }) {
  const [state, action, pending] = useActionState(saveProductAction.bind(null, product?.id ?? null), undefined);
  const e = state?.errors ?? {};
  return (
    <form action={action} className={card}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Tên mẫu *" error={e.name}>
          <input name="name" required defaultValue={product?.name} className={inputCls} placeholder="Cầu thang kính trụ lửng" />
        </Field>
        <Field label="Mã sản phẩm">
          <input name="sku" defaultValue={product?.sku} className={inputCls} placeholder="CTK-TL02" />
        </Field>
        <CategorySelect categories={categories} value={product?.categoryId} />
        <ToneSelect value={product?.tone} />
      </div>
      <Field label="Mô tả ngắn">
        <textarea name="description" rows={3} defaultValue={product?.description} className={inputCls} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Giá bán (đ)" error={e.price} hint="Bỏ trống = Liên hệ báo giá">
          <input name="price" inputMode="numeric" defaultValue={product?.price ?? ""} className={inputCls} placeholder="800000" />
        </Field>
        <Field label="Giá cũ (đ)" error={e.oldPrice} hint="Hiện gạch ngang. Tuỳ chọn.">
          <input name="oldPrice" inputMode="numeric" defaultValue={product?.oldPrice ?? ""} className={inputCls} />
        </Field>
        <Field label="Đơn vị" hint="Ví dụ: /m, /bộ">
          <input name="unit" defaultValue={product?.unit} className={inputCls} />
        </Field>
      </div>
      <div className="flex flex-wrap gap-6">
        <Check name="featured" label="Hiện ở mục “Bán chạy” trang chủ (nhãn HOT)" defaultChecked={product?.featured} />
        <Check name="active" label="Hiển thị trên website" defaultChecked={product?.active ?? true} />
      </div>
      <FormFooter pending={pending} state={state} cancelHref="/admin/products" />
    </form>
  );
}

export function ProjectForm({ project, categories }: { project?: Project; categories: CategoryOption[] }) {
  const [state, action, pending] = useActionState(saveProjectAction.bind(null, project?.id ?? null), undefined);
  const e = state?.errors ?? {};
  return (
    <form action={action} className={card}>
      <Field label="Tên công trình *" error={e.name} hint="Ví dụ: Cầu thang kính tay vịn gỗ – biệt thự Ecopark, Hưng Yên">
        <input name="name" required defaultValue={project?.name} className={inputCls} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <CategorySelect categories={categories} value={project?.categoryId} />
        <ToneSelect value={project?.tone} />
      </div>
      <Check name="active" label="Hiển thị trên website" defaultChecked={project?.active ?? true} />
      <FormFooter pending={pending} state={state} cancelHref="/admin/projects" />
    </form>
  );
}

export function SettingsForm({ settings }: { settings: Settings }) {
  const [state, action, pending] = useActionState(saveSettingsAction, undefined);
  return (
    <form action={action} className={card}>
      <div className="grid gap-4 sm:grid-cols-2">
        {SETTING_FIELDS.map((f) => (
          <Field key={f.key} label={f.label} hint={f.hint} error={state?.errors?.[f.key]}>
            <input name={f.key} defaultValue={settings[f.key]} className={inputCls} />
          </Field>
        ))}
      </div>
      <FormFooter pending={pending} state={state} cancelHref="/admin" />
    </form>
  );
}
