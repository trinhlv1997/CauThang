import Link from "next/link";
import AdminList from "@/components/admin/AdminList";
import { PageHead } from "@/components/admin/ui";
import { formatPrice } from "@/lib/format";
import { listCategories, listProducts } from "@/server/content";

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([listProducts(), listCategories()]);
  const catName = new Map(categories.map((c) => [c.id, c.name]));
  return (
    <>
      <PageHead title="Mẫu cầu thang">
        <Link href="/admin/products/new" className="rounded-full bg-brand px-5 py-2 font-bold text-white hover:bg-brand-dark">
          + Thêm mẫu
        </Link>
      </PageHead>
      <AdminList
        type="product"
        base="/admin/products"
        rows={products.map((p) => ({
          ...p,
          title: p.name,
          subtitle: [p.categoryId ? catName.get(p.categoryId) : "Chưa có danh mục", p.price !== null ? formatPrice(p.price) + p.unit : "Liên hệ"].join(" · "),
          badges: p.featured ? ["Bán chạy"] : [],
        }))}
      />
    </>
  );
}
