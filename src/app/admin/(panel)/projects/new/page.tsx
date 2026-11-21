import { ProjectForm } from "@/components/admin/Forms";
import { PageHead } from "@/components/admin/ui";
import { listCategories } from "@/server/content";

export default async function NewProjectPage() {
  const categories = await listCategories();
  return (
    <>
      <PageHead title="Thêm công trình" />
      <p className="mb-4 text-sm text-slate-500">Lưu xong sẽ chuyển sang trang sửa để thêm ảnh.</p>
      <ProjectForm categories={categories} />
    </>
  );
}
