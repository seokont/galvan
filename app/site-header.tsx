"use client";

import { useEffect, useRef, useState } from "react";

export default function SiteHeader() {
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
    <header className="site-header" ref={headerRef}>
      <a className="site-wordmark" href="#home" inert={open} onClick={() => setOpen(false)}>
        MEDINSKIY<span>Wedding films</span>
      </a>
      <button className="menu-toggle" type="button" ref={buttonRef}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen(!open)}>
        <span /><span /><span />
      </button>
      <nav id="site-menu" className="site-nav" aria-label="Main navigation"
        data-open={open} aria-hidden={!open} inert={!open}>
        <a href="#home" aria-current="page" onClick={() => setOpen(false)}>Home</a>
        <a href="#about" onClick={() => setOpen(false)}>About</a>
        <a href="#contacts" onClick={() => setOpen(false)}>Contact</a>
      </nav>
    </header>
  );
}
