import Image from 'next/image';
import Link from 'next/link';
import HeroParallax from './hero-parallax';
import './bridal-hero.css';

export default function BridalHero() {
  return <HeroParallax>
    <Image className="bridal-hero__backdrop" src="/assets/hero/atelier-golden-hills.webp" alt="" fill sizes="100vw" preload unoptimized />
    <div className="bridal-hero__veil" aria-hidden="true" />
    <h1 id="bridal-hero-title" className="bridal-hero__title"><span>Atelier</span>{' '}<span>bridal studio</span></h1>
    <div className="bridal-hero__rule" aria-hidden="true" />
    <p className="bridal-hero__intro">Distinctive bridal collections. Thoughtful details.<br />A dress that feels entirely like you.<br /><Link href="/products">Find your forever dress <span aria-hidden="true">↗</span></Link></p>
    <div className="bridal-hero__shadow" aria-hidden="true" />
    <div className="bridal-hero__subject"><Image src="/assets/hero/atelier-bride-raised-arms.webp" alt="A bride raising her arms gracefully in a flowing ivory satin wedding gown" fill sizes="(max-width: 600px) 75vh, 67vh" preload unoptimized /></div>
    <Link className="bridal-hero__appointment" href="/contact"><span>Book an<br />appointment</span><svg viewBox="0 0 56 20" width="48" height="18" fill="none" aria-hidden="true"><path d="M1 10h52m-8-7 8 7-8 7" stroke="currentColor" strokeWidth=".8" /></svg></Link>
    <div className="bridal-hero__bottom"><span className="bridal-hero__edition">THE BRIDAL EDIT · ATELIER</span><a href="#collections" className="bridal-hero__discover">Discover the collections <span aria-hidden="true">↓</span></a><span className="bridal-hero__note">A new chapter begins.</span></div>
  </HeroParallax>;
}
