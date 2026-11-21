import { CategoryCard, ProductCard } from "@/components/site/Cards";
import { brandName } from "@/components/site/Chrome";
import ContactSection from "@/components/site/ContactSection";
import ProjectGrid from "@/components/site/ProjectGrid";
import { aboutChecks, faqs, heroPoints, news, partners, reasons, services, stats, steps, testimonials } from "@/data/site";
import { getHomeData, getSiteBase } from "@/server/content";

function SectionHead({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <div className="section-head">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  );
}

export default async function HomePage() {
  const [{ settings, categories }, { products, projects }] = await Promise.all([getSiteBase(), getHomeData()]);
  const brand = brandName(settings);

  return (
    <>
      <section className="hero">
        <div className="container grid">
          <div>
            <h1>
              Cầu thang đẹp – <em>bền vững</em>
              <br />
              cho mọi ngôi nhà
            </h1>
            <p className="lead">
              Thiết kế, sản xuất và thi công trọn gói cầu thang kính, gỗ, inox, sắt nghệ thuật và lan can nhôm đúc. Hơn 10 năm kinh nghiệm, hàng trăm
              công trình trên toàn miền Bắc.
            </p>
            <div className="actions">
              <a className="btn btn-accent" href="#lien-he">
                Nhận tư vấn miễn phí
              </a>
              <a className="btn btn-ghost" href="#san-pham">
                Xem mẫu cầu thang
              </a>
            </div>
            <ul className="hero-points">
              {heroPoints.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
          <div className="hero-art" aria-hidden="true">
            <svg viewBox="0 0 400 300" fill="none">
              <rect width="400" height="300" rx="16" fill="rgba(255,255,255,.06)" />
              <rect x="30" y="30" width="340" height="240" rx="10" fill="rgba(255,255,255,.08)" />
              <g fill="#e8a33d">
                <rect x="60" y="226" width="80" height="18" rx="3" />
                <rect x="120" y="198" width="80" height="18" rx="3" opacity=".92" />
                <rect x="180" y="170" width="80" height="18" rx="3" opacity=".84" />
                <rect x="240" y="142" width="80" height="18" rx="3" opacity=".76" />
                <rect x="300" y="114" width="60" height="18" rx="3" opacity=".68" />
              </g>
              <g fill="rgba(180,220,245,.45)" stroke="#bfe3f7" strokeWidth="2">
                <path d="M70 224 L70 190 L130 164 L130 196 Z" />
                <path d="M130 196 L130 162 L190 136 L190 168 Z" />
                <path d="M190 168 L190 134 L250 108 L250 140 Z" />
                <path d="M250 140 L250 106 L310 80 L310 112 Z" />
              </g>
              <path d="M66 190 L312 80" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
              <circle cx="330" cy="62" r="14" fill="#e8a33d" opacity=".9" />
            </svg>
          </div>
        </div>
      </section>

      <section className="stats">
        <div className="container">
          <div className="box">
            {stats.map((s) => (
              <div className="stat" key={s.label}>
                <b>{s.value}</b>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about" id="gioi-thieu">
        <div className="container grid">
          <div>
            <span className="eyebrow">Giới thiệu về chúng tôi</span>
            <h2>Đơn vị tư vấn – thi công cầu thang uy tín tại Hà Nội</h2>
            <p>
              <b>{brand}</b> là đơn vị chuyên thiết kế, sản xuất và lắp đặt cầu thang, lan can, cổng cửa cho nhà phố, biệt thự, căn hộ duplex và công
              trình thương mại.
            </p>
            <p>
              Chúng tôi giúp chủ nhà, kiến trúc sư và đơn vị thi công chọn đúng phương án: từ kiểu dáng, vật liệu, kích thước tiêu chuẩn đến phương
              pháp thi công phù hợp với từng không gian.
            </p>
            <ul className="checks">
              {aboutChecks.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <a className="btn btn-primary" href="#lien-he">
              Đặt lịch khảo sát
            </a>
          </div>
          <div className="video-ph" role="img" aria-label="Video giới thiệu">
            <svg className="bg" viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice">
              <use href="#stairs" x="60" y="40" width="300" height="195" style={{ color: "#7ea4c4" }} />
            </svg>
            <div className="play" />
          </div>
        </div>
      </section>

      <section className="soft" id="san-pham">
        <div className="container">
          <SectionHead
            eyebrow="Danh mục sản phẩm"
            title="Giải pháp cầu thang cho mọi phong cách"
            text="Chọn vật liệu phù hợp với ngân sách, không gian và gu thẩm mỹ của gia đình bạn."
          />
          <div className="cards">
            {categories.map((c, i) => (
              <CategoryCard key={c.id} c={c} eager={i < 3} />
            ))}
          </div>
        </div>
      </section>

      {products.length > 0 && (
        <section id="ban-chay">
          <div className="container">
            <SectionHead
              eyebrow="Cầu thang bán chạy"
              title="Mẫu được khách hàng lựa chọn nhiều nhất"
              text="Giá tham khảo theo mét dài, chưa gồm khảo sát và vận chuyển. Báo giá chính xác sau khi đo đạc thực tế."
            />
            <div className="products">
              {products.map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="soft">
        <div className="container">
          <SectionHead eyebrow="Vì sao chọn chúng tôi" title="Cam kết chất lượng trong từng chi tiết" />
          <div className="why">
            {reasons.map((r) => (
              <div className="why-item" key={r.title}>
                <div className="ico">{r.icon}</div>
                <h3>{r.title}</h3>
                <p>{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <SectionHead eyebrow="Quy trình làm việc" title="5 bước đơn giản từ tư vấn đến bàn giao" />
          <div className="steps">
            {steps.map((s) => (
              <div className="step" key={s.title}>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {projects.length > 0 && (
        <section className="soft" id="cong-trinh">
          <div className="container">
            <SectionHead eyebrow="Công trình tiêu biểu" title="Những công trình chúng tôi đã thực hiện" />
            <ProjectGrid projects={projects} />
          </div>
        </section>
      )}

      <section id="danh-gia">
        <div className="container">
          <SectionHead eyebrow="Ý kiến khách hàng" title="Khách hàng nói gì về chúng tôi" />
          <div className="quotes">
            {testimonials.map((t) => {
              const parts = t.name.trim().split(/\s+/);
              return (
                <div className="quote" key={t.name}>
                  <div className="stars">★★★★★</div>
                  <p>{t.text}</p>
                  <div className="who">
                    <div className="avatar">{parts[parts.length - 1].charAt(0).toUpperCase()}</div>
                    <div>
                      <b>{t.name}</b>
                      <span>{t.role}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="soft">
        <div className="container two-col">
          <div>
            <h2>Dịch vụ</h2>
            {services.map((s) => (
              <div className="list-item" key={s.title}>
                <div className="mini" style={{ background: s.bg }}>
                  {s.icon}
                </div>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div>
            <h2>Tin tức &amp; kiến thức</h2>
            {news.map((n) => (
              <div className="list-item" key={n.title}>
                <div className="mini" style={{ background: n.bg }}>
                  📰
                </div>
                <div>
                  <h3>{n.title}</h3>
                  <p>{n.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <SectionHead eyebrow="Câu hỏi thường gặp" title="Giải đáp nhanh trước khi bạn quyết định" />
          <div className="faq">
            {faqs.map((f, i) => (
              <details key={f.q} open={i === 0}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="soft" style={{ padding: "44px 0" }}>
        <div className="container">
          <div className="section-head" style={{ marginBottom: 22 }}>
            <h2 style={{ fontSize: "1.3rem" }}>Đối tác &amp; thương hiệu đồng hành</h2>
          </div>
          <div className="partners">
            {partners.map((p) => (
              <span className="partner" key={p}>
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      <ContactSection settings={settings} categories={categories} />
    </>
  );
}
