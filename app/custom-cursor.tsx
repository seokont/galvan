"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    const cursor = cursorRef.current;
    if (!cursor) return;
    const dot = cursor.querySelector<HTMLElement>(".custom-cursor__dot")!;
    const ring = cursor.querySelector<HTMLElement>(".custom-cursor__ring")!;
    let frame = 0;
    let active = false;
    let targetX = 0;
    let targetY = 0;
    let ringX = 0;
    let ringY = 0;

    function draw() {
      ringX += (targetX - ringX) * 0.18;
      ringY += (targetY - ringY) * 0.18;
      dot.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      frame = Math.abs(targetX - ringX) + Math.abs(targetY - ringY) > 0.1
        ? requestAnimationFrame(draw) : 0;
    }

    function hide() {
      active = false;
      document.documentElement.classList.remove("has-custom-cursor");
      cursor!.dataset.visible = "false";
      cancelAnimationFrame(frame);
      frame = 0;
    }

    function move(event: PointerEvent) {
      if (event.target instanceof Element && event.target.closest('[data-magnifying="true"]')) {
        hide();
        return;
      }
      if (!media.matches || event.pointerType !== "mouse") {
        hide();
        return;
      }
      targetX = event.clientX;
      targetY = event.clientY;
      if (!active) {
        ringX = targetX;
        ringY = targetY;
        active = true;
        document.documentElement.classList.add("has-custom-cursor");
        cursor!.dataset.visible = "true";
      }
      const element = event.target instanceof Element ? event.target : null;
      cursor!.dataset.mode = element?.closest("a, button, input, select, textarea, [role='button']")
        ? "link" : element?.closest(".photo-grid__item, .catalog-card") ? "card" : "default";
      if (!frame) frame = requestAnimationFrame(draw);
    }

    function press() { cursor!.dataset.pressed = "true"; }
    function release() { cursor!.dataset.pressed = "false"; }
    document.addEventListener("pointermove", move);
    document.documentElement.addEventListener("pointerleave", hide);
    document.addEventListener("pointerdown", press);
    document.addEventListener("pointerup", release);
    document.addEventListener("scroll", hide, { passive: true });
    document.addEventListener("keydown", hide);
    window.addEventListener("blur", hide);
    media.addEventListener("change", hide);
    return () => {
      hide();
      document.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", hide);
      document.removeEventListener("pointerdown", press);
      document.removeEventListener("pointerup", release);
      document.removeEventListener("scroll", hide);
      document.removeEventListener("keydown", hide);
      window.removeEventListener("blur", hide);
      media.removeEventListener("change", hide);
    };
  }, []);

  return (
    <div className="custom-cursor" ref={cursorRef} aria-hidden="true">
      <div className="custom-cursor__dot"><span /></div>
      <div className="custom-cursor__ring"><span>✧</span></div>
    </div>
  );
}
