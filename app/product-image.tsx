"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import BrideAnimation from "./bride-animation";

export default function ProductImage(props: ImageProps) {
  return <LoadingImage key={typeof props.src === "string" ? props.src : JSON.stringify(props.src)} {...props} />;
}

function LoadingImage({ onLoad, onError, ...props }: ImageProps) {
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const content = <>
    <Image {...props} alt={props.alt} onLoad={(event) => { setStatus("ready"); onLoad?.(event); }}
      onError={(event) => { setStatus("error"); onError?.(event); }} />
    {status !== "ready" && <span className="product-image-loader" role="status" aria-label={status === "loading" ? "Loading photograph" : "Photograph unavailable"}>
      {status === "loading" ? <BrideAnimation compact /> : <span>Photograph unavailable</span>}
    </span>}
  </>;
  return props.fill ? content : <span className="product-image-frame">{content}</span>;
}
