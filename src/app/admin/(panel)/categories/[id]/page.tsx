import { notFound } from "next/navigation";
import { CategoryForm } from "@/components/admin/Forms";
import ImageManager from "@/components/admin/ImageManager";
import { DeleteButton } from "@/components/admin/ItemControls";
import { Notice, PageHead } from "@/components/admin/ui";
import { getCategory } from "@/server/content";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ created?: string }> };

export default async function EditCategoryPage({ params, searchParams }: Props) {
  const category = await getCategory(Number((await params).id));
  if (!category) notFound();
  const { created } = await searchParams;
  return (
    <div className="space-y-6">
      <PageHead title={category.name}>
        <div className="flex gap-2">
          <a href={`/danh-muc/${category.slug}`} target="_blank" className="rounded-full px-4 py-2 text-sm font-semibold text-brand hover:bg-brand-50">
            Xem trên web ↗
          </a>
          <DeleteButton type="category" id={category.id} label={category.name} />
        </div>
      </PageHead>
      {created && <Notice>Đã tạo danh mục. Thêm ảnh bên dưới — ảnh bìa hiện ở trang chủ, các ảnh còn lại hiện trong thư viện ảnh của danh mục.</Notice>}
      <ImageManager ownerType="category" ownerId={category.id} images={category.images} />
      <CategoryForm category={category} />
    </div>
  );
}
