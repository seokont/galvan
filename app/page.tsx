import SiteHeader from "./site-header";

import Image from "next/image";
import SiteFooter from "./site-footer";
import ScreenNavigation from "./screen-navigation";
import { Suspense } from "react";
import HomeProducts from "./home-products";
import BridalHero from "./bridal-hero";
import Link from "next/link";

export default function Home() {
  return (
    <main id="home" className="scroll-stack">
      <SiteHeader editorial />
      <BridalHero />
      <div id="collections" className="scroll-anchor" aria-hidden="true" />
      <section className="photo-grid scroll-panel" aria-label="Model collections">
        <Suspense fallback={<div className="home-collection-status" role="status">Loading collection…</div>}>
          <HomeProducts />
        </Suspense>
      </section>
      <div id="about" className="scroll-anchor" aria-hidden="true" />
      <section className="home-about scroll-panel" aria-labelledby="home-about-title">
        <div className="home-about__image">
          {[
            { name: "Galvan Sposa", image: "galvan.jpg" },
            { name: "Aveline Bridal", image: "aveline.jpg" },
            { name: "Serena Bridal", image: "serena.jpg" },
          ].map((brand) => (
            <figure className="home-about__portrait" key={brand.image}>
              <div className="home-about__portrait-frame">
                <Image src={`/assets/about/${brand.image}`} alt={`${brand.name} bridal collection`}
                  fill unoptimized />
              </div>
              <figcaption>{brand.name}</figcaption>
            </figure>
          ))}
        </div>
        <div className="home-about__copy">
          <p className="contact-eyebrow">About us · Galvan Sposa Group</p>
          <h2 id="home-about-title">Three identities.<br /><em>One vision of elegance.</em></h2>
          <p>Galvan Sposa Group brings together Galvan Sposa, Serena Bridal and Aveline Bridal — three collections with their own distinct character.</p>
          <p>Founded in Italy in the late 1980s, the group combines bridal craftsmanship with modern design. Each collection has its own expression of femininity, with a shared attention to quality and detail.</p>
          <div className="home-about__brands" aria-label="Brands"><span>Galvan Sposa</span><span>Serena Bridal</span><span>Aveline Bridal</span></div>
          <Link href="/products" className="contact-collection-link">Explore the collection <span aria-hidden="true">↗</span></Link>
          <Link className="home-about__source" href="/about">Discover our story ↗</Link>
        </div>
      </section>
      <div id="footer-start" className="scroll-anchor" aria-hidden="true" />
      <SiteFooter />
      <ScreenNavigation />
    </main>
  );
}


