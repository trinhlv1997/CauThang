-- Thông tin chung của website (tên thương hiệu, hotline, địa chỉ...). Dạng key/value.
CREATE TABLE settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Danh mục cầu thang (kính, gỗ, inox...). tone = màu nền minh hoạ khi chưa có ảnh.
CREATE TABLE categories (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  slug        TEXT NOT NULL UNIQUE,
  name        TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  tag         TEXT NOT NULL DEFAULT '',
  tone        TEXT NOT NULL DEFAULT 'glass',
  sort_order  INTEGER NOT NULL DEFAULT 0,
  active      INTEGER NOT NULL DEFAULT 1,
  created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

-- Mẫu cầu thang. price NULL = "Liên hệ báo giá". featured = hiện ở mục "Bán chạy" trang chủ.
CREATE TABLE products (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  name        TEXT NOT NULL,
  sku         TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  price       INTEGER CHECK (price IS NULL OR price >= 0),
  old_price   INTEGER CHECK (old_price IS NULL OR old_price >= 0),
  unit        TEXT NOT NULL DEFAULT '',
  tone        TEXT NOT NULL DEFAULT 'glass',
  featured    INTEGER NOT NULL DEFAULT 0,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  active      INTEGER NOT NULL DEFAULT 1,
  created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX idx_products_category ON products(category_id, sort_order);

-- Công trình đã thi công.
CREATE TABLE projects (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  name        TEXT NOT NULL,
  tone        TEXT NOT NULL DEFAULT 'glass',
  sort_order  INTEGER NOT NULL DEFAULT 0,
  active      INTEGER NOT NULL DEFAULT 1,
  created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX idx_projects_category ON projects(category_id, sort_order);

-- Ảnh của danh mục / sản phẩm / công trình. File nằm trong KV (binding MEDIA) ở key
-- img/<id>/lg và img/<id>/sm; bảng này chỉ giữ metadata + thứ tự. sort_order nhỏ nhất = ảnh bìa.
-- Không có FK (owner đa hình) → khi xoá owner phải tự xoá ảnh (server/images.ts).
CREATE TABLE images (
  id          TEXT PRIMARY KEY,
  owner_type  TEXT NOT NULL CHECK (owner_type IN ('category', 'product', 'project')),
  owner_id    INTEGER NOT NULL,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  width       INTEGER NOT NULL,
  height      INTEGER NOT NULL,
  bytes       INTEGER NOT NULL,
  mime        TEXT NOT NULL,
  created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX idx_images_owner ON images(owner_type, owner_id, sort_order);

-- Yêu cầu tư vấn từ form liên hệ.
CREATE TABLE leads (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  phone       TEXT NOT NULL,
  interest    TEXT NOT NULL DEFAULT '',
  message     TEXT NOT NULL DEFAULT '',
  status      TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'done')),
  created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX idx_leads_status ON leads(status, created_at);
