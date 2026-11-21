import LeadActions from "@/components/admin/LeadActions";
import { PageHead } from "@/components/admin/ui";
import { formatDateTime } from "@/lib/format";
import { listLeads } from "@/server/content";

export default async function LeadsPage() {
  const leads = await listLeads();
  return (
    <>
      <PageHead title="Khách đăng ký tư vấn" />
      {leads.length === 0 ? (
        <p className="rounded-2xl bg-white p-8 text-center text-slate-500 shadow-sm">Chưa có khách đăng ký.</p>
      ) : (
        <ul className="space-y-3">
          {leads.map((l) => (
            <li key={l.id} className={`rounded-2xl p-4 shadow-sm ${l.status === "new" ? "bg-white" : "bg-slate-50 text-slate-500"}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-bold text-slate-900">
                    {l.status === "new" && <span className="mr-2 rounded bg-accent px-1.5 text-xs">MỚI</span>}
                    {l.name} ·{" "}
                    <a href={`tel:${l.phone}`} className="text-brand">
                      {l.phone}
                    </a>
                  </p>
                  <p className="text-sm">
                    {l.interest} · {formatDateTime(l.createdAt)}
                  </p>
                  {l.message && <p className="mt-2 whitespace-pre-line text-sm">{l.message}</p>}
                </div>
                <LeadActions id={l.id} status={l.status} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
