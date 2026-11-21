"use client";

import { useCallback, useEffect, useState } from "react";
import { imageSrc } from "@/lib/images";
import type { Img } from "@/lib/types";

// Xem ảnh lớn (bản 1600px). Phím ← → để chuyển, Esc để đóng.
export default function Lightbox({ images, start, caption, onClose }: { images: Img[]; start: number; caption: string; onClose: () => void }) {
  const [i, setI] = useState(start);
  const n = images.length;
  const go = useCallback((d: number) => setI((x) => (x + d + n) % n), [n]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "ArrowRight") go(1);
    };
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [go, onClose]);

  // Tải trước ảnh kế tiếp để bấm "tiếp" hiện ngay.
  useEffect(() => {
    if (n > 1) new Image().src = imageSrc(images[(i + 1) % n].id, "lg");
  }, [i, n, images]);

  const img = images[i];
  if (!img) return null;
  return (
    <div className="lb" role="dialog" aria-modal="true" aria-label={caption} onClick={onClose}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={imageSrc(img.id, "lg")} width={img.width} height={img.height} alt={caption} onClick={(e) => e.stopPropagation()} />
      <p className="lb-cap">
        {caption}
        {n > 1 && ` · ${i + 1}/${n}`}
      </p>
      <button type="button" className="lb-btn lb-x" aria-label="Đóng" onClick={onClose}>
        ×
      </button>
      {n > 1 && (
        <>
          <button type="button" className="lb-btn lb-prev" aria-label="Ảnh trước" onClick={(e) => (e.stopPropagation(), go(-1))}>
            ‹
          </button>
          <button type="button" className="lb-btn lb-next" aria-label="Ảnh sau" onClick={(e) => (e.stopPropagation(), go(1))}>
            ›
          </button>
        </>
      )}
    </div>
  );
}
