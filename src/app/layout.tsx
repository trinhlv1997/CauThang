import type { Viewport } from "next";

// Root layout chỉ có khung HTML. Website dùng app/(site)/layout.tsx (+ site.css),
// trang quản trị dùng app/admin/layout.tsx (+ Tailwind trong admin.css).
// Không dùng web font: font hệ thống hiển thị ngay, không tốn thêm request.
export const viewport: Viewport = { themeColor: "#143650" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
