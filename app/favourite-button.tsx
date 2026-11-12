"use client";

import type { CatalogProduct } from "./catalog-types";
import { toggleFavourite, useFavourites } from "./favourites-store";

export default function FavouriteButton({ product, className = "product-save" }: { product: CatalogProduct; className?: string }) {
  const saved = useFavourites().some(item => item.id === product.id);
  return <button type="button" className={className} aria-label={`${saved ? "Remove from" : "Save to"} favourites: ${product.name}`} aria-pressed={saved} onClick={() => toggleFavourite(product)}>
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.2" /></svg>
  </button>;
}
