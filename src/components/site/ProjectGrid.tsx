"use client";

import { useState } from "react";
import type { Project } from "@/lib/types";
import Lightbox from "./Lightbox";
import Ph from "./Ph";

const SIZES = "(max-width:560px) 100vw, (max-width:1024px) 50vw, 25vw";

/** Lưới công trình; công trình có ảnh thì bấm vào để xem cả bộ ảnh. */
export default function ProjectGrid({ projects }: { projects: Project[] }) {
  const [open, setOpen] = useState<Project | null>(null);
  return (
    <>
      <div className="projects">
        {projects.map((p) =>
          p.images.length > 0 ? (
            <button key={p.id} type="button" className="project" onClick={() => setOpen(p)}>
              <Ph name={p.name} tone={p.tone} images={p.images} sizes={SIZES}>
                {p.images.length > 1 && <span className="count">📷 {p.images.length}</span>}
              </Ph>
              <h3>{p.name}</h3>
            </button>
          ) : (
            <article key={p.id} className="project">
              <Ph name={p.name} tone={p.tone} images={p.images} sizes={SIZES} />
              <h3>{p.name}</h3>
            </article>
          ),
        )}
      </div>
      {open && <Lightbox images={open.images} start={0} caption={open.name} onClose={() => setOpen(null)} />}
    </>
  );
}
