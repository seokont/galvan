export type CatalogProduct = {
  id: number; slug: string; name: string; sku: string | null;
  brand: { slug: string; name: string };
  collections: { key: string; name: string }[];
  silhouette: string; images: string[];
};
export type CatalogDetail = CatalogProduct & {
  description: string; attributes: { name: string; values: string[] }[]; variantCount: number;
};
export type CatalogPage = { items: CatalogProduct[]; total: number; page: number; limit: number; pages: number };
export type CatalogFacets = {
  brands: { slug: string; name: string; count: number }[];
  collections: { key: string; name: string; brandSlug: string; count: number }[];
  silhouettes: { name: string; count: number }[];
};
