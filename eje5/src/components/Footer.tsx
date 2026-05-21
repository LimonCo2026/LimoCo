import { Separator } from "@/components/ui/separator";

const footerLinks = [
  { label: "Colección", href: "#catalogo" },
  { label: "Mujer", href: "#catalogo" },
  { label: "Hombre", href: "#catalogo" },
  { label: "Accesorios", href: "#catalogo" },
  { label: "Nosotros", href: "#nosotros" },
];

export default function Footer() {
  return (
    <footer className="bg-[#2C1810] text-[#D4C3A0] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-3 gap-12 mb-16">

          {/* Marca */}
          <div>
            <span className="font-display text-3xl font-bold tracking-[0.2em] text-[#F5F0EA] block mb-4">
              ÁUREA
            </span>
            <p className="text-sm text-[#9E8F80] leading-relaxed max-w-xs">
              Moda contemporánea para quienes buscan piezas con carácter.
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href="#"
                aria-label="Instagram de ÁUREA"
                className="text-[#9E8F80] hover:text-[#D4C3A0] transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                </svg>
              </a>
              <a
                href="#"
                aria-label="Facebook de ÁUREA"
                className="text-[#9E8F80] hover:text-[#D4C3A0] transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-xs tracking-[0.25em] uppercase text-[#9E8F80] mb-6">
              Colección
            </h3>
            <nav>
              <ul className="space-y-3">
                {footerLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-[#D4C3A0] hover:text-[#F5F0EA] transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-xs tracking-[0.25em] uppercase text-[#9E8F80] mb-6">
              Contacto
            </h3>
            <p className="text-sm text-[#D4C3A0] mb-2">¿Dudas? Escríbenos:</p>
            <a
              href="mailto:hola@aurea.mx"
              className="text-sm text-[#8B6355] hover:text-[#D4C3A0] transition-colors"
            >
              hola@aurea.mx
            </a>
          </div>

        </div>

        <Separator className="bg-[#3D2820] mb-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6B5A52]">
          <span>© 2025 ÁUREA. Todos los derechos reservados.</span>
          <span>
            Hecho por LimonCo
          </span>
        </div>
      </div>
    </footer>
  );
}
