-- Nội dung mẫu (lấy từ trang demo). Sửa/xoá trong /admin.
INSERT INTO settings (key, value) VALUES
  ('brandMain', 'Nhà Thang'),
  ('brandSub', 'STUDIO'),
  ('phone', '0900 000 000'),
  ('zalo', '0900000000'),
  ('address', '123 Đoài Phương, Hà Nội'),
  ('email', 'lienhe@example.com'),
  ('hours', 'Thứ 2 – Thứ 7: 8:00 – 18:00');

INSERT INTO categories (id, slug, name, description, tag, tone, sort_order) VALUES
  (1, 'cau-thang-kinh', 'Cầu thang kính', 'Sang trọng, trong suốt, giúp không gian rộng và sáng hơn. Kính cường lực 10–12mm, tay vịn gỗ hoặc inox, trụ lửng hoặc không trụ.', 'Phổ biến nhất', 'glass', 0),
  (2, 'cau-thang-go', 'Cầu thang gỗ', 'Ấm cúng, bền chắc, không mối mọt. Mặt bậc, tay vịn, trụ cái từ gỗ lim, gỗ sồi, gỗ xoan đào được xử lý kỹ.', '', 'wood', 1),
  (3, 'cau-thang-inox', 'Cầu thang inox', 'Hiện đại, chống gỉ, dễ vệ sinh. Inox 304 nhập khẩu, đa dạng kiểu: tay vịn gỗ, tay vịn inox, dây cáp, lan can ngoài trời.', '', 'inox', 2),
  (4, 'cau-thang-sat', 'Cầu thang sắt', 'Chi phí hợp lý, họa tiết nghệ thuật độc đáo. Cầu thang xương cá, sắt tay vịn gỗ, lan can sắt mỹ thuật sơn tĩnh điện.', '', 'iron', 3),
  (5, 'nhom-duc', 'Nhôm đúc', 'Nhẹ, bền, không gỉ, bền màu với mưa nắng. Cổng cửa, lan can cầu thang và lan can ban công nhôm đúc phong cách cổ điển.', '', 'alu', 4),
  (6, 'nhom-kinh-kinh-cuong-luc', 'Nhôm kính & kính cường lực', 'Vách tắm kính, mái kính, cửa kính cường lực, kính màu ốp bếp, cửa nhôm hệ – an toàn, chịu lực gấp nhiều lần kính thường.', '', 'window', 5);

INSERT INTO products (category_id, name, sku, price, old_price, unit, tone, featured, sort_order) VALUES
  (4, 'Cầu thang sắt giá rẻ', 'SGR-01', 800000, 1000000, '/m', 'iron', 1, 0),
  (4, 'Cầu thang sắt nghệ thuật MD06', 'CTSNT-06', NULL, NULL, '', 'iron', 1, 1),
  (1, 'Cầu thang kính trụ lửng', 'CTK-TL02', NULL, NULL, '', 'glass', 1, 2),
  (1, 'Cầu thang kính tay vịn gỗ', 'CTK-TVG03', NULL, NULL, '', 'wood', 1, 3);

INSERT INTO projects (category_id, name, tone, sort_order) VALUES
  (1, 'Cầu thang kính tay vịn gỗ – biệt thự Ecopark, Hưng Yên', 'glass', 0),
  (4, 'Cầu thang sắt tay vịn gỗ – Long Biên, Hà Nội', 'iron', 1),
  (3, 'Cầu thang kính chân trụ inox – Hải Dương', 'inox', 2),
  (1, 'Cầu thang kính không trụ – Gia Lâm, Hà Nội', 'glass', 3),
  (2, 'Cầu thang gỗ lim nhà phố – Cầu Giấy, Hà Nội', 'wood', 4),
  (1, 'Cầu thang kính trụ lửng – Vĩnh Phúc', 'glass', 5),
  (5, 'Lan can nhôm đúc ban công – Bắc Ninh', 'alu', 6),
  (1, 'Cầu thang kính chân trụ inox – Hà Nam', 'glass', 7);
