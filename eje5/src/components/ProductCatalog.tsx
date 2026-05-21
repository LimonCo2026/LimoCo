"use client";

import { useState } from "react";
import { products } from "@/data/products";
import type { Product } from "@/data/products";
import { colorMap } from "@/lib/colors";
import ProductModal from "@/components/ProductModal";

const filters = [
  { id: "todos", label: "Todos" },
  { id: "mujer", label: "Mujer" },
  { id: "hombre", label: "Hombre" },
  { id: "accesorios", label: "Accesorios" },
];

function ProductCard({ product, onClick }: { product: Product; onClick: () => void }) {
  return (
    <article className="group cursor-pointer" onClick={onClick}>
      <div
        className="relative overflow-hidden mb-3 transition-transform duration-300 group-hover:-translate-y-1"
        style={{ aspectRatio: "4/5", backgroundColor: product.placeholderBg }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="font-display text-6xl font-bold select-none"
            style={{ color: product.placeholderColor }}
          >
            {product.name.charAt(0)}
          </span>
        </div>
        <div className="absolute inset-0 bg-[#2C1810]/0 group-hover:bg-[#2C1810]/10 transition-colors duration-300" />
        <div className="absolute bottom-3 left-3 right-3 py-3 bg-[#FAF8F5] text-[#2C1810] text-xs tracking-[0.2em] uppercase font-medium text-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          Ver detalles
        </div>
      </div>

      <div className="px-1">
        <p className="text-xs tracking-[0.2em] uppercase text-[#8B6355] mb-1">
          {product.subcategory}
        </p>
        <h3 className="text-sm font-medium text-[#2C1810] mb-2">{product.name}</h3>
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#6B5A52]">${product.price.toLocaleString()}</span>
          <div className="flex items-center gap-1">
            {product.colors.slice(0, 3).map((color) => (
              <span
                key={color}
                className="w-3 h-3 rounded-full border border-[#E8DDD6]"
                style={{ backgroundColor: colorMap[color] ?? "#E0E0E0" }}
                title={color}
                aria-label={color}
              />
            ))}
            {product.colors.length > 3 && (
              <span className="text-xs text-[#9E9E9E] ml-0.5">
                +{product.colors.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function ProductCatalog() {
  const [activeFilter, setActiveFilter] = useState<string>("todos");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filtered =
    activeFilter === "todos"
      ? products
      : products.filter((p) => p.category === activeFilter);

  return (
    <>
      <section id="catalogo" className="py-20 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
            <h2 className="font-display text-3xl sm:text-4xl text-[#2C1810]">Colección</h2>
            <div className="flex gap-2 flex-wrap" role="group" aria-label="Filtrar por categoría">
              {filters.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  aria-pressed={activeFilter === f.id}
                  className={`px-5 py-2 text-xs tracking-[0.2em] uppercase transition-all duration-200 ${
                    activeFilter === f.id
                      ? "bg-[#8B6355] text-[#FAF8F5]"
                      : "bg-transparent border border-[#E8DDD6] text-[#6B5A52] hover:border-[#8B6355] hover:text-[#8B6355]"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => setSelectedProduct(product)}
              />
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-[#6B5A52] py-20">No se encontraron productos.</p>
          )}
        </div>
      </section>

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  );
}
