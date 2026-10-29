import SiteHeader from "./site-header";

import Image from "next/image";
import SiteFooter from "./site-footer";
import ScreenNavigation from "./screen-navigation";

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
        {Array.from({ length: 10 }, (_, index) => (
          <article className="photo-grid__item" key={index} tabIndex={0}
            aria-labelledby={`model-category-${index + 1}`}>
            <div className="model-card">
              <Image
                src={`/assets/gallery/frame-${String(index + 1).padStart(2, "0")}.jpg`}
                alt=""
                fill
                sizes="(max-width: 600px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className="photo-grid__image"
              />
              <h2 className="model-card__title" id={`model-category-${index + 1}`}>
                <span>Collection</span>
                Model {String(index + 1).padStart(2, "0")}
              </h2>
              <div className="model-card__reveal" aria-hidden="true">
                <div className="model-card__reveal-copy">
                  <span className="model-card__tag">Collection</span>
                  <p>Model {String(index + 1).padStart(2, "0")}</p>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>
      <div id="footer-start" className="scroll-anchor" aria-hidden="true" />
      <SiteFooter />
      <ScreenNavigation />
    </main>
  );
}


