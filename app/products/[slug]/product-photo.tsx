"use client";

import Image from "next/image";
import { useEffect, useRef, type PointerEvent } from "react";

type Props = { src: string; name: string; index: number; onOpen: () => void };

export default function ProductPhoto({ src, name, index, onOpen }: Props) {
  const rootRef = useRef<HTMLButtonElement>(null);
  const lensRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    function hide() { if (rootRef.current) rootRef.current.dataset.magnifying = "false"; }
    window.addEventListener("scroll", hide, true);
    window.addEventListener("blur", hide);
    return () => {
      window.removeEventListener("scroll", hide, true);
      window.removeEventListener("blur", hide);
    };
  }, []);

  function move(event: PointerEvent<HTMLButtonElement>) {
    const root = event.currentTarget;
    const lens = lensRef.current;
    const image = root.querySelector("img");
    if (event.pointerType !== "mouse" || !window.matchMedia("(hover: hover) and (pointer: fine)").matches || !lens || !image?.naturalWidth) return;
    const rect = root.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, event.clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, event.clientY - rect.top));
    const diameter = Math.min(190, rect.width * 0.52);
    const radius = diameter / 2;
    const zoom = 2.5;
    const scale = Math.max(rect.width / image.naturalWidth, rect.height / image.naturalHeight);
    const width = image.naturalWidth * scale;
    const height = image.naturalHeight * scale;
    const cropX = (width - rect.width) / 2;
    const cropY = (height - rect.height) / 2;
    lens.style.width = `${diameter}px`;
    lens.style.height = `${diameter}px`;
    lens.style.transform = `translate3d(${Math.max(0, Math.min(rect.width - diameter, x - radius))}px, ${Math.max(0, Math.min(rect.height - diameter, y - radius))}px, 0)`;
    lens.style.backgroundImage = `url("${src}")`;
    lens.style.backgroundSize = `${width * zoom}px ${height * zoom}px`;
    lens.style.backgroundPosition = `${radius - (x + cropX) * zoom}px ${radius - (y + cropY) * zoom}px`;
    root.dataset.magnifying = "true";
  }

  function hide() { if (rootRef.current) rootRef.current.dataset.magnifying = "false"; }

  return (
    <button className="product-gallery__photo" ref={rootRef} type="button"
      aria-label={`Enlarge photo ${index + 1} of ${name}`} onClick={() => { hide(); onOpen(); }}
      onPointerMove={move} onPointerLeave={hide} onPointerCancel={hide} onBlur={hide}>
      <Image src={src} alt={`${name} wedding dress, view ${index + 1}`} fill
        sizes="(max-width: 900px) 100vw, 29vw" preload={index === 0} loading={index < 2 ? "eager" : "lazy"} />
      <span className="product-magnifier" ref={lensRef} aria-hidden="true"><span>2.5×</span></span>
      <span className="product-zoom-label" aria-hidden="true">＋</span>
    </button>
  );
}
