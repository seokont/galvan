'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { CatalogFacets, CatalogPage } from '../catalog-types';
import CatalogCard from './catalog-card';

export default function ProductCatalog() {
  const router = useRouter();
  const params = useSearchParams();
  const brand = params.get('brand') || '';
  const collection = params.get('collection') || '';
  const silhouette = params.get('silhouette') || '';
  const query = new URLSearchParams();
  for (const key of ['brand', 'collection', 'silhouette', 'q', 'page']) {
    const value = params.get(key);
    if (value) query.set(key, value);
  }
  query.set('limit', '24');
  const queryString = query.toString();
  const [facets, setFacets] = useState<CatalogFacets | null>(null);
  const [result, setResult] = useState<{ query: string; data: CatalogPage } | null>(null);
  const [productError, setProductError] = useState<{ query: string; message: string } | null>(null);
  const [facetsError, setFacetsError] = useState('');
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const abort = new AbortController();
    fetch('/api/catalog/facets', { signal: abort.signal }).then(r => {
      if (!r.ok) throw new Error('Unavailable');
      return r.json();
    }).then((data: CatalogFacets) => {
      if (!abort.signal.aborted) { setFacets(data); setFacetsError(''); }
    }).catch(() => { if (!abort.signal.aborted) setFacetsError('We couldn’t load the collection filters. Please try again.'); });
    return () => abort.abort();
  }, [retry]);

  useEffect(() => {
    const abort = new AbortController();
    fetch('/api/catalog/products?' + queryString, { signal: abort.signal }).then(r => {
      if (!r.ok) throw new Error('Unavailable');
      return r.json();
    }).then((data: CatalogPage) => { if (!abort.signal.aborted) { setResult({ query: queryString, data }); setProductError(null); } })
      .catch(() => { if (!abort.signal.aborted) setProductError({ query: queryString, message: 'We couldn’t load the collection. Please try again.' }); });
    return () => abort.abort();
  }, [queryString, retry]);

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value); else next.delete(key);
    if (key === 'brand') next.delete('collection');
    if (key !== 'page') next.delete('page');
    router.replace('/products' + (next.size ? '?' + next : ''), { scroll: false });
  }
  const data = result?.query === queryString ? result.data : null;
  const error = facetsError || (productError?.query === queryString ? productError.message : '');
  const loading = !data && !error;
  const collections = facets?.collections.filter(c => !brand || c.brandSlug === brand) ?? [];

  return <>
    <div className="catalog-intro">
      <div className="catalog-intro__detail catalog-intro__detail--lace" aria-hidden="true"><Image src="/assets/about/serena.jpg" alt="" fill sizes="(max-width: 700px) 24vw, 180px" /></div>
      <div className="catalog-intro__text">
      <p className="catalog-eyebrow">The bridal edit</p>
      <h1>Our collections</h1>
      <p className="catalog-intro__description">Explore the brands. Find the piece that feels like you.</p>
      <nav className="catalog-intro__brands" aria-label="Explore bridal brands">
        {(facets?.brands ?? [{ slug: 'galvan', name: 'Galvan Sposa' }, { slug: 'aveline', name: 'Aveline Bridal' }, { slug: 'serena', name: 'Serena Bridal' }]).map(item => <Link key={item.slug} href={'/products?brand=' + encodeURIComponent(item.slug)} aria-current={brand === item.slug ? 'true' : undefined} onClick={event => { if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) { event.preventDefault(); update('brand', item.slug); } }}>{item.name}</Link>)}
      </nav>
      </div>
      <div className="catalog-intro__detail catalog-intro__detail--silk" aria-hidden="true"><Image src="/assets/about/aveline.jpg" alt="" fill sizes="(max-width: 700px) 24vw, 180px" /></div>
    </div>
    <div className="catalog-toolbar catalog-toolbar--odoo">
      <div className="catalog-selects">
        <label>Brand<select value={brand} onChange={e => update('brand', e.target.value)}>
          <option value="">All brands</option>
          {facets?.brands.map(b => <option key={b.slug} value={b.slug}>{b.name} ({b.count})</option>)}
        </select></label>
        <label>Collection<select value={collection} onChange={e => update('collection', e.target.value)}>
          <option value="">All collections</option>
          {collections.map(c => <option key={c.key} value={c.key}>{!brand ? (facets?.brands.find(b => b.slug === c.brandSlug)?.name + ' · ') : ''}{c.name} ({c.count})</option>)}
        </select></label>
        <label>Silhouette<select value={silhouette} onChange={e => update('silhouette', e.target.value)}>
          <option value="">All silhouettes</option>
          {facets?.silhouettes.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
        </select></label>
        {(brand || collection || silhouette || params.get('q')) && <button className="catalog-reset" onClick={() => router.replace('/products', { scroll: false })}>Clear filters</button>}
      </div>
      <p className="catalog-count" role="status" aria-live="polite">{data ? data.total + ' pieces' : loading ? 'Loading collection…' : ''}</p>
    </div>
    {error ? <div className="catalog-message" role="alert"><p>{error}</p><button onClick={() => { setFacetsError(''); setProductError(null); setRetry(n => n + 1); }}>Try again</button></div>
      : loading ? <div className="catalog-message" role="status">Loading collection…</div>
        : data && data.items.length ? <>
          <section className="catalog-grid" aria-label="Collection">
            {data.items.map((product, i) => <CatalogCard key={product.id} product={product} eager={i < 4} />)}
          </section>
          <nav className="catalog-pagination" aria-label="Catalog pages">
            <button disabled={data.page <= 1} onClick={() => update('page', String(data.page - 1))}>← Previous</button>
            <span aria-live="polite">Page {data.page} of {data.pages}</span>
            <button disabled={data.page >= data.pages} onClick={() => update('page', String(data.page + 1))}>Next →</button>
          </nav>
        </> : <div className="catalog-message"><p>No pieces match these filters.</p><button onClick={() => router.replace('/products')}>Explore all collections</button></div>}
  </>;
}
