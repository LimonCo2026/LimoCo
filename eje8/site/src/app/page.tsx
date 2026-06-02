import Link from "next/link";
import { ArrowRight, BellRing, CalendarDays, PawPrint, ShieldCheck, Sparkles } from "lucide-react";
import { ServiceCard } from "@/components/ServiceCard";
import { SERVICES, VETS, CLINIC } from "@/lib/utils";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <Services />
      <HowItWorks />
      <Vets />
      <Schedule />
      <CtaBanner />
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="blob blob-anim absolute -top-24 -left-20 h-80 w-80 rounded-full"
        style={{ background: "var(--mint-200)" }}
      />
      <div
        aria-hidden
        className="blob blob-anim absolute -bottom-32 right-0 h-96 w-96 rounded-full"
        style={{ background: "var(--coral-300)" }}
      />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-5 pt-14 pb-20 md:grid-cols-[1.1fr_1fr] md:px-8 md:pt-20 md:pb-28">
        <div className="flex flex-col justify-center">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[var(--mint-100)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--teal-700)]">
            <Sparkles size={14} /> Citas en línea
          </span>

          <h1 className="mt-5 font-display text-5xl font-semibold leading-[1.04] tracking-tight text-ink md:text-6xl">
            La cita de tu mascota,
            <br />
            <span className="text-[var(--teal-700)] italic">sin esperas</span>{" "}
            ni adivinanzas.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
            En {CLINIC.name} agendas en menos de un minuto, guardamos el
            historial de cada vacuna y te avisamos cuando toca la próxima. Para
            que la consulta sea tan tranquila como una tarde en casa.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/agendar"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--teal-700)] px-6 py-3 text-sm font-semibold text-white shadow-soft-mint transition-transform hover:-translate-y-0.5"
            >
              Agendar ahora <ArrowRight size={16} />
            </Link>
            <Link
              href="/servicios"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--bg-paper)] px-6 py-3 text-sm font-semibold text-ink shadow-soft-cream"
            >
              Ver servicios y precios
            </Link>
          </div>

          <dl className="mt-10 grid grid-cols-3 gap-4 text-sm text-ink-soft">
            <div>
              <dt className="text-xs uppercase tracking-widest text-muted">
                Atendemos
              </dt>
              <dd className="font-display text-lg text-ink">L–S</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-widest text-muted">
                Veterinarios
              </dt>
              <dd className="font-display text-lg text-ink">2 expertos</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-widest text-muted">
                Servicios
              </dt>
              <dd className="font-display text-lg text-ink">6 esenciales</dd>
            </div>
          </dl>
        </div>

        <div className="relative">
          <div className="relative mx-auto max-w-md rotate-1 rounded-[2.5rem] surface-paper p-7 shadow-soft-mint">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--mint-200)] text-[var(--teal-700)]">
                  <PawPrint size={22} />
                </span>
                <div>
                  <p className="font-display text-lg font-semibold leading-tight text-ink">
                    Próxima cita
                  </p>
                  <p className="text-xs text-muted">
                    Recordatorio automático
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-[var(--mint-100)] px-3 py-1 text-xs font-semibold text-[var(--teal-700)]">
                Confirmada
              </span>
            </div>

            <div className="mt-6 rounded-2xl bg-[var(--mint-50)] p-5">
              <p className="text-xs uppercase tracking-widest text-muted">
                Lunes 14 de septiembre
              </p>
              <p className="mt-1 font-display text-2xl font-semibold text-ink">
                Vacunación · Mía
              </p>
              <p className="mt-1 text-sm text-ink-soft">
                11:30 con la Dra. Torres
              </p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl bg-[var(--bg-cream)] p-4">
                <p className="text-xs uppercase tracking-widest text-muted">
                  Especie
                </p>
                <p className="mt-1 font-medium text-ink">Conejo · 3 años</p>
              </div>
              <div className="rounded-2xl bg-[var(--bg-cream)] p-4">
                <p className="text-xs uppercase tracking-widest text-muted">
                  Última visita
                </p>
                <p className="mt-1 font-medium text-ink">12 ago, 2026</p>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3 rounded-2xl bg-[var(--coral-300)] p-4">
              <BellRing size={18} className="text-ink" />
              <p className="text-sm leading-snug text-ink">
                Toca refuerzo de vacuna en 11 días. Te avisamos por correo.
              </p>
            </div>
          </div>

          <div
            aria-hidden
            className="absolute -bottom-8 -left-6 hidden h-28 w-28 rotate-[-12deg] rounded-3xl bg-[var(--mint-200)] shadow-soft-mint md:block"
          />
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const items = [
    {
      icon: CalendarDays,
      title: "Agenda en línea",
      copy: "Elige veterinario, servicio y horario. Sin llamadas, sin esperas.",
    },
    {
      icon: PawPrint,
      title: "Historial por mascota",
      copy: "Cada visita, vacuna y peso se guarda con el nombre de tu compañero.",
    },
    {
      icon: BellRing,
      title: "Recordatorios amables",
      copy: "Te avisamos cuándo toca refuerzo o desparasitación. Sin spam.",
    },
    {
      icon: ShieldCheck,
      title: "Equipo certificado",
      copy: "Dr. Méndez y Dra. Torres con más de una década atendiendo familias.",
    },
  ];
  return (
    <section className="mx-auto max-w-6xl px-5 md:px-8">
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {items.map(({ icon: Icon, title, copy }) => (
          <div
            key={title}
            className="rounded-3xl surface-paper p-6 shadow-soft-cream"
          >
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--mint-100)] text-[var(--teal-700)]">
              <Icon size={20} />
            </span>
            <h3 className="mt-4 font-display text-lg font-semibold text-ink">
              {title}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">{copy}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Services() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div className="max-w-xl">
          <span className="text-xs uppercase tracking-[0.22em] text-[var(--teal-600)]">
            Servicios
          </span>
          <h2 className="mt-3 font-display text-4xl font-semibold leading-tight text-ink md:text-5xl">
            Todo lo que tu mascota necesita,
            <span className="italic text-[var(--teal-700)]"> bajo un mismo techo.</span>
          </h2>
        </div>
        <Link
          href="/servicios"
          className="inline-flex items-center gap-2 rounded-full bg-[var(--mint-100)] px-5 py-2.5 text-sm font-semibold text-[var(--teal-700)]"
        >
          Ver detalle de precios <ArrowRight size={14} />
        </Link>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((s) => (
          <ServiceCard key={s.id} {...s} />
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Registra a tu mascota",
      copy: "Nombre, especie, raza, edad y peso. Solo una vez.",
    },
    {
      n: "02",
      title: "Elige veterinario y horario",
      copy: "Te mostramos los slots disponibles según el día.",
    },
    {
      n: "03",
      title: "Llega tranquilo",
      copy: "Encontramos su historial y la consulta empieza puntual.",
    },
  ];
  return (
    <section className="mx-auto max-w-6xl px-5 md:px-8">
      <div className="rounded-[2.5rem] bg-[var(--mint-50)] p-8 md:p-14">
        <div className="grid gap-10 md:grid-cols-[1fr_1.4fr]">
          <div>
            <span className="text-xs uppercase tracking-[0.22em] text-[var(--teal-600)]">
              Así funciona
            </span>
            <h2 className="mt-3 font-display text-4xl font-semibold leading-tight text-ink">
              Tres pasos. Sin filas, sin estrés.
            </h2>
            <p className="mt-4 max-w-md text-ink-soft">
              Diseñamos el flujo para que dueño y mascota lleguen relajados.
              El veterinario ya tiene el contexto cuando los recibe.
            </p>
          </div>
          <ol className="grid gap-5">
            {steps.map((s) => (
              <li
                key={s.n}
                className="flex items-start gap-5 rounded-3xl surface-paper p-6 shadow-soft-cream"
              >
                <span className="font-display text-3xl font-semibold text-[var(--mint-500)]">
                  {s.n}
                </span>
                <div>
                  <h3 className="font-display text-xl font-semibold text-ink">
                    {s.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                    {s.copy}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Vets() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-24">
      <div className="max-w-2xl">
        <span className="text-xs uppercase tracking-[0.22em] text-[var(--teal-600)]">
          Nuestro equipo
        </span>
        <h2 className="mt-3 font-display text-4xl font-semibold leading-tight text-ink md:text-5xl">
          Dos veterinarios que conocen a tu mascota{" "}
          <span className="italic text-[var(--teal-700)]">por su nombre.</span>
        </h2>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {VETS.map((v, i) => (
          <article
            key={v.id}
            className={`rounded-[2rem] p-7 ${
              i === 0
                ? "bg-[var(--mint-100)] shadow-soft-mint"
                : "bg-[var(--coral-300)] shadow-soft-coral"
            }`}
          >
            <div className="flex items-center gap-5">
              <span className="grid h-20 w-20 place-items-center rounded-3xl bg-[var(--bg-paper)] font-display text-2xl font-semibold text-[var(--teal-700)] shadow-soft-cream">
                {v.initials}
              </span>
              <div>
                <p className="text-xs uppercase tracking-widest text-ink-soft">
                  {v.role}
                </p>
                <h3 className="font-display text-2xl font-semibold text-ink">
                  {v.name}
                </h3>
                <p className="text-sm font-medium text-ink-soft">
                  {v.specialty}
                </p>
              </div>
            </div>
            <p className="mt-6 text-ink-soft leading-relaxed">{v.blurb}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Schedule() {
  return (
    <section className="mx-auto max-w-6xl px-5 md:px-8">
      <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
        <div className="rounded-[2rem] surface-paper p-8 shadow-soft-cream">
          <h3 className="font-display text-3xl font-semibold leading-tight text-ink">
            Horarios de atención
          </h3>
          <p className="mt-2 max-w-md text-ink-soft">
            La consulta es con cita. Si llegas sin agendar, hacemos lo posible
            por acomodarte entre espacios.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-[var(--mint-50)] p-5">
              <p className="text-xs uppercase tracking-widest text-muted">
                {CLINIC.hours.weekday.label}
              </p>
              <p className="mt-1 font-display text-2xl font-semibold text-ink">
                {CLINIC.hours.weekday.start} – {CLINIC.hours.weekday.end}
              </p>
            </div>
            <div className="rounded-2xl bg-[var(--mint-50)] p-5">
              <p className="text-xs uppercase tracking-widest text-muted">
                {CLINIC.hours.saturday.label}
              </p>
              <p className="mt-1 font-display text-2xl font-semibold text-ink">
                {CLINIC.hours.saturday.start} – {CLINIC.hours.saturday.end}
              </p>
            </div>
            <div className="rounded-2xl bg-[var(--bg-cream)] p-5 sm:col-span-2">
              <p className="text-xs uppercase tracking-widest text-muted">
                Domingos
              </p>
              <p className="mt-1 font-display text-xl font-semibold text-ink">
                Descansamos. Urgencias por teléfono.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] bg-[var(--teal-700)] p-8 text-white shadow-soft-mint">
          <h3 className="font-display text-3xl font-semibold leading-tight">
            ¿Urgencia fuera de horario?
          </h3>
          <p className="mt-2 text-white/80">
            Llámanos. Si la situación lo requiere, abrimos la clínica o te
            referimos al hospital aliado más cercano.
          </p>
          <a
            href={`tel:${CLINIC.phone.replace(/\s/g, "")}`}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[var(--teal-700)]"
          >
            {CLINIC.phone}
          </a>
        </div>
      </div>
    </section>
  );
}

function CtaBanner() {
  return (
    <section className="mx-auto max-w-6xl px-5 pt-20 md:px-8">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-[var(--mint-200)] p-10 md:p-14 shadow-soft-mint">
        <div
          aria-hidden
          className="absolute -top-12 -right-12 h-56 w-56 rounded-full bg-[var(--mint-100)]"
        />
        <div className="relative max-w-2xl">
          <h2 className="font-display text-4xl font-semibold leading-tight text-ink md:text-5xl">
            Tu mascota merece una visita tranquila.
          </h2>
          <p className="mt-4 text-ink-soft">
            Crea su perfil, agenda en línea y deja que nosotros nos encarguemos
            del recordatorio. Solo lleva la correa.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/mi-mascota"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--teal-700)] px-6 py-3 text-sm font-semibold text-white"
            >
              Registrar mascota
            </Link>
            <Link
              href="/agendar"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink"
            >
              Agendar cita <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
