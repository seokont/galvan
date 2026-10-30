import type { Metadata } from "next";
import SiteHeader from "../site-header";
import SiteFooter from "../site-footer";
import ProductCatalog from "./product-catalog";

export const metadata: Metadata = {
  title: "Wedding dresses | Atelier",
  description: "Explore the bridal collection. Discover A-line, fit-and-flare and princess wedding dresses.",
};

export default function ProductsPage() {
  return (
    <main id="home" className="catalog-page">
      <SiteHeader catalog />
      <ProductCatalog />
      <SiteFooter />
    </main>
  );
}
