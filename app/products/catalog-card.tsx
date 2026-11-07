import Image from 'next/image';
import Link from 'next/link';
import type { CatalogProduct } from '../catalog-types';

export default function CatalogCard({ product, eager = false }: { product: CatalogProduct; eager?: boolean }) {
  return <Link className="catalog-card" href={`/products/${product.slug}`} aria-label={`${product.brand.name}, ${product.name}. View piece`} prefetch={false}>
    {product.images[0] ? <Image src={product.images[0]} alt={`${product.brand.name} ${product.name}`} fill unoptimized sizes="(max-width: 600px) 50vw, (max-width: 1024px) 33vw, 25vw" loading={eager ? 'eager' : 'lazy'} />
      : <span className="catalog-no-photo">Photography coming soon</span>}
    <div className="catalog-card__copy">
      <span className="catalog-card__code">{product.brand.name}{product.collections.length > 0 && ` · ${product.collections.map(c => c.name).join(' / ')}`}</span>
      <h2>{product.name}</h2>
      <span className="catalog-card__action">View piece <span aria-hidden="true">↗</span></span>
    </div>
  </Link>;
}
