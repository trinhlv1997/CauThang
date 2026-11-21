"use client";

import { useTransition } from "react";
import { deleteItemAction, moveItemAction, setActiveAction } from "@/app/admin/actions";
import type { OwnerType } from "@/lib/types";

/** Nút lên/xuống + bật/tắt hiển thị trên một dòng danh sách. */
export function RowControls({ type, id, active, first, last }: { type: OwnerType; id: number; active: boolean; first: boolean; last: boolean }) {
  const [pending, start] = useTransition();
  const btn = "rounded px-2 py-1 text-sm hover:bg-slate-100 disabled:opacity-30";
  return (
    <div className={`flex items-center gap-1 ${pending ? "opacity-50" : ""}`}>
      <button type="button" className={btn} disabled={first || pending} onClick={() => start(() => moveItemAction(type, id, -1))} aria-label="Lên">
        ↑
      </button>
      <button type="button" className={btn} disabled={last || pending} onClick={() => start(() => moveItemAction(type, id, 1))} aria-label="Xuống">
        ↓
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => start(() => setActiveAction(type, id, !active))}
        className={`ml-1 rounded-full px-3 py-1 text-xs font-bold ${active ? "bg-green-100 text-green-700" : "bg-slate-200 text-slate-600"}`}
        title="Bấm để bật/tắt hiển thị trên website"
      >
        {active ? "Đang hiện" : "Đang ẩn"}
      </button>
    </div>
  );
}

export function DeleteButton({ type, id, label }: { type: OwnerType; id: number; label: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => confirm(`Xoá "${label}" và toàn bộ ảnh của nó? Không thể hoàn tác.`) && start(() => deleteItemAction(type, id))}
      className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
    >
      {pending ? "Đang xoá..." : "Xoá"}
    </button>
  );
}
