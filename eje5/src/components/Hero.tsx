export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-[55%_45%] gap-12 lg:gap-8 items-center min-h-[75vh]">

          {/* Contenido */}
          <div className="flex flex-col justify-center order-2 lg:order-1">
            <span className="text-xs tracking-[0.35em] uppercase text-[#8B6355] mb-8 font-medium block">
              Colección 2025
            </span>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-[#2C1810] leading-[1.05] mb-8">
              Piezas que<br />
              <em>hablan</em><br />
              por ti.
            </h1>
            <p className="text-lg text-[#6B5A52] max-w-md leading-relaxed mb-10">
              Ropa y accesorios pensados para el día a día. Sin excesos, con carácter.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#catalogo"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#8B6355] text-[#FAF8F5] text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#7A5449] transition-colors duration-200"
              >
                Ver colección
              </a>
              <a
                href="#categorias"
                className="inline-flex items-center justify-center px-8 py-4 border border-[#8B6355] text-[#8B6355] text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#F5F0EA] transition-colors duration-200"
              >
                Categorías
              </a>
            </div>
          </div>

          {/* Visual editorial */}
          <div className="order-1 lg:order-2">
            <div className="grid grid-cols-2 gap-3 max-w-md mx-auto lg:max-w-none">
              {/* Columna izquierda: imagen vertical */}
              <div className="relative overflow-hidden bg-[#E0D5CC]" style={{ aspectRatio: "3/4" }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-display text-5xl text-[#8B6355]/20 select-none">M</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#2C1810]/50 to-transparent">
                  <span className="text-xs tracking-[0.25em] uppercase text-white font-medium">
                    Mujer
                  </span>
                </div>
              </div>

              {/* Columna derecha: dos cuadrados */}
              <div className="flex flex-col gap-3">
                <div className="relative overflow-hidden bg-[#D5C8BE]" style={{ aspectRatio: "1/1" }}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-display text-4xl text-[#8B6355]/20 select-none">H</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-[#2C1810]/50 to-transparent">
                    <span className="text-xs tracking-[0.25em] uppercase text-white font-medium">
                      Hombre
                    </span>
                  </div>
                </div>
                <div className="relative overflow-hidden bg-[#C9BAB0]" style={{ aspectRatio: "1/1" }}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-display text-4xl text-[#8B6355]/20 select-none">A</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-[#2C1810]/50 to-transparent">
                    <span className="text-xs tracking-[0.25em] uppercase text-white font-medium">
                      Accesorios
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-[#E8DDD6]" />
    </section>
  );
}
