import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteHeader from "../site-header";
import SiteFooter from "../site-footer";

export const metadata: Metadata = {
  title: "About Galvan Sposa Group | Atelier",
  description: "Discover the Italian heritage and three bridal identities of Galvan Sposa Group: Galvan Sposa, Aveline Bridal and Serena Bridal.",
};

const brands = [
  { name: "Galvan Sposa", image: "galvan.jpg", label: "Timeless & contemporary", text: "Haute-couture inspiration meets modern bridal design, shaped by Italian expertise and careful craftsmanship." },
  { name: "Aveline Bridal", image: "aveline.jpg", label: "Light & expressive", text: "A fresh, contemporary bridal identity for women drawn to modern, confident elegance." },
  { name: "Serena Bridal", image: "serena.jpg", label: "Soft & romantic", text: "Delicate lace and flowing silhouettes express a feminine, romantic vision of bridal beauty." },
];
const values = [
  { title: "Clear vision", text: "Experience and considered design guide every collection." },
  { title: "Lasting style", text: "Wearable silhouettes designed to outlast seasonal trends." },
  { title: "Modern beauty", text: "Natural elegance that puts the bride first." },
  { title: "Trusted support", text: "Consistent quality and dependable production for boutique partners." },
];

export default function AboutPage() {
  return (
    <main id="home" className="catalog-page about-page">
      <SiteHeader catalog about />
      <section className="about-intro" aria-labelledby="about-title">
        <p className="contact-eyebrow">Our story · Galvan Sposa Group</p>
        <h1 id="about-title">Italian heritage.<br /><em>A modern bridal spirit.</em></h1>
        <p>Three distinct brands, brought together by a shared dedication to bridal design and craftsmanship.</p>
      </section>
      <section className="about-heritage" aria-labelledby="heritage-title">
        <div className="about-heritage__copy">
          <p className="contact-eyebrow">Italy · Since the late 1980s</p>
          <h2 id="heritage-title">Rooted in tradition.<br /><em>Looking forward.</em></h2>
          <p>Founded in Italy in the late 1980s, Galvan Sposa Group draws on Milanese haute-couture influences and decades of bridal expertise.</p>
          <p>Its collections pair contemporary design with enduring silhouettes, attentive service and reliable quality.</p>
          <Link href="/products" className="contact-collection-link">Explore the collection <span aria-hidden="true">↗</span></Link>
        </div>
      </section>
      <section className="about-brands" aria-labelledby="brands-title">
        <div className="about-section-heading"><p className="contact-eyebrow">Individual by design</p><h2 id="brands-title">Three brands. One philosophy.</h2></div>
        <div className="about-brands__grid">{brands.map((brand) => (
          <article className="about-brand" key={brand.name}>
            <div className="about-brand__image"><Image src={`/assets/about/${brand.image}`} alt={`${brand.name} bridal collection`} fill sizes="(max-width: 600px) 100vw, 33vw" /></div>
            <div className="about-brand__copy"><p className="contact-eyebrow">{brand.label}</p><h3>{brand.name}</h3><p>{brand.text}</p></div>
          </article>
        ))}</div>
      </section>
      <section className="about-vision" aria-labelledby="vision-title">
        <div><p className="contact-eyebrow">What brings us together</p><h2 id="vision-title">Elegance with<br /><em>a clear purpose.</em></h2></div>
        <div className="about-values">{values.map((value, index) => <article key={value.title}><span>0{index + 1}</span><h3>{value.title}</h3><p>{value.text}</p></article>)}</div>
      </section>
      <div className="about-end"><Link className="contact-collection-link" href="/contact">Get in touch <span aria-hidden="true">↗</span></Link><a href="https://galvansposa.it/about/" target="_blank" rel="noopener noreferrer">Story and photography: Galvan Sposa Group ↗</a></div>
      <SiteFooter />
    </main>
  );
}
