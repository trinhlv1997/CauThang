# CauThang

Website giới thiệu dịch vụ thiết kế – thi công cầu thang (kính, gỗ, inox, sắt, nhôm đúc), kèm trang quản trị để sửa nội dung và ảnh. Chạy trên Cloudflare Workers gói Free.

- **Website:** trang chủ (giao diện theo bản demo `../demo/index.html`) và trang từng danh mục `/danh-muc/<slug>` có thư viện ảnh, mẫu cầu thang và công trình.
- **Quản trị `/admin`:** danh mục, mẫu cầu thang, công trình (thêm/sửa/xoá, sắp xếp, ẩn/hiện, nhiều ảnh mỗi mục), khách đăng ký tư vấn, thông tin chung (tên, hotline, Zalo, địa chỉ...).

## Công nghệ

| Thành phần | Công nghệ |
| --- | --- |
| Web | Next.js 15 (App Router), React 19, TypeScript |
| CSS | CSS thuần của bản demo cho website (`src/app/(site)/site.css`), Tailwind v4 chỉ cho admin |
| Dữ liệu | Cloudflare D1 (SQLite) |
| Ảnh | Cloudflare KV |
| Triển khai | Cloudflare Workers qua `@opennextjs/cloudflare` |

## Chạy trên máy

Cần Node >= 22.12.

```bash
npm install
cp .dev.vars.example .dev.vars              # đặt ADMIN_PASSWORD và AUTH_SECRET
npx wrangler d1 migrations apply DB --local # tạo bảng + dữ liệu mẫu
npm run dev                                 # http://localhost:3000, admin: /admin
```

`npm run preview` build và chạy trên workerd (giống môi trường Cloudflare thật) tại http://localhost:8787.

## Tối ưu và cache ảnh

1. **Nén trước khi tải lên:** trình duyệt của admin tự thu ảnh về 2 bản WebP (1600px và 640px, thường 100–300 KB) nên ảnh 5 MB từ điện thoại không đi qua mạng.
2. **`srcset`:** khách trên điện thoại tải bản 640px, màn hình lớn mới tải bản 1600px. Ảnh dưới màn hình đầu tiên được tải trễ (`loading="lazy"`), và `width`/`height` cố định nên trang không bị nhảy khi ảnh hiện ra.
3. **Cache 3 lớp cho `/img/<id>/<size>`:**
   - Trình duyệt: `Cache-Control: public, max-age=31536000, immutable` cùng `ETag`/304. Mỗi ảnh có id ngẫu nhiên và nội dung không bao giờ đổi, vì thay ảnh nghĩa là tải lên id mới, nên khách quay lại sẽ không tải lại.
   - Edge Cloudflare (Cache API): lần đọc sau ở cùng data center không đụng tới KV. **Lớp này chỉ hoạt động khi dùng tên miền riêng**; trên `*.workers.dev` Cache API không lưu gì.
   - KV `cacheTtl` 1 ngày.
4. **Trang HTML:** mỗi trang chỉ gọi D1 1–2 lượt (gom bằng `db.batch`). Website dùng font hệ thống nên không tải web font.

## Triển khai lên Cloudflare (gói Free)

```bash
npx wrangler login

# 1. Tạo D1 và KV, rồi chép id in ra vào wrangler.jsonc (database_id và id của MEDIA)
npx wrangler d1 create cau-thang-db
npx wrangler kv namespace create MEDIA
npm run cf-typegen

# 2. Tạo bảng + dữ liệu mẫu trên D1 thật
npx wrangler d1 migrations apply DB --remote

# 3. Đặt mật khẩu admin và khoá ký phiên đăng nhập
npx wrangler secret put ADMIN_PASSWORD
openssl rand -hex 32 | npx wrangler secret put AUTH_SECRET

# 4. Build + deploy
npm run deploy
```

Sau khi deploy, trang chạy tại `https://cau-thang.<tài-khoản>.workers.dev`. Để Cache API (lớp cache ở edge) có tác dụng, gắn tên miền riêng trong Cloudflare Dashboard: Workers & Pages → cau-thang → Settings → Domains & Routes.

Nếu muốn tự deploy khi push code: đẩy repo lên GitHub rồi kết nối trong Workers & Pages → cau-thang → Settings → Builds, với build command `npx opennextjs-cloudflare build` và deploy command `npx opennextjs-cloudflare deploy`.

### Giới hạn gói Free cần biết

| Tài nguyên | Giới hạn | Ước tính với site này |
| --- | --- | --- |
| Worker | 100.000 request/ngày, ~10ms CPU/request | Đủ cho site giới thiệu. Ảnh đã cache ở trình duyệt không tính request. |
| KV | 1.000 lượt ghi/ngày, 1 GB | Mỗi ảnh tải lên tốn 2 lượt ghi, tức khoảng 500 ảnh/ngày. 1 GB chứa khoảng 4.000–5.000 ảnh. |
| D1 | 5 triệu lượt đọc/ngày, 5 GB | Dư nhiều. |

## Cấu trúc thư mục

```
migrations/            Schema D1 + dữ liệu mẫu
src/app/(site)/        Website: trang chủ, /danh-muc/[slug], form tư vấn (actions.ts), site.css
src/app/admin/         Trang quản trị (login + (panel)/...), actions.ts, admin.css
src/app/img/           Phục vụ ảnh từ KV kèm cache
src/app/api/admin/     Nhận ảnh tải lên
src/components/site/   Header/Footer, thẻ sản phẩm, thư viện ảnh, lightbox, form liên hệ
src/components/admin/  Form, danh sách, quản lý ảnh
src/server/            Truy cập D1/KV, đăng nhập
src/data/site.ts       Nội dung tĩnh (lý do chọn, quy trình, đánh giá, FAQ...)
```
