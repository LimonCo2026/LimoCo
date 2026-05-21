"use client";

import { useEffect } from "react";
import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { colorMap } from "@/lib/colors";

const WA_NUMBER = "524495394516";

function buildWhatsAppLink(items: ReturnType<typeof useCartStore.getState>["items"], total: number) {
  const lines = items.map(
    (i) =>
      `• ${i.product.name} — Talla ${i.size}, Color ${i.color} × ${i.quantity} — $${(i.product.price * i.quantity).toLocaleString()}`
  );
  const message = [
    "Hola! Me gustaría hacer el siguiente pedido en ÁUREA:",
    "",
    ...lines,
    "",
    `*Total: $${total.toLocaleString()}*`,
  ].join("\n");
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalItems, totalPrice } =
    useCartStore();
  const waLink = buildWhatsAppLink(items, totalPrice());

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeCart(); };
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeCart]);

  const count = totalItems();
  const total = totalPrice();

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-[#2C1810]/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-[#FAF8F5] shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Carrito de compras"
      >
        {/* Cabecera */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E8DDD6]">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-[#8B6355]" />
            <h2 className="font-display text-lg text-[#2C1810]">Carrito</h2>
            {count > 0 && (
              <span className="text-xs bg-[#8B6355] text-[#FAF8F5] rounded-full w-5 h-5 flex items-center justify-center">
                {count}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="p-2 text-[#6B5A52] hover:text-[#2C1810] hover:bg-[#F5F0EA] rounded-full transition-colors"
            aria-label="Cerrar carrito"
          >
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <ShoppingBag size={48} className="text-[#E8DDD6]" />
              <p className="text-sm text-[#9E8F80]">Tu carrito está vacío.</p>
              <button
                onClick={closeCart}
                className="text-xs tracking-[0.2em] uppercase text-[#8B6355] underline underline-offset-4 hover:text-[#6B5A52] transition-colors"
              >
                Ver colección
              </button>
            </div>
          ) : (
            <ul className="space-y-5">
              {items.map((item, idx) => (
                <li key={idx} className="flex gap-4 pb-5 border-b border-[#F0E8E0] last:border-0">
                  {/* Miniatura */}
                  <div
                    className="w-20 h-24 flex-shrink-0 flex items-center justify-center"
                    style={{ backgroundColor: item.product.placeholderBg }}
                  >
                    <span
                      className="font-display text-3xl font-bold select-none"
                      style={{ color: item.product.placeholderColor }}
                    >
                      {item.product.name.charAt(0)}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs tracking-[0.15em] uppercase text-[#8B6355] mb-0.5">
                      {item.product.subcategory}
                    </p>
                    <p className="text-sm font-medium text-[#2C1810] truncate mb-1">
                      {item.product.name}
                    </p>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs text-[#6B5A52]">{item.size}</span>
                      <span className="text-[#E8DDD6]">·</span>
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-[#E8DDD6] inline-block"
                        style={{ backgroundColor: colorMap[item.color] ?? "#E0E0E0" }}
                        title={item.color}
                      />
                      <span className="text-xs text-[#6B5A52]">{item.color}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Cantidad */}
                      <div className="flex items-center border border-[#E8DDD6]">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.size, item.color, -1)}
                          className="px-2 py-1 text-[#6B5A52] hover:text-[#2C1810] hover:bg-[#F5F0EA] transition-colors"
                          aria-label="Reducir cantidad"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-3 text-sm text-[#2C1810] min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.size, item.color, 1)}
                          className="px-2 py-1 text-[#6B5A52] hover:text-[#2C1810] hover:bg-[#F5F0EA] transition-colors"
                          aria-label="Aumentar cantidad"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-sm text-[#2C1810] font-medium">
                          ${(item.product.price * item.quantity).toLocaleString()}
                        </span>
                        <button
                          onClick={() => removeItem(item.product.id, item.size, item.color)}
                          className="text-[#C4A898] hover:text-[#8B6355] transition-colors"
                          aria-label="Eliminar producto"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer con total */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-[#E8DDD6] bg-[#FAF8F5]">
            <div className="flex items-center justify-between mb-5">
              <span className="text-sm text-[#6B5A52]">Total</span>
              <span className="font-display text-xl text-[#2C1810]">
                ${total.toLocaleString()}
              </span>
            </div>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-4 bg-[#25D366] text-white text-xs tracking-[0.2em] uppercase font-medium text-center hover:bg-[#1ebe5c] transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Pedir por WhatsApp
            </a>
            <button
              onClick={closeCart}
              className="block w-full py-3 mt-2 text-xs tracking-[0.2em] uppercase text-[#6B5A52] hover:text-[#2C1810] transition-colors"
            >
              Seguir comprando
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
