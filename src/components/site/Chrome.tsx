// Phần khung chung của website: sprite SVG, topbar, header, footer, nút gọi nổi.
import Link from "next/link";
import { phoneDigits } from "@/lib/format";
import type { Category, Settings } from "@/lib/types";
import NavMenu from "./NavMenu";

export function brandName(s: Settings): string {
  const sub = s.brandSub ? s.brandSub.charAt(0).toUpperCase() + s.brandSub.slice(1).toLowerCase() : "";
  return `${s.brandMain} ${sub}`.trim();
}

export function StairsSprite() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <symbol id="stairs" viewBox="0 0 200 130">
        <g fill="currentColor">
          <rect x="10" y="108" width="40" height="14" rx="2" />
          <rect x="45" y="90" width="40" height="14" rx="2" opacity=".92" />
          <rect x="80" y="72" width="40" height="14" rx="2" opacity=".84" />
          <rect x="115" y="54" width="40" height="14" rx="2" opacity=".76" />
          <rect x="150" y="36" width="40" height="14" rx="2" opacity=".68" />
        </g>
        <g stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" opacity=".85">
          <path d="M12 96 L190 24" />
          <path d="M30 96V108M65 78V90M100 60V72M135 42V54M170 24V36" />
        </g>
      </symbol>
    </svg>
  );
}

export const NAV = [
  { href: "/#gioi-thieu", label: "Giới thiệu" },
  { href: "/#san-pham", label: "Sản phẩm" },
  { href: "/#ban-chay", label: "Bán chạy" },
  { href: "/#cong-trinh", label: "Công trình" },
  { href: "/#danh-gia", label: "Khách hàng" },
  { href: "#lien-he", label: "Liên hệ" },
];

export function Header({ settings }: { settings: Settings }) {
  const tel = phoneDigits(settings.phone);
  return (
    <>
      <div className="topbar">
        <div className="container">
          <span>Tư vấn thiết kế &amp; báo giá miễn phí – Khảo sát tận nơi trong 24h</span>
          {settings.phone && (
            <span>
              Hotline 24/7: <strong>{settings.phone}</strong>
            </span>
          )}
        </div>
      </div>
      <header>
        <div className="container nav">
          <Link href="/" className="logo" aria-label={brandName(settings)}>
            <span className="logo-mark">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 20h5v-5h5v-5h5V5h3" />
              </svg>
            </span>
            <span>
              {settings.brandMain}
              <small>{settings.brandSub}</small>
            </span>
          </Link>
          <NavMenu links={NAV}>
            {tel && (
              <a className="hotline" href={`tel:${tel}`}>
                📞 {settings.phone}
              </a>
            )}
            <a className="btn btn-accent" href="#lien-he">
              Nhận báo giá
            </a>
          </NavMenu>
        </div>
      </header>
    </>
  );
}

export function Footer({ settings, categories }: { settings: Settings; categories: Category[] }) {
  const name = brandName(settings);
  const half = Math.ceil(categories.length / 2);
  const list = (cats: Category[]) => (
    <ul>
      {cats.map((c) => (
        <li key={c.id}>
          <Link href={`/danh-muc/${c.slug}`}>{c.name}</Link>
        </li>
      ))}
    </ul>
  );
  return (
    <footer>
      <div className="container">
        <div className="foot">
          <div>
            <h4>{`${settings.brandMain} ${settings.brandSub}`.trim().toUpperCase()}</h4>
            <p>Thiết kế – sản xuất – thi công cầu thang, lan can, cổng cửa chất lượng cao.</p>
            <p style={{ marginTop: 10 }}>
              {settings.address && <>Địa chỉ: {settings.address}<br /></>}
              {settings.phone && <>Điện thoại: {settings.phone}</>}
            </p>
          </div>
          <div>
            <h4>Cầu thang</h4>
            {list(categories.slice(0, half))}
          </div>
          <div>
            <h4>Sản phẩm khác</h4>
            {list(categories.slice(half))}
          </div>
          <div>
            <h4>Liên kết</h4>
            <ul>
              {NAV.filter((n) => n.label !== "Sản phẩm" && n.label !== "Bán chạy").map((n) => (
                <li key={n.href}>
                  <a href={n.href}>{n.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="copy">
          © {new Date().getFullYear()} {name}. Bảo lưu mọi quyền.
        </div>
      </div>
    </footer>
  );
}

export function FloatButtons({ settings }: { settings: Settings }) {
  const tel = phoneDigits(settings.phone);
  const zalo = phoneDigits(settings.zalo) || tel;
  if (!tel && !zalo) return null;
  return (
    <div className="float">
      {zalo && (
        <a className="zalo" href={`https://zalo.me/${zalo}`} target="_blank" rel="noopener noreferrer" aria-label="Chat Zalo">
          Zalo
        </a>
      )}
      {tel && (
        <a className="call" href={`tel:${tel}`} aria-label="Gọi hotline">
          📞
        </a>
      )}
    </div>
  );
}
