"use client";

import { useEffect, useRef, type ReactNode } from "react";

export default function FooterMotion({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const groups = [...root.querySelectorAll<HTMLElement>(".footer-group")];
    const animations = new Set<Animation>();
    const revealed = new Set<Element>();

    function track(animation: Animation) {
      animations.add(animation);
      animation.finished.then(() => { animations.delete(animation); animation.cancel(); }, () => { animations.delete(animation); });
    }

    function reveal(group: Element, columnDelay = 0) {
      if (reduced.matches || group.contains(document.activeElement)) return;
      const items = [...group.querySelectorAll("a")];
      items.forEach((item, index) => {
        track(item.animate([{ opacity: 0, translate: "0 24px" }, { opacity: 1, translate: "0 0" }], {
          duration: 700, delay: columnDelay + index * 70,
          easing: "cubic-bezier(.25,.46,.45,.94)", fill: "both",
        }));
      });
    }

    const observer = new IntersectionObserver((entries) => {
      entries.filter((entry) => entry.isIntersecting && !revealed.has(entry.target))
        .sort((a, b) => groups.indexOf(a.target as HTMLElement) - groups.indexOf(b.target as HTMLElement))
        .forEach((entry, index) => {
          revealed.add(entry.target);
          observer.unobserve(entry.target);
          reveal(entry.target, index * 140);
        });
    }, { threshold: 0, rootMargin: "0px 0px -6% 0px" });
    groups.forEach((group) => observer.observe(group));

    function onToggle(event: Event) {
      const group = event.target;
      if (group instanceof HTMLDetailsElement && group.open) reveal(group);
    }
    function onFocus() {
      animations.forEach((animation) => { animation.finish(); });
    }
    function onMotionChange() {
      if (reduced.matches) { animations.forEach((animation) => animation.cancel()); }
    }
    root.addEventListener("focusin", onFocus);
    root.addEventListener("toggle", onToggle, true);
    reduced.addEventListener("change", onMotionChange);
    return () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
     
      root.removeEventListener("focusin", onFocus);
      root.removeEventListener("toggle", onToggle, true);
      reduced.removeEventListener("change", onMotionChange);
    };
  }, []);

  return <footer id="contacts" className="site-footer scroll-panel" ref={rootRef}>{children}</footer>;
}
