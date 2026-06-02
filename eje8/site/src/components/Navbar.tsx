"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/servicios", label: "Servicios" },
  { href: "/mi-mascota", label: "Mi Mascota" },
  { href: "/agendar", label: "Agendar" },
  { href: "/panel", label: "Panel" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[rgba(251,247,238,0.78)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8">
        <Link
          href="/"
          className="rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-[var(--mint-300)]"
          onClick={() => setOpen(false)}
        >
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const active =
              l.href === "/" ? pathname === "/" : pathname?.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-[var(--mint-100)] text-[var(--teal-700)]"
                    : "text-ink-soft hover:text-ink hover:bg-[var(--mint-50)]"
                )}
              >
                {l.label}
              </Link>
            );
          })}
          <Link
            href="/agendar"
            className="ml-2 rounded-full bg-[var(--teal-700)] px-5 py-2.5 text-sm font-semibold text-white shadow-soft-mint transition-transform hover:-translate-y-0.5"
          >
            Agendar cita
          </Link>
        </nav>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--mint-100)] text-[var(--teal-700)] md:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden">
          <div className="mx-5 mb-4 rounded-3xl surface-paper p-4 shadow-soft-cream">
            <ul className="flex flex-col gap-1">
              {links.map((l) => {
                const active =
                  l.href === "/"
                    ? pathname === "/"
                    : pathname?.startsWith(l.href);
                return (
                  <li key={l.href}>
                    <Link
                      onClick={() => setOpen(false)}
                      href={l.href}
                      className={cn(
                        "block rounded-2xl px-4 py-3 text-sm font-medium",
                        active
                          ? "bg-[var(--mint-100)] text-[var(--teal-700)]"
                          : "text-ink-soft hover:bg-[var(--mint-50)]"
                      )}
                    >
                      {l.label}
                    </Link>
                  </li>
                );
              })}
              <li className="pt-2">
                <Link
                  onClick={() => setOpen(false)}
                  href="/agendar"
                  className="block rounded-2xl bg-[var(--teal-700)] px-4 py-3 text-center text-sm font-semibold text-white shadow-soft-mint"
                >
                  Agendar cita
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}
