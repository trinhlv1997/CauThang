"use client";

import { useState } from "react";

/** Menu chính + nút hamburger trên mobile. children = phần hotline/nút báo giá. */
export default function NavMenu({ links, children }: { links: { href: string; label: string }[]; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <nav className={`menu${open ? " open" : ""}`}>
        {links.map((l) => (
          <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
            {l.label}
          </a>
        ))}
      </nav>
      <div className="nav-cta">
        {children}
        <button className="burger" type="button" aria-label="Mở menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          <span />
          <span />
          <span />
        </button>
      </div>
    </>
  );
}
