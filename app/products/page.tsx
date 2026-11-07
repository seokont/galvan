import type { Metadata } from "next";
import SiteHeader from "../site-header";
import SiteFooter from "../site-footer";
import ProductCatalog from "./product-catalog";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Collections | Atelier",
  description: "Explore bridal brands and collections. Find your silhouette, materials and details.",
};

export default function ProductsPage() {
  return (
    <main id="home" className="catalog-page">
      <SiteHeader catalog />
      <Suspense fallback={<div className="catalog-message" role="status">Loading collection…</div>}><ProductCatalog /></Suspense>
      <SiteFooter />
    </main>
  );
}
