"use client";

import { useState } from "react";
import { imageSrc, smSize } from "@/lib/images";
import type { Img } from "@/lib/types";
import Lightbox from "./Lightbox";

/** Lưới ảnh thu nhỏ (bản 640px), bấm để xem bản lớn. */
export default function Gallery({ images, caption }: { images: Img[]; caption: string }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <>
      <div className="gallery">
        {images.map((img, i) => (
          <button key={img.id} type="button" onClick={() => setOpen(i)} aria-label={`Xem ảnh ${i + 1}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageSrc(img.id, "sm")} {...smSize(img)} alt={`${caption} ${i + 1}`} loading={i < 4 ? "eager" : "lazy"} decoding="async" />
          </button>
        ))}
      </div>
      {open !== null && <Lightbox images={images} start={open} caption={caption} onClose={() => setOpen(null)} />}
    </>
  );
}
