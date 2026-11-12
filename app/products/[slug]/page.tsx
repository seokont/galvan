import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { notFound, permanentRedirect } from 'next/navigation';
import { getCatalog, getProduct } from '../../catalog-server';
import SiteHeader from '../../site-header';
import SiteFooter from '../../site-footer';
import CatalogCard from '../catalog-card';
import ProductDetail from './product-detail';

export const instant = false;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await getProduct(slug);
    return { title: product ? product.name + ' · ' + product.brand.name + ' | Atelier' : 'Piece not found | Atelier', ...(product?{alternates:{canonical:'https://store.fashiongroup.online/products/'+product.slug}}:{}) };
  } catch {
    return { title: 'Collection | Atelier' };
  }
}

async function ProductContent({ params }: Props) {
  const { slug } = await params;
  let product;
  try {
    product = await getProduct(slug);
  } catch {
    return <div className="catalog-message" role="alert"><h1>The collection is temporarily unavailable.</h1><Link href="/products">Return to collections</Link></div>;
  }
  if (!product) notFound();
  if (product.slug !== slug) permanentRedirect('/products/' + product.slug);
  const related = await getCatalog(new URLSearchParams({ brand: product.brand.slug, limit: '5' })).catch(() => null);
  return <>
    <nav className="product-breadcrumb" aria-label="Breadcrumb">
      <Link href="/products">Collections</Link><span aria-hidden="true">/</span>
      <Link href={'/products?brand=' + product.brand.slug}>{product.brand.name}</Link><span aria-hidden="true">/</span>
      <span aria-current="page">{product.name}</span>
    </nav>
    <ProductDetail key={product.id} product={product} />
    {related && related.items.some(p => p.id !== product.id) && <section className="product-related" aria-labelledby="related-title">
      <div className="product-related__heading"><h2 id="related-title">You may also love</h2><Link href={'/products?brand=' + product.brand.slug}>Explore the brand ↗</Link></div>
      <div className="product-related__grid">
        {related.items.filter(p => p.id !== product.id).slice(0, 4).map(p => <CatalogCard key={p.id} product={p} />)}
      </div>
    </section>}
  </>;
}

export default function ProductPage({ params }: Props) {
  return <main id="home" className="catalog-page product-page">
    <SiteHeader catalog />
    <Suspense fallback={<div className="catalog-message" role="status">Loading piece…</div>}><ProductContent params={params} /></Suspense>
    <SiteFooter />
  </main>;
}
