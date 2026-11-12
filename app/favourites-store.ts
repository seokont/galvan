"use client";

import { useMemo, useSyncExternalStore } from "react";
import type { CatalogProduct } from "./catalog-types";

const key = "atelier-favourites";
let fallback = "[]";
function snapshot() {
  try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; }
}
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("atelier-favourites", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("atelier-favourites", callback);
  };
}
function parse(value: string): CatalogProduct[] {
  try {
    const items = JSON.parse(value);
    return Array.isArray(items) ? items.filter(item => item && typeof item.id === "number" && typeof item.slug === "string" && typeof item.name === "string" && typeof item.brand?.name === "string" && Array.isArray(item.images) && Array.isArray(item.collections)) : [];
  } catch { return []; }
}
export function useFavourites() {
  const value = useSyncExternalStore(subscribe, snapshot, () => "[]");
  return useMemo(() => parse(value), [value]);
}
export function toggleFavourite(product: CatalogProduct) {
  const items = parse(snapshot());
  const exists = items.some(item => item.id === product.id);
  const { id, slug, name, sku, brand, collections, silhouette, images } = product;
  fallback = JSON.stringify(exists ? items.filter(item => item.id !== id) : [...items, { id, slug, name, sku, brand, collections, silhouette, images }]);
  try { localStorage.setItem(key, fallback); } catch { /* Keep this session usable when storage is unavailable. */ }
  window.dispatchEvent(new Event("atelier-favourites"));
}
