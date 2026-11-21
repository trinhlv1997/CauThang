import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/Forms";
import ImageManager from "@/components/admin/ImageManager";
import { DeleteButton } from "@/components/admin/ItemControls";
import { Notice, PageHead } from "@/components/admin/ui";
import { getProduct, listCategories } from "@/server/content";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ created?: string }> };

export default async function EditProductPage({ params, searchParams }: Props) {
  const [product, categories] = await Promise.all([getProduct(Number((await params).id)), listCategories()]);
  if (!product) notFound();
  const { created } = await searchParams;
  return (
    <div className="space-y-6">
      <PageHead title={product.name}>
        <DeleteButton type="product" id={product.id} label={product.name} />
      </PageHead>
      {created && <Notice>Đã tạo mẫu cầu thang. Thêm ảnh bên dưới.</Notice>}
      <ImageManager ownerType="product" ownerId={product.id} images={product.images} />
      <ProductForm product={product} categories={categories} />
    </div>
  );
}
