"use client";

import { useTransition } from "react";
import { deleteLeadAction, leadStatusAction } from "@/app/admin/actions";

export default function LeadActions({ id, status }: { id: number; status: "new" | "done" }) {
  const [pending, start] = useTransition();
  return (
    <div className={`flex gap-2 ${pending ? "opacity-50" : ""}`}>
      <button
        type="button"
        disabled={pending}
        onClick={() => start(() => leadStatusAction(id, status === "new" ? "done" : "new"))}
        className={`rounded-full px-3 py-1 text-xs font-bold ${status === "new" ? "bg-brand text-white hover:bg-brand-dark" : "bg-slate-200 text-slate-600"}`}
      >
        {status === "new" ? "✓ Đã liên hệ" : "↺ Đánh dấu mới"}
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => confirm("Xoá yêu cầu này?") && start(() => deleteLeadAction(id))}
        className="rounded-full px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
      >
        Xoá
      </button>
    </div>
  );
}
