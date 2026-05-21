import { ArrowRight } from "lucide-react";

const categories = [
  {
    id: "mujer",
    label: "Mujer",
    description: "Blusas, vestidos, pantalones y conjuntos.",
    count: 8,
    bg: "#F5F0EA",
  },
  {
    id: "hombre",
    label: "Hombre",
    description: "Camisas, pantalones y playeras.",
    count: 6,
    bg: "#E8DDD6",
  },
  {
    id: "accesorios",
    label: "Accesorios",
    description: "Cinturones, gorras y bolsas.",
    count: 4,
    bg: "#DDD0C5",
  },
];

export default function CategorySection() {
  return (
    <section id="categorias" className="py-20 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <h2 className="font-display text-3xl sm:text-4xl text-[#2C1810]">
            Categorías
          </h2>
          <a
            href="#catalogo"
            className="hidden sm:flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[#8B6355] hover:text-[#6B5A52] transition-colors"
          >
            Ver todo <ArrowRight size={14} />
          </a>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <a
              key={cat.id}
              href="#catalogo"
              className="group relative overflow-hidden p-8 flex flex-col justify-between min-h-[220px] transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-[#8B6355]"
              style={{ backgroundColor: cat.bg }}
            >
              <div>
                <span className="text-xs tracking-[0.2em] uppercase text-[#6B5A52] block mb-2">
                  {cat.count} piezas
                </span>
                <h3 className="font-display text-2xl text-[#2C1810] mb-3">
                  {cat.label}
                </h3>
                <p className="text-sm text-[#6B5A52] leading-relaxed">
                  {cat.description}
                </p>
              </div>
              <div className="flex items-center gap-2 mt-8 text-sm text-[#8B6355] font-medium">
                Explorar
                <ArrowRight
                  size={14}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
