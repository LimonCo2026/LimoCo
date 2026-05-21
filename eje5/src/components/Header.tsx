"use client";

import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const navLinks = [
  { href: "#catalogo", label: "Mujer" },
  { href: "#catalogo", label: "Hombre" },
  { href: "#catalogo", label: "Accesorios" },
  { href: "#nosotros", label: "Nosotros" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-30 bg-[#FAF8F5]/95 backdrop-blur-sm border-b border-[#E8DDD6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <a
          href="/"
          className="font-display text-2xl font-bold tracking-[0.2em] text-[#2C1810]"
          aria-label="ÁUREA — inicio"
        >
          ÁUREA
        </a>

        <nav className="hidden md:flex items-center gap-8" aria-label="Navegación principal">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs tracking-[0.25em] uppercase text-[#6B5A52] hover:text-[#8B6355] transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          {/* Menú móvil */}
          <Sheet>
            <SheetTrigger
              render={
                <button
                  className="md:hidden p-2 rounded-full text-[#6B5A52] hover:text-[#2C1810] hover:bg-[#F5F0EA] transition-all duration-200"
                  aria-label="Abrir menú de navegación"
                />
              }
            >
              <Menu size={20} />
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#FAF8F5] border-l border-[#E8DDD6] w-72">
              <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
              <div className="pt-8 pb-6 border-b border-[#E8DDD6] mb-6">
                <span className="font-display text-2xl font-bold tracking-[0.2em] text-[#2C1810]">
                  ÁUREA
                </span>
              </div>
              <nav className="flex flex-col gap-5" aria-label="Menú móvil">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-base tracking-[0.2em] uppercase text-[#2C1810] hover:text-[#8B6355] transition-colors duration-200 py-1"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
