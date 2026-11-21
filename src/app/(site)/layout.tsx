import type { Metadata } from "next";
import { brandName, FloatButtons, Footer, Header, StairsSprite } from "@/components/site/Chrome";
import { getSiteBase } from "@/server/content";
import "./site.css";

// Đọc D1 mỗi request để sửa trong /admin hiện ngay (không dùng ISR — gói free không có cache ghi được).
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSiteBase();
  const brand = brandName(settings);
  return {
    title: { default: `${brand} - Thiết kế & thi công cầu thang kính, gỗ, inox, sắt`, template: `%s | ${brand}` },
    description: `${brand} chuyên thiết kế, sản xuất và thi công cầu thang kính, cầu thang gỗ, inox, sắt nghệ thuật, lan can nhôm đúc. Tư vấn miễn phí, bảo hành dài hạn.`,
  };
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { settings, categories } = await getSiteBase();
  return (
    <>
      <StairsSprite />
      <Header settings={settings} />
      <main id="top">{children}</main>
      <Footer settings={settings} categories={categories} />
      <FloatButtons settings={settings} />
    </>
  );
}
