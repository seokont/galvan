"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import ProductPhoto from "./product-photo";

type Props = {
  model: { name: string; file: string; source: string; category: string };
  detail: { code: string; images: string[]; specs: { label: string; value: string }[] };
};

export default function ProductDetail({ model, detail }: Props) {
  const [photo, setPhoto] = useState(0);
  const [size, setSize] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const images = detail.images.map((_, index) => `/assets/models/${detail.code}${index ? `-${index}` : ""}.jpg`);
  const name = model.name.split(" ").slice(1).join(" ");
  const sizeRange = detail.specs.find((item) => item.label === "Size (EU)")?.value ?? "";
  const match = sizeRange.match(/^(\d+)\s*[-–]\s*(\d+)$/);
  const sizes = match ? Array.from({ length: Math.floor((Number(match[2]) - Number(match[1])) / 2) + 1 }, (_, index) => Number(match[1]) + index * 2) : [];
  const colors = detail.specs.find((item) => item.label === "Available colors")?.value;

  function selectPhoto(index: number) {
    const next = (index + images.length) % images.length;
    setPhoto(next);
    const gallery = galleryRef.current;
    if (gallery) gallery.scrollTo({ left: next * gallery.clientWidth, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }

  return (
    <div className="product-layout">
      <div className="product-gallery">
        <div className="product-gallery__photos" ref={galleryRef} onScroll={(event) => {
          const gallery = event.currentTarget;
          if (gallery.scrollWidth > gallery.clientWidth) setPhoto(Math.round(gallery.scrollLeft / gallery.clientWidth));
        }}>
          {images.map((image, index) => (
            <ProductPhoto key={image} src={image} name={name} index={index}
              onOpen={() => { setPhoto(index); dialogRef.current?.showModal(); }} />
          ))}
        </div>
        <div className="product-gallery__controls">
          <button type="button" aria-label="Previous photograph" onClick={() => selectPhoto(photo - 1)}>←</button>
          <div className="product-gallery__dots" role="group" aria-label="Choose photograph">
            {images.map((image, index) => <button key={image} type="button" aria-label={`Photo ${index + 1}`}
              aria-pressed={photo === index} onClick={() => selectPhoto(index)}><span /></button>)}
          </div>
          <span className="product-gallery__count" aria-live="polite">{photo + 1} / {images.length}</span>
          <button type="button" aria-label="Next photograph" onClick={() => selectPhoto(photo + 1)}>→</button>
        </div>
        <dialog className="product-lightbox" ref={dialogRef} onClick={(event) => { if (event.target === event.currentTarget) dialogRef.current?.close(); }}>
          <button className="product-lightbox__close" type="button" aria-label="Close enlarged photo" onClick={() => dialogRef.current?.close()}>×</button>
          <Image src={images[photo]} alt={`${name} wedding dress, enlarged view`} width={1707} height={2560} sizes="100vw" />
        </dialog>
      </div>
      <section className="product-information" aria-labelledby="product-name">
        <div className="product-information__top"><span>Galvan Sposa · {detail.code.toUpperCase()}</span>
          <button type="button" className="product-save" aria-label={saved ? "Remove from favourites" : "Save to favourites"} aria-pressed={saved} onClick={() => setSaved(!saved)}>
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.2" /></svg>
          </button>
        </div>
        <h1 id="product-name">{name}</h1>
        <p className="product-silhouette">{model.category} wedding dress</p>
        <p className="product-intro">Discover {name} by Galvan Sposa. Explore the silhouette, materials and details below.</p>
        {colors && <p className="product-colors"><span>Available colours</span>{colors.replaceAll(",", " · ")}</p>}
        {sizes.length > 0 ? <fieldset className="product-sizes"><legend>Size <span>EU{size ? ` ${size}` : ""}</span></legend>
          <div>{sizes.map((item) => <button type="button" key={item} aria-pressed={size === item} onClick={() => setSize(item)}>{item}</button>)}</div>
          <p>EU sizing. Confirm fit and availability with your bridal boutique.</p>
        </fieldset> : <p className="product-size-note">Available sizes: {sizeRange || "Please enquire with Galvan Sposa."}</p>}
        <a className="product-cta" href={model.source} target="_blank" rel="noopener noreferrer">View original dress <span aria-hidden="true">↗</span></a>
        <p className="product-external-note">Opens Galvan Sposa in a new tab. Purchases and appointments are arranged with the brand or your boutique.</p>
        <details className="product-specifications" open><summary>Details & materials <span aria-hidden="true">+</span></summary>
          <dl>{detail.specs.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl>
        </details>
      </section>
    </div>
  );
}
