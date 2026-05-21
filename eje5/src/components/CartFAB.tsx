"use client";

import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart";

export default function CartFAB() {
  const { totalItems, openCart } = useCartStore();
  const count = totalItems();

  return (
    <button
      onClick={openCart}
      aria-label={`Abrir carrito${count > 0 ? ` — ${count} artículo${count !== 1 ? "s" : ""}` : ""}`}
      className="fixed bottom-6 right-6 z-30 w-14 h-14 bg-[#8B6355] text-[#FAF8F5] rounded-full shadow-lg hover:bg-[#7A5449] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center"
    >
      <ShoppingBag size={22} />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#2C1810] text-[#FAF8F5] text-[10px] font-bold rounded-full flex items-center justify-center">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </button>
  );
}
