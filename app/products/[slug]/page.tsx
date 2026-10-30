import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import models from "../../models.json";
import details from "../../product-details.json";
import SiteHeader from "../../site-header";
import SiteFooter from "../../site-footer";
import ProductDetail from "./product-detail";

export const instant = false;

export function generateStaticParams() {
  return models.map((model) => ({ slug: model.file.replace(".jpg", "") }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const model = models.find((item) => item.file === `${slug}.jpg`);
  return { title: model ? `${model.name} wedding dress | Atelier` : "Dress not found | Atelier" };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const model = models.find((item) => item.file === `${slug}.jpg`);
  const detail = details.find((item) => item.code === slug);
  if (!model || !detail) notFound();
  return (
    <main id="home" className="catalog-page product-page">
      <SiteHeader catalog />
      <nav className="product-breadcrumb" aria-label="Breadcrumb">
        <Link href="/products">Wedding dresses</Link><span aria-hidden="true">/</span>
        <span aria-current="page">{model.name.split(" ").slice(1).join(" ")}</span>
      </nav>
      <ProductDetail model={model} detail={detail} />
      <section className="product-related" aria-labelledby="related-title">
        <div className="product-related__heading"><h2 id="related-title">You may also love</h2><Link href="/products">Explore all dresses ↗</Link></div>
        <div className="product-related__grid">
          {models.filter((item) => item.file !== model.file).slice(0, 4).map((item) => (
            <Link className="catalog-card" href={`/products/${item.file.replace(".jpg", "")}`} key={item.file}>
              <Image src={`/assets/models/${item.file}`} alt={item.name} fill sizes="(max-width: 600px) 50vw, 25vw" />
              <div className="catalog-card__copy"><span className="catalog-card__code">{item.category}</span><h2>{item.name.split(" ").slice(1).join(" ")}</h2></div>
            </Link>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
