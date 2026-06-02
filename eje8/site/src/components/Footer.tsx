import Link from "next/link";
import { Logo } from "./Logo";
import { CLINIC } from "@/lib/utils";

export function Footer() {
  return (
    <footer className="mt-20">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="rounded-[2.5rem] surface-paper px-7 py-10 shadow-soft-cream md:px-12 md:py-14">
          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <Logo />
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-soft">
                Una clínica que recuerda cuándo toca la próxima vacuna y
                conoce a tu mascota por su nombre.
              </p>
            </div>

            <div>
              <h3 className="font-display text-lg font-semibold text-ink">
                Visítanos
              </h3>
              <ul className="mt-3 space-y-1.5 text-sm text-ink-soft">
                <li>{CLINIC.address}</li>
                <li>
                  {CLINIC.hours.weekday.label}:{" "}
                  {CLINIC.hours.weekday.start} – {CLINIC.hours.weekday.end}
                </li>
                <li>
                  {CLINIC.hours.saturday.label}:{" "}
                  {CLINIC.hours.saturday.start} – {CLINIC.hours.saturday.end}
                </li>
                <li>Domingos cerrado</li>
              </ul>
            </div>

            <div>
              <h3 className="font-display text-lg font-semibold text-ink">
                Contacto
              </h3>
              <ul className="mt-3 space-y-1.5 text-sm text-ink-soft">
                <li>
                  <a className="hover:text-[var(--teal-700)]" href={`mailto:${CLINIC.email}`}>
                    {CLINIC.email}
                  </a>
                </li>
                <li>
                  <a className="hover:text-[var(--teal-700)]" href={`tel:${CLINIC.phone.replace(/\s/g, "")}`}>
                    {CLINIC.phone}
                  </a>
                </li>
                <li>
                  <Link className="hover:text-[var(--teal-700)]" href="/agendar">
                    Agenda en línea
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center gap-2 border-t border-[var(--line)] pt-6 text-center">
            <p className="font-display text-sm text-ink-soft">
              Desarrollado por Limon Co. Web — 2026
            </p>
            <p className="text-xs text-muted">
              © {new Date().getFullYear()} PataVet · Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
