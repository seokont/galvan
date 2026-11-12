"use client";

import Link from "next/link";
import { useFavourites } from "../favourites-store";
import CatalogCard from "../products/catalog-card";

export default function FavouritesList() {
  const products = useFavourites();
  return <section className="favourites-content" aria-labelledby="favourites-title">
    <div className="favourites-heading"><p>Your bridal edit</p><h1 id="favourites-title">My favourites</h1><span>{products.length} {products.length === 1 ? "piece" : "pieces"}</span></div>
    {products.length ? <div className="catalog-grid">{products.map((product, index) => <CatalogCard key={product.id} product={product} eager={index < 4} />)}</div>
      : <div className="favourites-empty"><p>Your favourite dresses will appear here.</p><p>Tap the heart on a dress to keep it in your bridal edit.</p><Link href="/products">Explore the collections →</Link></div>}
  </section>;
}
