import Link from "next/link";
import { formatPrice } from "@/lib/format";
import type { Category, Product } from "@/lib/types";
import Ph from "./Ph";

export function CategoryCard({ c, eager }: { c: Category; eager?: boolean }) {
  const href = `/danh-muc/${c.slug}`;
  return (
    <article className="card">
      <Ph name={c.name} tone={c.tone} images={c.images} eager={eager}>
        {c.tag && <span className="tag">{c.tag}</span>}
      </Ph>
      <div className="card-body">
        <h3>
          <Link href={href}>{c.name}</Link>
        </h3>
        <p>{c.description}</p>
        <Link className="more" href={href}>
          Xem chi tiết
        </Link>
      </div>
    </article>
  );
}

export function ProductCard({ p, showDesc }: { p: Product; showDesc?: boolean }) {
  return (
    <article className="product">
      {p.featured && <span className="hot">HOT</span>}
      <Ph name={p.name} tone={p.tone} images={p.images} sizes="(max-width:560px) 100vw, (max-width:1024px) 50vw, 25vw" />
      <div className="info">
        <h3>{p.name}</h3>
        {p.sku && <span className="sku">Mã: {p.sku}</span>}
        {showDesc && p.description && <p className="desc">{p.description}</p>}
        <div className="price">
          {p.price !== null ? (
            <>
              {p.oldPrice !== null && <del>{formatPrice(p.oldPrice)}</del>}
              <b>{formatPrice(p.price)}</b>
              {p.unit && <span className="sku"> {p.unit}</span>}
            </>
          ) : (
            <i>Liên hệ báo giá</i>
          )}
        </div>
        <a className="btn btn-accent" href="#lien-he" data-product={p.name}>
          Đặt hàng ngay
        </a>
      </div>
    </article>
  );
}
