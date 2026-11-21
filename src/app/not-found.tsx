import Link from "next/link";

// URL không khớp route nào (ngoài layout website) → trang 404 tối giản.
export default function NotFound() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", textAlign: "center", padding: "80px 16px" }}>
      <h1 style={{ color: "#143650" }}>404 – Không tìm thấy trang</h1>
      <p style={{ margin: "12px 0 24px", color: "#5f6b7a" }}>Trang bạn tìm không tồn tại hoặc đã được chuyển đi.</p>
      <Link href="/" style={{ color: "#1f4e79", fontWeight: 700 }}>
        ← Về trang chủ
      </Link>
    </div>
  );
}
