import Image from 'next/image';
import Link from 'next/link';
import { getCatalog, getFacets } from './catalog-server';
import type { CatalogFacets } from './catalog-types';

type Collection = CatalogFacets['collections'][number];

function featuredCollections(facets: CatalogFacets): Collection[] {
  const brandOrder = [...new Set(['galvan', 'serena', 'aveline', ...facets.brands.map(b => b.slug)])];
  const groups = brandOrder.map(brand => {
    const seen = new Set<string>();
    return facets.collections
      .filter(c => c.brandSlug === brand && !/accessor|cape|veil|prototype|other|skirt/i.test(c.name))
      .sort((a, b) => Number(b.key.includes(':public:')) - Number(a.key.includes(':public:')) || b.count - a.count || a.key.localeCompare(b.key))
      .filter(c => {
        const identity = c.name.toLowerCase();
        if (seen.has(identity)) return false;
        seen.add(identity);
        return true;
      });
  });
  const result: Collection[] = [];
  for (let round = 0; groups.some(group => round < group.length); round++) {
    for (const group of groups) if (group[round]) result.push(group[round]);
  }
  return result;
}

async function loadCollectionCards() {
    const facets = await getFacets();
    if (!facets) throw new Error('Collections unavailable');
    const candidates = featuredCollections(facets);
    const cards: { collection: Collection; brandName: string; image: string }[] = [];
    for (let offset = 0; offset < candidates.length && cards.length < 10; offset += 10) {
      const batch = await Promise.all(candidates.slice(offset, offset + 10).map(async collection => {
        const catalog = await getCatalog(new URLSearchParams({ brand: collection.brandSlug, collection: collection.key, limit: '60' }));
        const product = catalog?.items.find(p => p.images.length > 0);
        if (!product) return null;
        return { collection, brandName: product.brand.name, image: product.images[0] };
      }));
      cards.push(...batch.filter((card): card is NonNullable<typeof card> => card !== null));
    }
    return cards.slice(0, 10);
}

export default async function HomeProducts() {
  let cards;
  try {
    cards = await loadCollectionCards();
  } catch {
    return <div className="home-collection-status" role="status"><p>The collections are temporarily unavailable.</p><Link href="/products">Explore our collections ↗</Link></div>;
  }
  if (!cards.length) {
      return <div className="home-collection-status"><p>Discover our bridal collections.</p><Link href="/products">Explore our collections ↗</Link></div>;
    }
    return cards.map(({ collection, brandName, image }) => (
      <Link className="photo-grid__item" key={collection.key}
        href={'/products?' + new URLSearchParams({ brand: collection.brandSlug, collection: collection.key })}
        aria-label={brandName + ', ' + collection.name + '. View collection'} prefetch={false}>
        <div className="model-card">
          <Image src={image} alt={collection.name + ' collection by ' + brandName}
            fill unoptimized sizes="(max-width: 600px) 50vw, (max-width: 1024px) 33vw, 20vw" className="photo-grid__image" />
          <h2 className="model-card__title"><span>{brandName}</span>{collection.name}</h2>
          <div className="model-card__reveal" aria-hidden="true">
            <div className="model-card__reveal-copy">
              <span className="model-card__tag">View collection</span>
              <p>{collection.name}</p>
            </div>
          </div>
        </div>
      </Link>
    ));
}
