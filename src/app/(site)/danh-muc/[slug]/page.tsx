import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CategoryCard, ProductCard } from "@/components/site/Cards";
import ContactSection from "@/components/site/ContactSection";
import Gallery from "@/components/site/Gallery";
import ProjectGrid from "@/components/site/ProjectGrid";
import { imageSrc } from "@/lib/images";
import { getCategoryContent, getSiteBase } from "@/server/content";

type Props = { params: Promise<{ slug: string }> };

async function findCategory(slug: string) {
  const { settings, categories } = await getSiteBase();
  return { settings, categories, category: categories.find((c) => c.slug === slug) };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await findCategory((await params).slug);
  if (!category) return {};
  const cover = category.images[0];
  return {
    title: category.name,
    description: category.description.slice(0, 160),
    openGraph: cover ? { images: [{ url: imageSrc(cover.id, "lg"), width: cover.width, height: cover.height }] } : undefined,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const { settings, categories, category } = await findCategory(slug);
  if (!category) notFound();
  const { products, projects } = await getCategoryContent(category.id);
  const others = categories.filter((c) => c.id !== category.id).slice(0, 3);

  return (
    <>
      <section className="banner">
        <div className="container">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/">Trang chủ</Link> › <Link href="/#san-pham">Sản phẩm</Link> › {category.name}
          </nav>
          <h1>{category.name}</h1>
          {category.description && <p>{category.description}</p>}
          <div className="actions">
            <a className="btn btn-accent" href="#lien-he">
              Nhận báo giá {category.name.toLowerCase()}
            </a>
          </div>
        </div>
      </section>

      {category.images.length > 0 && (
        <section>
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Thư viện ảnh</span>
              <h2>Mẫu {category.name.toLowerCase()} đẹp</h2>
            </div>
            <Gallery images={category.images} caption={category.name} />
          </div>
        </section>
      )}

      <section className={category.images.length > 0 ? "soft" : undefined}>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Mẫu cầu thang</span>
            <h2>Các mẫu {category.name.toLowerCase()}</h2>
            <p>Giá tham khảo, báo giá chính xác sau khi khảo sát thực tế.</p>
          </div>
          {products.length > 0 ? (
            <div className="products">
              {products.map((p) => (
                <ProductCard key={p.id} p={p} showDesc />
              ))}
            </div>
          ) : (
            <p className="empty">Đang cập nhật mẫu. Liên hệ để được tư vấn và gửi mẫu phù hợp.</p>
          )}
        </div>
      </section>

      {projects.length > 0 && (
        <section className={category.images.length > 0 ? undefined : "soft"}>
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Công trình thực tế</span>
              <h2>Công trình {category.name.toLowerCase()} đã thi công</h2>
            </div>
            <ProjectGrid projects={projects} />
          </div>
        </section>
      )}

      {others.length > 0 && (
        <section className="soft">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Xem thêm</span>
              <h2>Danh mục khác</h2>
            </div>
            <div className="cards">
              {others.map((c) => (
                <CategoryCard key={c.id} c={c} />
              ))}
            </div>
          </div>
        </section>
      )}

      <ContactSection settings={settings} categories={categories} defaultInterest={category.name} />
    </>
  );
}
