import Link from "next/link";

export default function NotFound() {
  return (
    <section>
      <div className="container" style={{ textAlign: "center", padding: "40px 0" }}>
        <h1 style={{ color: "var(--primary-dark)", fontSize: "2rem" }}>Không tìm thấy trang</h1>
        <p style={{ color: "var(--muted)", margin: "10px 0 24px" }}>Trang bạn tìm không tồn tại hoặc đã được chuyển đi.</p>
        <Link className="btn btn-primary" href="/">
          Về trang chủ
        </Link>
      </div>
    </section>
  );
}
