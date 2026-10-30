"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import models from "../models.json";

const categories = ["All dresses", "A-Line", "Fit-n-flare", "Princess"];

export default function ProductCatalog() {
  const [category, setCategory] = useState("All dresses");
  const filtered = models.filter((model) => category === "All dresses" || model.category === category);

  return (
    <>
      <div className="catalog-intro">
        <p className="catalog-eyebrow">The bridal edit</p>
        <h1>Wedding dresses</h1>
        <p>Find the silhouette that feels like you.</p>
      </div>
      <div className="catalog-toolbar">
        <div className="catalog-filters" role="group" aria-label="Filter dresses by silhouette">
          {categories.map((item) => (
            <button key={item} type="button" aria-pressed={category === item}
              onClick={() => setCategory(item)}>
              {item}<span>{item === "All dresses" ? models.length : models.filter((model) => model.category === item).length}</span>
            </button>
          ))}
        </div>
        <p className="catalog-count" role="status" aria-live="polite">{filtered.length} dresses</p>
      </div>
      <section className="catalog-grid" aria-label={`${category} collection`}>
        {filtered.map((model, index) => {
          const [code, ...name] = model.name.split(" ");
          return (
            <Link className="catalog-card" key={model.file} href={`/products/${model.file.replace(".jpg", "")}`}
              aria-label={`${name.join(" ")}, ${model.category}. View dress`}>
              <Image src={`/assets/models/${model.file}`} alt={`${model.name} wedding dress`}
                fill sizes="(max-width: 600px) 50vw, (max-width: 1024px) 33vw, 25vw"
                loading={index < 4 ? "eager" : "lazy"} />
              <div className="catalog-card__copy">
                <span className="catalog-card__code">{code} · {model.category}</span>
                <h2>{name.join(" ")}</h2>
                <span className="catalog-card__action">View dress <span aria-hidden="true">↗</span></span>
              </div>
            </Link>
          );
        })}
      </section>
      <p className="catalog-source-note">Discover the collection, find your silhouette.</p>
    </>
  );
}
