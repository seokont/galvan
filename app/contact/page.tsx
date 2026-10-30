import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteHeader from "../site-header";
import SiteFooter from "../site-footer";
import ContactEnquiry from "./contact-enquiry";

export const metadata: Metadata = {
  title: "Contact | Atelier",
  description: "Get in touch with Atelier. Explore our bridal collections and prepare your enquiry.",
};

export default function ContactPage() {
  return (
    <main id="home" className="catalog-page contact-page">
      <SiteHeader catalog contact />
      <section className="contact-hero" aria-labelledby="contact-title">
        <div className="contact-hero__image"><Image src="/assets/models/g0030.jpg" alt="A bridal dress by the water in Venice" fill sizes="(max-width: 900px) 100vw, 45vw" preload /></div>
        <div className="contact-hero__copy">
          <p className="contact-eyebrow">A conversation starts here</p>
          <h1 id="contact-title">Let’s begin<br /><em>your story.</em></h1>
          <p>For the dress, the details, and everything in between.</p>
          <div className="contact-details">
            <div><h2>Write to us</h2><p>Email coming soon</p></div>
            <div><h2>Call us</h2><p>Phone coming soon</p></div>
            <div><h2>Visit us</h2><p>Address & opening hours coming soon</p></div>
          </div>
          <Link className="contact-collection-link" href="/products">Explore the collection <span aria-hidden="true">↗</span></Link>
        </div>
      </section>
      <section className="contact-enquiry" aria-labelledby="contact-enquiry-title">
        <div className="contact-enquiry__intro"><p className="contact-eyebrow">A note to Atelier</p><h2 id="contact-enquiry-title">We’d love to<br />hear from you.</h2>
          <p>Our contact details are coming soon. In the meantime, prepare and copy your enquiry here, ready for when we’re in touch.</p>
        </div>
        <ContactEnquiry />
      </section>
      <section className="contact-faq" aria-labelledby="contact-faq-title">
        <div><p className="contact-eyebrow">A little guidance</p><h2 id="contact-faq-title">Before you ask</h2></div>
        <div>
          <details><summary>Where can I explore the dresses?<span aria-hidden="true">+</span></summary><p>Browse our <Link href="/products">bridal collection</Link> and filter by silhouette. Each dress has its own photographs, materials and size information.</p></details>
          <details><summary>Can I arrange a fitting?<span aria-hidden="true">+</span></summary><p>Appointment and boutique contact details will be published here when available. For now, you can view the original dress on Galvan Sposa through its product page.</p></details>
          <details><summary>How do I choose my size?<span aria-hidden="true">+</span></summary><p>Each product page lists the EU size range supplied by the brand. Confirm measurements, fit and availability with your bridal boutique.</p></details>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
