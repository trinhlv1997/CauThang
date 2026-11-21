import Link from "next/link";
import type { Img, OwnerType, Tone } from "@/lib/types";
import { RowControls } from "./ItemControls";
import { Thumb } from "./ui";

export interface ListRow {
  id: number;
  title: string;
  subtitle?: string;
  badges?: string[];
  images: Img[];
  tone: Tone;
  active: boolean;
}

/** Danh sách danh mục / sản phẩm / công trình trong admin: ảnh bìa, tên, sắp xếp, bật/tắt. */
export default function AdminList({ type, base, rows }: { type: OwnerType; base: string; rows: ListRow[] }) {
  if (rows.length === 0) return <p className="rounded-2xl bg-white p-8 text-center text-slate-500 shadow-sm">Chưa có mục nào.</p>;
  return (
    <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl bg-white shadow-sm">
      {rows.map((r, i) => (
        <li key={r.id} className={`flex flex-wrap items-center gap-4 p-3 sm:flex-nowrap ${r.active ? "" : "bg-slate-50"}`}>
          <Link href={`${base}/${r.id}`} className="flex min-w-0 flex-1 items-center gap-4 hover:text-brand">
            <Thumb images={r.images} tone={r.tone} />
            <span className="min-w-0">
              <span className={`block truncate font-semibold ${r.active ? "" : "text-slate-500"}`}>{r.title}</span>
              <span className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
                {r.subtitle && <span>{r.subtitle}</span>}
                <span>📷 {r.images.length} ảnh</span>
                {r.badges?.map((b) => (
                  <span key={b} className="rounded bg-accent/20 px-1.5 font-semibold text-amber-800">
                    {b}
                  </span>
                ))}
              </span>
            </span>
          </Link>
          <RowControls type={type} id={r.id} active={r.active} first={i === 0} last={i === rows.length - 1} />
          <Link href={`${base}/${r.id}`} className="rounded-full bg-brand-50 px-4 py-1.5 text-sm font-semibold text-brand hover:bg-brand hover:text-white">
            Sửa
          </Link>
        </li>
      ))}
    </ul>
  );
}
