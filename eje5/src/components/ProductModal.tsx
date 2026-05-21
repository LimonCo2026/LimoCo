"use client";

import { useState, useEffect } from "react";
import { X, ShoppingBag } from "lucide-react";
import type { Product } from "@/data/products";
import { colorMap } from "@/lib/colors";
import { useCartStore } from "@/store/cart";

interface Props {
  product: Product | null;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: Props) {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [added, setAdded] = useState(false);
  const { addItem, openCart } = useCartStore();

  useEffect(() => {
    if (product) {
      setSelectedSize("");
      setSelectedColor("");
      setAdded(false);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [product]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!product) return null;

  const canAdd = selectedSize && selectedColor;

  const handleAdd = () => {
    if (!canAdd) return;
    addItem(product, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => {
      onClose();
      openCart();
    }, 800);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C1810]/60 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={product.name}
    >
      <div
        className="bg-[#FAF8F5] w-full max-w-3xl max-h-[92vh] overflow-y-auto relative shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-[#6B5A52] hover:text-[#2C1810] hover:bg-[#F5F0EA] rounded-full transition-colors"
          aria-label="Cerrar"
        >
          <X size={20} />
        </button>

        <div className="grid md:grid-cols-2">
          {/* Imagen placeholder */}
          <div
            className="flex items-center justify-center"
            style={{ aspectRatio: "4/5", backgroundColor: product.placeholderBg }}
          >
            <span
              className="font-display font-bold select-none"
              style={{ fontSize: "clamp(4rem, 15vw, 10rem)", color: product.placeholderColor }}
            >
              {product.name.charAt(0)}
            </span>
          </div>

          {/* Detalles */}
          <div className="p-8 flex flex-col">
            <span className="text-xs tracking-[0.25em] uppercase text-[#8B6355] mb-2">
              {product.subcategory}
            </span>
            <h2 className="font-display text-3xl text-[#2C1810] mb-3 leading-tight">
              {product.name}
            </h2>
            <p className="text-2xl text-[#6B5A52] font-medium mb-5">
              ${product.price.toLocaleString()}
            </p>
            <p className="text-sm text-[#6B5A52] leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Tallas */}
            <div className="mb-6">
              <p className="text-xs tracking-[0.2em] uppercase text-[#2C1810] mb-3 font-medium">
                Talla
              </p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 text-sm border transition-all duration-150 ${
                      selectedSize === size
                        ? "border-[#8B6355] bg-[#8B6355] text-[#FAF8F5]"
                        : "border-[#E8DDD6] text-[#6B5A52] hover:border-[#8B6355] hover:text-[#2C1810]"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Colores */}
            <div className="mb-8">
              <p className="text-xs tracking-[0.2em] uppercase text-[#2C1810] mb-3 font-medium">
                Color{" "}
                {selectedColor && (
                  <span className="normal-case tracking-normal text-[#6B5A52] font-normal">
                    — {selectedColor}
                  </span>
                )}
              </p>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-9 h-9 rounded-full border-2 transition-all duration-150 ${
                      selectedColor === color
                        ? "border-[#8B6355] scale-110 shadow-sm"
                        : "border-[#E8DDD6] hover:border-[#C4A898]"
                    }`}
                    style={{ backgroundColor: colorMap[color] ?? "#E0E0E0" }}
                    aria-label={color}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {!canAdd && (
              <p className="text-xs text-[#9E8F80] mb-4">
                Selecciona talla y color para continuar.
              </p>
            )}

            <button
              onClick={handleAdd}
              disabled={!canAdd}
              className="mt-auto w-full py-4 bg-[#8B6355] text-[#FAF8F5] text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#7A5449] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <ShoppingBag size={16} />
              {added ? "¡Agregado al carrito!" : "Agregar al carrito"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
