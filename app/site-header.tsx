"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function SiteHeader({ catalog = false, contact = false, about = false, login = false, editorial = false }: { catalog?: boolean; contact?: boolean; about?: boolean; login?: boolean; editorial?: boolean }) {
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
      if (event.key === "Tab") {
        const links = headerRef.current?.querySelectorAll<HTMLAnchorElement>("nav a");
        const lastLink = links?.[links.length - 1];
        if (event.shiftKey && document.activeElement === buttonRef.current) {
          event.preventDefault();
          lastLink?.focus();
        } else if (!event.shiftKey && document.activeElement === lastLink) {
          event.preventDefault();
          buttonRef.current?.focus();
        }
      }
    }
    function onPointerDown(event: PointerEvent) {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <header className={editorial ? 'site-header site-header--editorial' : 'site-header'} ref={headerRef}>
      <a className="site-wordmark" href={catalog ? "/#home" : "#home"} inert={open} onClick={() => setOpen(false)}>
        Atelier<span>{editorial ? 'Bridal studio' : 'Wedding films'}</span>
      </a>
      <Link className="header-account" href={editorial ? '/products' : '/admin/login'} aria-label={editorial ? 'Explore bridal collections' : 'Sign in to Atelier admin'} aria-current={login ? "page" : undefined} inert={open}>
        {editorial ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1"/><path d="m15.3 15.3 5 5" stroke="currentColor" strokeWidth="1"/></svg> : <svg width="21" height="23" viewBox="0 0 24 26" fill="none" aria-hidden="true"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.3" /><path d="M4 24v-3a8 8 0 0 1 16 0v3" stroke="currentColor" strokeWidth="1.3" /></svg>}
      </Link>
      <button className="menu-toggle" type="button" ref={buttonRef}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen(!open)}>
        <span /><span /><span />
        {editorial && <svg className="menu-ring" viewBox="0 0 100 100" aria-hidden="true"><defs><path id="atelier-menu-circle" d="M50,50 m-40,0 a40,40 0 1,1 80,0 a40,40 0 1,1 -80,0" /></defs><text><textPath href="#atelier-menu-circle">ATELIER · BRIDAL STUDIO · ATELIER · BRIDAL STUDIO · </textPath></text></svg>}
      </button>
      <nav id="site-menu" className="site-nav" aria-label="Main navigation"
        data-open={open} aria-hidden={!open} inert={!open}>
        <a href={catalog ? "/#home" : "#home"} aria-current={!catalog ? "page" : undefined} onClick={() => setOpen(false)}>Home</a>
        <Link href="/products" aria-current={catalog && !contact && !about && !login ? "page" : undefined} onClick={() => setOpen(false)}>Collections</Link>
        <Link href="/about" aria-current={about ? "page" : undefined} onClick={() => setOpen(false)}>About</Link>
        <Link href="/contact" aria-current={contact ? "page" : undefined} onClick={() => setOpen(false)}>Contact</Link>
        <Link href="/admin/login" aria-current={login ? "page" : undefined} onClick={() => setOpen(false)}>Admin sign in</Link>
      </nav>
    </header>
  );
}
