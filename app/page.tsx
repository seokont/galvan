import SiteHeader from "./site-header";

import Image from "next/image";
import SiteFooter from "./site-footer";
import ScreenNavigation from "./screen-navigation";
import models from "./models.json";
import Link from "next/link";

export default function Home() {
  return (
    <main id="home" className="scroll-stack">
      <SiteHeader />
      <section className="video-hero scroll-panel" aria-label="Wedding film">
        <video
          className="video-hero__video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-label="Wedding film"
        >
          <source src="/assets/galvan-web-slider.mp4" type="video/mp4" />
          Your browser does not support video playback.
        </video>
        <a className="hero-scroll" href="#collections" aria-label="Scroll to collections">
          <svg width="24" height="32" viewBox="0 0 24 32" fill="none" aria-hidden="true">
            <path d="M12 2V28M3 19L12 28L21 19" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </a>
      </section>
      <div id="collections" className="scroll-anchor" aria-hidden="true" />
      <section className="photo-grid scroll-panel" aria-label="Model collections">
        {models.map((model, index) => (
          <article className="photo-grid__item" key={model.file} tabIndex={0}
            aria-labelledby={`model-category-${index + 1}`}>
            <div className="model-card">
              <Image
                src={`/assets/models/${model.file}`}
                alt={`${model.name} wedding dress by Galvan Sposa`}
                fill
                sizes="(max-width: 600px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className="photo-grid__image"
              />
              <h2 className="model-card__title" id={`model-category-${index + 1}`}>
                <span>Collection</span>
                {model.name.split(" ").slice(1).join(" ")}
              </h2>
              <div className="model-card__reveal" aria-hidden="true">
                <div className="model-card__reveal-copy">
                  <span className="model-card__tag">Collection</span>
                  <p>{model.name.split(" ").slice(1).join(" ")}</p>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>
      <div id="about" className="scroll-anchor" aria-hidden="true" />
      <section className="home-about scroll-panel" aria-labelledby="home-about-title">
        <div className="home-about__image">
          <Image src="/assets/galvan-sposa-group.jpg" alt="Bridal collections from Galvan Sposa Group" fill sizes="(max-width: 900px) 100vw, 55vw" />
        </div>
        <div className="home-about__copy">
          <p className="contact-eyebrow">About us · Galvan Sposa Group</p>
          <h2 id="home-about-title">Three identities.<br /><em>One vision of elegance.</em></h2>
          <p>Galvan Sposa Group brings together Galvan Sposa, Serena Bridal and Aveline Bridal — three collections with their own distinct character.</p>
          <p>Founded in Italy in the late 1980s, the group combines bridal craftsmanship with modern design. Each collection has its own expression of femininity, with a shared attention to quality and detail.</p>
          <div className="home-about__brands" aria-label="Brands"><span>Galvan Sposa</span><span>Serena Bridal</span><span>Aveline Bridal</span></div>
          <Link href="/products" className="contact-collection-link">Explore the collection <span aria-hidden="true">↗</span></Link>
          <a className="home-about__source" href="https://galvansposa.it/about/" target="_blank" rel="noopener noreferrer">Discover Galvan Sposa Group ↗</a>
        </div>
      </section>
      <div id="footer-start" className="scroll-anchor" aria-hidden="true" />
      <SiteFooter />
      <ScreenNavigation />
    </main>
  );
}


