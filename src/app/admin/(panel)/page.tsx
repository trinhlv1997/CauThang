import Link from "next/link";
import { PageHead } from "@/components/admin/ui";
import { formatDateTime } from "@/lib/format";
import { getDashboardCounts, listLeads } from "@/server/content";

export default async function Dashboard() {
  const [c, leads] = await Promise.all([getDashboardCounts(), listLeads(5)]);
  const cards = [
    { href: "/admin/leads", label: "Khách chờ liên hệ", value: c.newLeads, hot: c.newLeads > 0 },
    { href: "/admin/categories", label: "Danh mục", value: c.categories },
    { href: "/admin/products", label: "Mẫu cầu thang", value: c.products },
    { href: "/admin/projects", label: "Công trình", value: c.projects },
  ];
  return (
    <>
      <PageHead title="Tổng quan" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((x) => (
          <Link key={x.href} href={x.href} className={`rounded-2xl p-5 shadow-sm transition hover:-translate-y-0.5 ${x.hot ? "bg-accent text-black" : "bg-white"}`}>
            <b className="block text-3xl">{x.value}</b>
            <span className="text-sm">{x.label}</span>
          </Link>
        ))}
      </div>
      <p className="mt-4 text-sm text-slate-500">
        Đã lưu {c.images} ảnh ({(c.bytes / 1024 / 1024).toFixed(1)} MB). Mỗi ảnh tải lên tốn 2 lượt ghi KV — gói Free cho 1.000 lượt/ngày (≈ 500 ảnh/ngày).
      </p>
      <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-bold">Khách đăng ký gần đây</h2>
          <Link href="/admin/leads" className="text-sm font-semibold text-brand">
            Xem tất cả →
          </Link>
        </div>
        {leads.length === 0 ? (
          <p className="text-sm text-slate-500">Chưa có khách đăng ký.</p>
        ) : (
          <ul className="divide-y divide-slate-100 text-sm">
            {leads.map((l) => (
              <li key={l.id} className="flex flex-wrap justify-between gap-2 py-2">
                <span>
                  <b>{l.name}</b> · <a href={`tel:${l.phone}`} className="text-brand">{l.phone}</a> · {l.interest}
                </span>
                <span className="text-slate-500">
                  {l.status === "new" && <span className="mr-2 font-bold text-amber-600">MỚI</span>}
                  {formatDateTime(l.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
