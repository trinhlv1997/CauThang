// Thành phần giao diện dùng chung trong admin (không dùng hook → dùng được ở cả server và client component).
import Link from "next/link";
import { imageSrc } from "@/lib/images";
import { TONES, type Img, type Tone } from "@/lib/types";

export const inputCls = "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand focus:ring-2 focus:ring-brand/15";

export function Field({ label, error, hint, children }: { label: string; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm font-medium">
      {label}
      {children}
      {error ? <span className="mt-1 block text-xs text-red-600">{error}</span> : hint && <span className="mt-1 block text-xs font-normal text-slate-500">{hint}</span>}
    </label>
  );
}

export function Check({ name, label, defaultChecked }: { name: string; label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center gap-2 text-sm font-medium">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="h-4 w-4 accent-[var(--color-brand)]" />
      {label}
    </label>
  );
}

export function ToneSelect({ value }: { value?: Tone }) {
  return (
    <Field label="Màu minh hoạ khi chưa có ảnh">
      <select name="tone" defaultValue={value ?? "glass"} className={inputCls}>
        {TONES.map((t) => (
          <option key={t.id} value={t.id}>
            {t.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function FormFooter({ pending, state, cancelHref }: { pending: boolean; state?: { error?: string; message?: string }; cancelHref: string }) {
  return (
    <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
      <button disabled={pending} className="rounded-full bg-brand px-6 py-2.5 font-bold text-white hover:bg-brand-dark disabled:opacity-60">
        {pending ? "Đang lưu..." : "Lưu"}
      </button>
      <Link href={cancelHref} className="rounded-full px-4 py-2.5 font-semibold text-slate-600 hover:bg-slate-100">
        Quay lại
      </Link>
      {state?.error && <span className="text-sm text-red-600">{state.error}</span>}
      {state?.message && <span className="text-sm font-semibold text-green-600">✓ {state.message}</span>}
    </div>
  );
}

const TONE_BG: Record<Tone, string> = {
  glass: "#a9d3ea",
  wood: "#d7b48a",
  inox: "#bcc6d0",
  iron: "#9aa1ab",
  alu: "#e0c08a",
  window: "#a8d4c0",
};

export function Thumb({ images, tone, className = "h-14 w-20" }: { images: Img[]; tone: Tone; className?: string }) {
  const cover = images[0];
  return cover ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={imageSrc(cover.id, "sm")} alt="" loading="lazy" className={`${className} shrink-0 rounded-lg bg-slate-100 object-cover`} />
  ) : (
    <span className={`${className} flex shrink-0 items-center justify-center rounded-lg text-xl`} style={{ background: TONE_BG[tone] }}>
      🪜
    </span>
  );
}

export function PageHead({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h1 className="text-2xl font-extrabold">{title}</h1>
      {children}
    </div>
  );
}

export function Notice({ children }: { children: React.ReactNode }) {
  return <p className="mb-4 rounded-xl bg-green-50 p-3 text-sm text-green-800">{children}</p>;
}
