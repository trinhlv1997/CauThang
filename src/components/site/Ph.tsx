import { imageSrc, imageSrcSet, smSize } from "@/lib/images";
import type { Img, Tone } from "@/lib/types";

// Khung ảnh tỉ lệ cố định. Có ảnh → <img> với srcset (bản 640px/1600px), không có → hình cầu thang SVG trên nền màu theo tone.
export default function Ph({
  name,
  tone,
  images,
  sizes = "(max-width:560px) 100vw, (max-width:860px) 50vw, 33vw",
  eager = false,
  children,
}: {
  name: string;
  tone: Tone;
  images: Img[];
  sizes?: string;
  eager?: boolean;
  children?: React.ReactNode;
}) {
  const cover = images[0];
  return (
    <div className={`ph ${tone}${cover ? " has-img" : ""}`}>
      {children}
      {cover && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageSrc(cover.id, "sm")}
          srcSet={imageSrcSet(cover)}
          sizes={sizes}
          {...smSize(cover)}
          alt={name}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={eager ? "high" : undefined}
        />
      )}
      <svg aria-hidden="true">
        <use href="#stairs" />
      </svg>
    </div>
  );
}
