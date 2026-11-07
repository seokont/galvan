'use client';

import Image from '../../product-image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import type { CatalogDetail } from '../../catalog-types';
import ProductPhoto from './product-photo';

export default function ProductDetail({ product }: { product: CatalogDetail }) {
  const [photo, setPhoto] = useState(0);
  const [size, setSize] = useState('');
  const [saved, setSaved] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const images = product.images;
  const sizes = product.attributes.find(a => a.name.toLowerCase() === 'size')?.values ?? [];
  const colors = product.attributes.find(a => a.name.toLowerCase() === 'color')?.values ?? [];

  function selectPhoto(index: number) {
    if (!images.length) return;
    const next = (index + images.length) % images.length;
    setPhoto(next);
    const gallery = galleryRef.current;
    if (gallery) gallery.scrollTo({ left: next * gallery.clientWidth, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }

  return <div className="product-layout">
    <div className="product-gallery">
      {images.length ? <>
        <div className="product-gallery__photos" ref={galleryRef} onScroll={event => {
          const gallery = event.currentTarget;
          if (gallery.scrollWidth > gallery.clientWidth) setPhoto(Math.min(images.length - 1, Math.round(gallery.scrollLeft / gallery.clientWidth)));
        }}>
          {images.map((image, index) => <ProductPhoto key={image} src={image} name={product.name} index={index}
            onOpen={() => { setPhoto(index); dialogRef.current?.showModal(); }} />)}
        </div>
        <div className="product-gallery__controls">
          <button type="button" aria-label="Previous photograph" onClick={() => selectPhoto(photo - 1)}>←</button>
          <div className="product-gallery__dots" role="group" aria-label="Choose photograph">
            {images.map((image, index) => <button key={image} type="button" aria-label={'Photo ' + (index + 1)}
              aria-pressed={photo === index} onClick={() => selectPhoto(index)}><span /></button>)}
          </div>
          <span className="product-gallery__count" aria-live="polite">{photo + 1} / {images.length}</span>
          <button type="button" aria-label="Next photograph" onClick={() => selectPhoto(photo + 1)}>→</button>
        </div>
        <dialog className="product-lightbox" ref={dialogRef} onClick={event => { if (event.target === event.currentTarget) dialogRef.current?.close(); }}>
          <button className="product-lightbox__close" type="button" aria-label="Close enlarged photo" onClick={() => dialogRef.current?.close()}>×</button>
          <Image src={images[photo]} alt={product.name + ', enlarged view'} width={1024} height={1536} sizes="100vw" unoptimized />
        </dialog>
      </> : <div className="product-no-photo">Photography coming soon</div>}
    </div>
    <section className="product-information" aria-labelledby="product-name">
      <div className="product-information__top"><Link href={'/products?brand=' + product.brand.slug}>{product.brand.name}</Link>
        <button type="button" className="product-save" aria-label={saved ? 'Remove from favourites' : 'Save to favourites'} aria-pressed={saved} onClick={() => setSaved(!saved)}>
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.2" /></svg>
        </button>
      </div>
      {product.collections.length > 0 && <p className="product-collection-links">{product.collections.map(c => <Link key={c.key} href={'/products?' + new URLSearchParams({ brand: product.brand.slug, collection: c.key })}>{c.name}</Link>)}</p>}
      <h1 id="product-name">{product.name}</h1>
      {product.silhouette && <p className="product-silhouette">{product.silhouette}</p>}
      {product.description && <p className="product-intro">{product.description}</p>}
      {colors.length > 0 && <p className="product-colors"><span>Available colours</span>{colors.join(' · ')}</p>}
      {sizes.length > 0 && <fieldset className="product-sizes"><legend>Size <span>{size}</span></legend>
        <div>{sizes.map(item => <button type="button" key={item} aria-pressed={size === item} onClick={() => setSize(item)}>{item}</button>)}</div>
        <p>Confirm fit and availability with Atelier.</p>
      </fieldset>}
      <Link className="product-cta" href="/contact">Contact Atelier <span aria-hidden="true">↗</span></Link>
      {product.attributes.length > 0 && <details className="product-specifications" open><summary>Details &amp; materials <span aria-hidden="true">+</span></summary>
        <dl>{product.attributes.map(item => <div key={item.name}><dt>{item.name}</dt><dd>{item.values.join(', ')}</dd></div>)}</dl>
      </details>}
    </section>
  </div>;
}
