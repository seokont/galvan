"use client";

import { useEffect, useRef } from "react";

export default function PageLoader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.hidden = false;
    delete root.dataset.leaving;

    const video = document.querySelector("video");
    const counter = root.querySelector<HTMLElement>(".page-loader__number")!;
    const bar = root.querySelector<HTMLElement>(".page-loader__progress")!;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    let cancelled = false;
    let finishing = false;
    let fontsReady = !document.fonts;
    let videoReady = !video || video.readyState >= 2;
    let progress = 0;
    let closeTimer: ReturnType<typeof setTimeout> | undefined;
    const started = performance.now();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function unlock() {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    }

    function update(value: number) {
      counter.textContent = String(Math.floor(value)).padStart(2, "0");
      bar.style.setProperty("--loader-progress", String(value / 100));
      bar.setAttribute("aria-valuenow", String(Math.floor(value)));
    }

    function finish() {
      if (finishing || cancelled) return;
      finishing = true;
      update(100);
      closeTimer = setTimeout(() => {
        root!.dataset.leaving = "true";
        closeTimer = setTimeout(() => {
          const restoreFocus = root!.contains(document.activeElement);
          root!.hidden = true;
          unlock();
          if (restoreFocus) document.querySelector<HTMLAnchorElement>(".site-wordmark")?.focus({ preventScroll: true });
        }, reducedMotion ? 0 : 700);
      }, reducedMotion ? 0 : 300);
    }

    function markVideoReady() { videoReady = true; }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") finish();
      if (event.key === "Tab") {
        event.preventDefault();
        root!.querySelector<HTMLButtonElement>("button")?.focus();
      }
    }
    skipRef.current = finish;
    video?.addEventListener("loadeddata", markVideoReady);
    video?.addEventListener("error", markVideoReady, true);
    document.addEventListener("keydown", onKeyDown);
    document.fonts?.ready.then(() => { if (!cancelled) fontsReady = true; });

    const timer = setInterval(() => {
      if (finishing) return;
      const elapsed = performance.now() - started;
      const ready = (fontsReady && videoReady && elapsed >= 2000) || elapsed >= 8000;
      progress = ready ? Math.min(100, progress + 6) : Math.min(92, progress + (94 - progress) * 0.055);
      update(progress);
      if (progress >= 100) finish();
    }, 50);

    return () => {
      cancelled = true;
      clearInterval(timer);
      clearTimeout(closeTimer);
      video?.removeEventListener("loadeddata", markVideoReady);
      video?.removeEventListener("error", markVideoReady, true);
      document.removeEventListener("keydown", onKeyDown);
      skipRef.current = null;
      unlock();
    };
  }, []);

  return (
    <div className="page-loader" ref={rootRef}>
      <div className="page-loader__top"><span>MEDINSKIY</span><span>Wedding films</span></div>
      <div className="page-loader__center">
        <span className="page-loader__eyebrow">Stories that stay</span>
        <div className="page-loader__count" aria-hidden="true">
          <span className="page-loader__number">00</span><span className="page-loader__percent">%</span>
        </div>
        <div className="page-loader__progress" role="progressbar" aria-label="Preparing your experience"
          aria-valuemin={0} aria-valuemax={100} aria-valuenow={0}><span /></div>
        <p className="page-loader__caption">A moment before your story</p>
      </div>
      <div className="page-loader__bottom"><span>With love for every detail</span>
        <button type="button" onClick={() => skipRef.current?.()}>Skip intro ↗</button>
      </div>
      <noscript><style>{".page-loader { display: none !important; }"}</style></noscript>
    </div>
  );
}
