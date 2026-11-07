import 'server-only';
import type { CatalogDetail, CatalogFacets, CatalogPage } from './catalog-types';

export function catalogBackendUrl(path: string) {
  return `${(process.env.BACKEND_URL || 'http://127.0.0.1:3001').replace(/\/$/, '')}/catalog/${path}`;
}
async function read<T>(path: string): Promise<T | null> {
  const response = await fetch(catalogBackendUrl(path), { cache: 'no-store', signal: AbortSignal.timeout(15000) });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error('Catalog is temporarily unavailable');
  return response.json() as Promise<T>;
}
export const getProduct = (slug: string) => read<CatalogDetail>(`products/${encodeURIComponent(slug)}`);
export const getCatalog = (params: URLSearchParams) => read<CatalogPage>(`products?${params}`);
export const getFacets = () => read<CatalogFacets>('facets');
