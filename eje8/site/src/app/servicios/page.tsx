import Link from "next/link";
import { ArrowRight, PawPrint } from "lucide-react";
import { ServiceCard } from "@/components/ServiceCard";
import { SERVICES, VETS } from "@/lib/utils";

export const metadata = {
  title: "Servicios y precios · PataVet",
  description:
    "Consulta general, vacunación, desparasitación, estética, cirugía menor y diagnóstico por imagen. Precios transparentes.",
};

export default function ServiciosPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="blob blob-anim absolute -top-32 right-0 h-80 w-80 rounded-full"
          style={{ background: "var(--mint-200)" }}
        />
        <div className="relative mx-auto max-w-6xl px-5 pt-16 pb-12 md:px-8 md:pt-24">
          <span className="inline-flex items-center gap-2 rounded-full bg-[var(--mint-100)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--teal-700)]">
            <PawPrint size={14} /> Servicios
          </span>
          <h1 className="mt-5 max-w-3xl font-display text-5xl font-semibold leading-[1.05] text-ink md:text-6xl">
            Precios claros. Sin sorpresas en{" "}
            <span className="italic text-[var(--teal-700)]">la caja.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-ink-soft">
            Te decimos antes lo que cuesta. Cada servicio incluye registro en
            el historial de tu mascota y un seguimiento por correo si aplica.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <ServiceCard key={s.id} {...s} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <div className="grid gap-6 md:grid-cols-2">
          {VETS.map((v) => (
            <div
              key={v.id}
              className="rounded-[2rem] surface-paper p-7 shadow-soft-cream"
            >
              <p className="text-xs uppercase tracking-widest text-muted">
                {v.role}
              </p>
              <h3 className="mt-1 font-display text-2xl font-semibold text-ink">
                {v.name}
              </h3>
              <p className="mt-1 text-sm font-medium text-[var(--teal-700)]">
                {v.specialty}
              </p>
              <p className="mt-4 text-ink-soft leading-relaxed">{v.blurb}</p>
              <Link
                href={`/agendar?vet=${v.id}`}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--mint-100)] px-5 py-2.5 text-sm font-semibold text-[var(--teal-700)]"
              >
                Agendar con {v.name.split(".")[0]} <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="rounded-[2.5rem] bg-[var(--coral-300)] p-10 shadow-soft-coral md:p-14">
          <div className="grid items-center gap-8 md:grid-cols-[1.4fr_1fr]">
            <div>
              <h2 className="font-display text-4xl font-semibold leading-tight text-ink md:text-5xl">
                ¿No encuentras el servicio que buscas?
              </h2>
              <p className="mt-3 max-w-xl text-ink-soft">
                Atendemos otros casos por valoración: nutrición, geriatría
                animal, control de comportamiento y referencias quirúrgicas
                mayores. Cuéntanos qué necesitas.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link
                href="/agendar"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--teal-700)] px-6 py-3 text-sm font-semibold text-white"
              >
                Agendar valoración
              </Link>
              <a
                href="mailto:hola@patavet.mx"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink"
              >
                Escríbenos
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
