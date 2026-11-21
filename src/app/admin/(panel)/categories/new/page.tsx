import { CategoryForm } from "@/components/admin/Forms";
import { PageHead } from "@/components/admin/ui";

export default function NewCategoryPage() {
  return (
    <>
      <PageHead title="Thêm danh mục" />
      <p className="mb-4 text-sm text-slate-500">Lưu xong sẽ chuyển sang trang sửa để thêm ảnh.</p>
      <CategoryForm />
    </>
  );
}
