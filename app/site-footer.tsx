const groups = [
  {
    title: "Explore",
    links: [
      { label: "Home", href: "#home" },
      { label: "All collections", href: "#collections" },
    ],
  },
  {
    title: "Collections",
    links: [
      { label: "Models 01–05", href: "#model-category-1" },
      { label: "Models 06–10", href: "#model-category-6" },
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
                  <li key={link.href}><a href={link.href}>{link.label}</a></li>
                ))}
              </ul>
            </details>
          ))}
          <details className="footer-group">
            <summary>Get in touch<span aria-hidden="true">+</span></summary>
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
      </div>

      <div className="footer-bottom">
        <a className="footer-wordmark" href="#home" aria-label="MEDINSKIY — home">MEDINSKIY</a>
        <span className="footer-copyright">© 2026 MEDINSKIY</span>
        <a className="footer-back-top" href="#home">Back to top <span aria-hidden="true">↑</span></a>
      </div>
    </footer>
  );
}
