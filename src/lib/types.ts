// Màu nền minh hoạ (SVG cầu thang) khi chưa có ảnh.
export const TONES = [
  { id: "glass", label: "Kính (xanh nhạt)" },
  { id: "wood", label: "Gỗ (nâu)" },
  { id: "inox", label: "Inox (bạc)" },
  { id: "iron", label: "Sắt (xám)" },
  { id: "alu", label: "Nhôm đúc (vàng)" },
  { id: "window", label: "Nhôm kính (xanh lá)" },
] as const;
export type Tone = (typeof TONES)[number]["id"];
export const isTone = (v: string): v is Tone => TONES.some((t) => t.id === v);

export const OWNER_TYPES = ["category", "product", "project"] as const;
export type OwnerType = (typeof OWNER_TYPES)[number];
export const isOwnerType = (v: string): v is OwnerType => (OWNER_TYPES as readonly string[]).includes(v);

export interface Img {
  id: string;
  width: number;
  height: number;
}

export interface Category {
  id: number;
  slug: string;
  name: string;
  description: string;
  tag: string;
  tone: Tone;
  sortOrder: number;
  active: boolean;
  images: Img[];
}

export interface Product {
  id: number;
  categoryId: number | null;
  name: string;
  sku: string;
  description: string;
  price: number | null; // null = "Liên hệ báo giá"
  oldPrice: number | null;
  unit: string;
  tone: Tone;
  featured: boolean;
  sortOrder: number;
  active: boolean;
  images: Img[];
}

export interface Project {
  id: number;
  categoryId: number | null;
  name: string;
  tone: Tone;
  sortOrder: number;
  active: boolean;
  images: Img[];
}

export interface Lead {
  id: number;
  name: string;
  phone: string;
  interest: string;
  message: string;
  status: "new" | "done";
  createdAt: string;
}

export interface Settings {
  brandMain: string;
  brandSub: string;
  phone: string;
  zalo: string;
  address: string;
  email: string;
  hours: string;
}

export const SETTING_FIELDS: { key: keyof Settings; label: string; hint?: string }[] = [
  { key: "brandMain", label: "Tên thương hiệu (dòng chính)" },
  { key: "brandSub", label: "Chữ phụ (nhỏ, viết hoa)" },
  { key: "phone", label: "Hotline hiển thị", hint: "Ví dụ: 0900 000 000" },
  { key: "zalo", label: "Số Zalo", hint: "Bỏ trống để dùng hotline" },
  { key: "address", label: "Địa chỉ" },
  { key: "email", label: "Email" },
  { key: "hours", label: "Giờ làm việc" },
];

export const DEFAULT_SETTINGS: Settings = {
  brandMain: "Nhà Thang",
  brandSub: "STUDIO",
  phone: "",
  zalo: "",
  address: "",
  email: "",
  hours: "",
};
