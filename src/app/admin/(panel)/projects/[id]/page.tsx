import { notFound } from "next/navigation";
import { ProjectForm } from "@/components/admin/Forms";
import ImageManager from "@/components/admin/ImageManager";
import { DeleteButton } from "@/components/admin/ItemControls";
import { Notice, PageHead } from "@/components/admin/ui";
import { getProject, listCategories } from "@/server/content";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ created?: string }> };

export default async function EditProjectPage({ params, searchParams }: Props) {
  const [project, categories] = await Promise.all([getProject(Number((await params).id)), listCategories()]);
  if (!project) notFound();
  const { created } = await searchParams;
  return (
    <div className="space-y-6">
      <PageHead title={project.name}>
        <DeleteButton type="project" id={project.id} label={project.name} />
      </PageHead>
      {created && <Notice>Đã tạo công trình. Thêm ảnh bên dưới — khách bấm vào công trình sẽ xem được cả bộ ảnh.</Notice>}
      <ImageManager ownerType="project" ownerId={project.id} images={project.images} />
      <ProjectForm project={project} categories={categories} />
    </div>
  );
}
