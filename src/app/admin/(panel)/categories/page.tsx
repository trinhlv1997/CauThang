import Link from "next/link";
import AdminList from "@/components/admin/AdminList";
import { PageHead } from "@/components/admin/ui";
import { listCategories } from "@/server/content";

export default async function CategoriesPage() {
  const categories = await listCategories();
  return (
    <>
      <PageHead title="Danh mục">
        <Link href="/admin/categories/new" className="rounded-full bg-brand px-5 py-2 font-bold text-white hover:bg-brand-dark">
          + Thêm danh mục
        </Link>
      </PageHead>
      <AdminList
        type="category"
        base="/admin/categories"
        rows={categories.map((c) => ({ ...c, title: c.name, subtitle: `/danh-muc/${c.slug}`, badges: c.tag ? [c.tag] : [] }))}
      />
    </>
  );
}
