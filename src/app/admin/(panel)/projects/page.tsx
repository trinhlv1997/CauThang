import Link from "next/link";
import AdminList from "@/components/admin/AdminList";
import { PageHead } from "@/components/admin/ui";
import { listCategories, listProjects } from "@/server/content";

export default async function ProjectsPage() {
  const [projects, categories] = await Promise.all([listProjects(), listCategories()]);
  const catName = new Map(categories.map((c) => [c.id, c.name]));
  return (
    <>
      <PageHead title="Công trình">
        <Link href="/admin/projects/new" className="rounded-full bg-brand px-5 py-2 font-bold text-white hover:bg-brand-dark">
          + Thêm công trình
        </Link>
      </PageHead>
      <p className="mb-4 text-sm text-slate-500">Trang chủ hiện 8 công trình đầu tiên đang bật; trang danh mục hiện mọi công trình thuộc danh mục đó.</p>
      <AdminList
        type="project"
        base="/admin/projects"
        rows={projects.map((p) => ({ ...p, title: p.name, subtitle: p.categoryId ? catName.get(p.categoryId) : "Chưa có danh mục" }))}
      />
    </>
  );
}
