import BrideAnimation from "./bride-animation";
import Link from "next/link";

const groups = [
  {
    title: "Explore",
    links: [
      { label: "Home", href: "/#home" },
      { label: "About us", href: "/#about" },
      { label: "All collections", href: "/products" },
    ],
  },
  {
    title: "Collections",
    links: [
      { label: "Wedding dresses", href: "/products" },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer id="contacts" className="site-footer scroll-panel">
      <div className="footer-main">
        <div className="footer-directory">
          {groups.map((group) => (
            <details className="footer-group" key={group.title}>
              <summary>{group.title}<span aria-hidden="true">+</span></summary>
              <ul>
                {group.links.map((link) => (
                  <li key={link.href}><Link href={link.href}>{link.label}</Link></li>
                ))}
              </ul>
            </details>
          ))}
          <details className="footer-group">
            <summary>Get in touch<span aria-hidden="true">+</span></summary>
            <Link href="/contact">Contact Atelier ↗</Link>
            <p className="footer-muted">Contact details coming soon.</p>
          </details>
          <details className="footer-group">
            <summary>Follow along<span aria-hidden="true">+</span></summary>
            <p className="footer-muted">Social links coming soon.</p>
          </details>
        </div>

        <section className="footer-invitations" aria-labelledby="footer-invitations-title">
          <h2 id="footer-invitations-title">Stay inspired</h2>
          <p>New collections, stories and inspiration, delivered to your inbox.</p>
          <div className="footer-signup" aria-describedby="footer-signup-note">
            <label htmlFor="footer-email">Your email</label>
            <div className="footer-email-row">
              <input id="footer-email" type="email" placeholder="E-mail" disabled />
              <button type="button" disabled aria-label="Newsletter coming soon">→</button>
            </div>
          </div>
          <p className="footer-note" id="footer-signup-note">Newsletter sign-up is not available yet.</p>
        </section>
        <BrideAnimation />
      </div>

      <div className="footer-bottom">
        <Link className="footer-wordmark" href="/#home" aria-label="Atelier — home">Atelier</Link>
        <span className="footer-copyright">© 2026 Atelier</span>
        <a className="footer-back-top" href="#home">Back to top <span aria-hidden="true">↑</span></a>
      </div>
    </footer>
  );
}
