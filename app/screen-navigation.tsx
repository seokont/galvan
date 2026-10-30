"use client";

import { useEffect, useRef, useState } from "react";

const screens = ["Home", "Collections", "About", "Contact"];

export default function ScreenNavigation() {
  const [active, setActive] = useState(0);
  const navigate = useRef<(index: number) => void>(() => {});

  useEffect(() => {
    const anchors = [document.querySelector("#home"), document.querySelector("#collections"), document.querySelector("#about"), document.querySelector("#footer-start")] as HTMLElement[];
    if (anchors.some((anchor) => !anchor)) return;
    const panels = [...document.querySelectorAll<HTMLElement>(".scroll-panel")];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const nativeScroll = window.matchMedia("(max-width: 1024px), (pointer: coarse)");
    let frame = 0;
    let busy = false;
    let wheelAmount = 0;
    let lastWheel = 0;
    let touchY = 0;
    let touchX = 0;
    let swipe = false;
    const positions = () => anchors.map((anchor) => anchor === anchors[0] ? 0 : anchor.offsetTop);
    const current = () => positions().reduce((best, position, index, all) => Math.abs(position - scrollY) < Math.abs(all[best] - scrollY) ? index : best, 0);
    const blocked = () => document.body.style.overflow === "hidden";

    function go(index: number) {
      if (blocked()) return;
      const targetIndex = Math.max(0, Math.min(screens.length - 1, index));
      const from = scrollY;
      const to = positions()[targetIndex];
      cancelAnimationFrame(frame);
      setActive(targetIndex);
      busy = true;
      const start = performance.now();
      function tick(now: number) {
        const t = reduced.matches ? 1 : Math.min(1, (now - start) / 1000);
        const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        window.scrollTo({ top: from + (to - from) * eased, behavior: "instant" });
        if (t < 1) frame = requestAnimationFrame(tick);
        else { busy = false; wheelAmount = 0; }
      }
      frame = requestAnimationFrame(tick);
    }
    navigate.current = go;

    function canScrollWithinPanel(direction: number) {
      const i = current();
      const top = positions()[i];
      const bottom = top + panels[i].offsetHeight - innerHeight;
      return bottom > top + 2 && (direction > 0 ? scrollY < bottom - 2 : scrollY > top + 2);
    }

    function onWheel(event: WheelEvent) {
      if (nativeScroll.matches) return;
      if (blocked() || event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      if (!busy && canScrollWithinPanel(Math.sign(event.deltaY))) return;
      event.preventDefault();
      const now = performance.now();
      const quiet = now - lastWheel > 180;
      lastWheel = now;
      if (busy) return;
      if (quiet || Math.sign(wheelAmount) !== Math.sign(event.deltaY)) wheelAmount = 0;
      wheelAmount += event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1);
      if (Math.abs(wheelAmount) >= 40) go(current() + Math.sign(wheelAmount));
    }

    function onKey(event: KeyboardEvent) {
      if (nativeScroll.matches) return;
      if (blocked() || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.target instanceof Element && event.target.closest("input, textarea, select, button, summary, [contenteditable='true']")) return;
      const direction = ["ArrowDown", "PageDown", " "].includes(event.key) ? (event.shiftKey ? -1 : 1) : ["ArrowUp", "PageUp"].includes(event.key) ? -1 : 0;
      if (!direction && event.key !== "Home" && event.key !== "End") return;
      if (direction && canScrollWithinPanel(direction)) return;
      event.preventDefault();
      if (!busy) go(event.key === "Home" ? 0 : event.key === "End" ? screens.length - 1 : current() + direction);
    }

    function onClick(event: MouseEvent) {
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href^="#"]') : null;
      const hash = link?.getAttribute("href");
      const index = hash === "#home" ? 0 : hash === "#collections" ? 1 : hash === "#about" ? 2 : hash === "#contacts" ? 3 : -1;
      if (index < 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      // Let the menu release its scroll lock before moving to the selected screen.
      requestAnimationFrame(() => go(index));
    }

    function onTouchStart(event: TouchEvent) {
      if (event.touches.length !== 1) return;
      touchY = event.touches[0].clientY;
      touchX = event.touches[0].clientX;
      swipe = false;
    }
    function onTouchMove(event: TouchEvent) {
      if (nativeScroll.matches) return;
      if (blocked() || event.touches.length !== 1) return;
      const dy = touchY - event.touches[0].clientY;
      const dx = touchX - event.touches[0].clientX;
      if (Math.abs(dy) < 8 || Math.abs(dx) > Math.abs(dy) || (!busy && canScrollWithinPanel(Math.sign(dy)))) return;
      event.preventDefault();
      swipe = true;
    }
    function onTouchEnd(event: TouchEvent) {
      if (nativeScroll.matches) return;
      if (!swipe || busy || blocked()) return;
      const delta = touchY - event.changedTouches[0].clientY;
      if (Math.abs(delta) > 45) go(current() + Math.sign(delta));
      swipe = false;
    }

    function onScroll() {
      if (busy) return;
      const index = nativeScroll.matches
        ? positions().reduce((found, top, i) => top <= scrollY + innerHeight * 0.35 ? i : found, 0)
        : current();
      setActive(index);
    }
    window.addEventListener("wheel", onWheel, { passive: false });
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchmove", onTouchMove, { passive: false });
    document.addEventListener("touchend", onTouchEnd);
    window.addEventListener("scroll", onScroll, { passive: true });
    const initial = requestAnimationFrame(onScroll);
    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(initial);
      window.removeEventListener("wheel", onWheel);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("scroll", onScroll);
      navigate.current = () => {};
    };
  }, []);

  return (
    <nav className="screen-navigation" aria-label="Page sections" data-screen={active}>
      {screens.map((label, index) => (
        <button key={label} type="button" aria-label={`Go to ${label.toLowerCase()}`}
          aria-current={active === index ? "step" : undefined} onClick={() => navigate.current(index)}>
          <span className="screen-navigation__label">{label}</span>
          <span className="screen-navigation__dot" />
        </button>
      ))}
    </nav>
  );
}
