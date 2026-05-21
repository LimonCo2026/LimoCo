export default function BrandStory() {
  return (
    <section id="nosotros" className="py-24 bg-[#F5F0EA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Visual decorativo */}
          <div className="relative max-w-md">
            <div className="bg-[#DDD0C5] aspect-square relative">
              <div className="absolute inset-5 bg-[#E8DDD6] flex items-center justify-center">
                <span className="font-display text-8xl font-bold tracking-widest text-[#8B6355]/20 select-none">
                  Á
                </span>
              </div>
            </div>
            <div className="absolute -bottom-5 -right-5 w-28 h-28 bg-[#8B6355]" aria-hidden="true" />
          </div>

          {/* Texto */}
          <div>
            <span className="text-xs tracking-[0.35em] uppercase text-[#8B6355] block mb-5 font-medium">
              Sobre nosotros
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-[#2C1810] mb-6 leading-tight">
              Ropa que se queda.<br />
              No solo de paso.
            </h2>
            <p className="text-base text-[#6B5A52] leading-relaxed mb-4">
              Hacemos ropa que dura. No tendencias de una temporada. Cada pieza está pensada para
              que te la pongas una y otra vez sin cansarte.
            </p>
            <p className="text-base text-[#6B5A52] leading-relaxed mb-10">
              Materiales de calidad. Siluetas limpias. Colores que combinan solos. Eso es todo.
            </p>
            <a
              href="#catalogo"
              className="inline-flex items-center gap-2 text-sm tracking-[0.2em] uppercase text-[#8B6355] font-medium hover:text-[#6B5A52] transition-colors border-b border-[#8B6355] pb-1"
            >
              Ver la colección
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
