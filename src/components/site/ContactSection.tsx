import { phoneDigits } from "@/lib/format";
import type { Category, Settings } from "@/lib/types";
import ContactForm from "./ContactForm";

export default function ContactSection({ settings, categories, defaultInterest }: { settings: Settings; categories: Category[]; defaultInterest?: string }) {
  const tel = phoneDigits(settings.phone);
  return (
    <section className="contact" id="lien-he">
      <div className="container grid">
        <div>
          <h2>Nhận tư vấn &amp; báo giá miễn phí hôm nay</h2>
          <p>Để lại thông tin, chuyên viên sẽ gọi lại trong vòng 15 phút (giờ hành chính) để tư vấn mẫu và hẹn lịch khảo sát.</p>
          <ul className="info-list">
            {settings.address && (
              <li>
                <span className="i">📍</span>
                <div>
                  <b>Địa chỉ</b>
                  <br />
                  {settings.address}
                </div>
              </li>
            )}
            {tel && (
              <li>
                <span className="i">📞</span>
                <div>
                  <b>Hotline 24/7</b>
                  <br />
                  <a href={`tel:${tel}`}>{settings.phone}</a>
                </div>
              </li>
            )}
            {settings.email && (
              <li>
                <span className="i">✉️</span>
                <div>
                  <b>Email</b>
                  <br />
                  <a href={`mailto:${settings.email}`}>{settings.email}</a>
                </div>
              </li>
            )}
            {settings.hours && (
              <li>
                <span className="i">🕗</span>
                <div>
                  <b>Giờ làm việc</b>
                  <br />
                  {settings.hours}
                </div>
              </li>
            )}
          </ul>
        </div>
        <ContactForm interests={categories.map((c) => c.name)} defaultInterest={defaultInterest} />
      </div>
    </section>
  );
}
