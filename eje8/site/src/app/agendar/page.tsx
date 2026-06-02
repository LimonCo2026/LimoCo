"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CalendarDays, Check, CalendarPlus, PawPrint, ArrowRight } from "lucide-react";
import { usePets, useAppointments, type Appointment } from "@/lib/store";
import {
  VETS,
  SERVICES,
  timeSlotsForDate,
  formatDateES,
  CLINIC,
  type VetId,
} from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function AgendarPage() {
  return (
    <Suspense fallback={null}>
      <AgendarBody />
    </Suspense>
  );
}

function AgendarBody() {
  const router = useRouter();
  const params = useSearchParams();
  const { pets, ready: petsReady } = usePets();
  const { appointments, addAppointment } = useAppointments();

  const initialPet = params.get("pet") ?? "";
  const initialVet = (params.get("vet") as VetId) ?? "mendez";
  const initialService = params.get("service") ?? "consulta";

  const [petId, setPetId] = useState(initialPet);
  const [vetId, setVetId] = useState<VetId>(initialVet);
  const [serviceId, setServiceId] = useState(initialService);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [success, setSuccess] = useState<Appointment | null>(null);

  useEffect(() => {
    if (!petId && pets[0]) setPetId(pets[0].id);
  }, [pets, petId]);

  const slots = useMemo(() => timeSlotsForDate(date), [date]);
  const takenSlots = useMemo(
    () =>
      new Set(
        appointments
          .filter((a) => a.date === date && a.vetId === vetId)
          .map((a) => a.time)
      ),
    [appointments, date, vetId]
  );

  const todayISO = new Date().toISOString().slice(0, 10);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const pet = pets.find((p) => p.id === petId);
    const service = SERVICES.find((s) => s.id === serviceId);
    if (!pet || !service || !date || !time) return;

    const appt = addAppointment({
      petId: pet.id,
      petName: pet.name,
      ownerName: pet.ownerName,
      vetId,
      serviceId: service.id,
      serviceTitle: service.title,
      date,
      time,
      notes: notes.trim() || undefined,
    });
    setSuccess(appt);
  }

  function resetForm() {
    setSuccess(null);
    setDate("");
    setTime("");
    setNotes("");
  }

  if (success) {
    return (
      <SuccessCard
        appt={success}
        onHistory={() => router.push("/mi-mascota")}
        onAgain={resetForm}
      />
    );
  }

  return (
    <>
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="blob blob-anim absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full"
          style={{ background: "var(--mint-200)" }}
        />
        <div className="relative mx-auto max-w-6xl px-5 pt-16 pb-10 md:px-8 md:pt-24">
          <span className="inline-flex items-center gap-2 rounded-full bg-[var(--mint-100)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--teal-700)]">
            <CalendarPlus size={14} /> Nueva cita
          </span>
          <h1 className="mt-5 max-w-3xl font-display text-5xl font-semibold leading-[1.05] text-ink md:text-6xl">
            Agenda en{" "}
            <span className="italic text-[var(--teal-700)]">menos de un minuto.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-ink-soft">
            Elige al veterinario que conoce mejor a tu mascota, el servicio que
            necesita y el horario que más te acomode.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 md:px-8">
        <form
          onSubmit={handleSubmit}
          className="grid gap-6 lg:grid-cols-[1.3fr_1fr]"
        >
          <div className="space-y-6">
            <Step number="01" title="¿Para quién es la cita?">
              {!petsReady ? (
                <p className="text-sm text-muted">Cargando mascotas…</p>
              ) : pets.length === 0 ? (
                <div className="rounded-2xl bg-[var(--bg-cream)] p-5">
                  <p className="text-sm text-ink-soft">
                    Aún no tienes una mascota registrada. Registra el perfil
                    primero para poder agendar.
                  </p>
                  <Link
                    href="/mi-mascota"
                    className="mt-3 inline-flex items-center gap-2 rounded-full bg-[var(--teal-700)] px-5 py-2.5 text-xs font-semibold text-white"
                  >
                    Registrar mascota <ArrowRight size={14} />
                  </Link>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {pets.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPetId(p.id)}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl p-4 text-left transition",
                        p.id === petId
                          ? "bg-[var(--mint-100)] ring-2 ring-[var(--mint-300)]"
                          : "bg-[var(--bg-cream)] hover:bg-[var(--mint-50)]"
                      )}
                    >
                      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--mint-200)] font-display text-lg font-semibold text-[var(--teal-700)]">
                        {p.name.charAt(0).toUpperCase()}
                      </span>
                      <div>
                        <p className="font-display text-base font-semibold leading-tight text-ink">
                          {p.name}
                        </p>
                        <p className="text-xs text-ink-soft">
                          {p.species}
                          {p.breed && ` · ${p.breed}`}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </Step>

            <Step number="02" title="Elige veterinario">
              <div className="grid gap-3 sm:grid-cols-2">
                {VETS.map((v) => {
                  const active = v.id === vetId;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setVetId(v.id)}
                      className={cn(
                        "rounded-2xl p-5 text-left transition",
                        active
                          ? "bg-[var(--teal-700)] text-white shadow-soft-mint"
                          : "bg-[var(--bg-cream)] hover:bg-[var(--mint-50)]"
                      )}
                    >
                      <p
                        className={cn(
                          "text-xs uppercase tracking-widest",
                          active ? "text-white/70" : "text-muted"
                        )}
                      >
                        {v.role}
                      </p>
                      <p className="mt-1 font-display text-xl font-semibold">
                        {v.name}
                      </p>
                      <p
                        className={cn(
                          "mt-1 text-sm",
                          active ? "text-white/80" : "text-ink-soft"
                        )}
                      >
                        {v.specialty}
                      </p>
                    </button>
                  );
                })}
              </div>
            </Step>

            <Step number="03" title="Servicio que necesitas">
              <div className="grid gap-3 sm:grid-cols-2">
                {SERVICES.map((s) => {
                  const active = s.id === serviceId;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setServiceId(s.id)}
                      className={cn(
                        "flex items-center justify-between gap-3 rounded-2xl p-4 text-left transition",
                        active
                          ? "bg-[var(--mint-100)] ring-2 ring-[var(--mint-300)]"
                          : "bg-[var(--bg-cream)] hover:bg-[var(--mint-50)]"
                      )}
                    >
                      <span>
                        <span className="block font-display text-base font-semibold leading-tight text-ink">
                          {s.title}
                        </span>
                        <span className="text-xs text-ink-soft">
                          {s.duration}
                        </span>
                      </span>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[var(--teal-700)]">
                        {s.price}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Step>

            <Step number="04" title="Día y hora">
              <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
                <label className="block">
                  <span className="block text-xs font-semibold uppercase tracking-widest text-muted">
                    Fecha
                  </span>
                  <input
                    type="date"
                    min={todayISO}
                    value={date}
                    onChange={(e) => {
                      setDate(e.target.value);
                      setTime("");
                    }}
                    className="mt-1.5 w-full rounded-2xl bg-[var(--bg-cream)] px-4 py-3 text-sm text-ink outline-none focus:bg-white focus:ring-2 focus:ring-[var(--mint-300)]"
                  />
                </label>
                {date && (
                  <div className="rounded-2xl bg-[var(--mint-50)] px-5 py-3">
                    <p className="text-xs uppercase tracking-widest text-muted">
                      Día elegido
                    </p>
                    <p className="font-display text-sm font-semibold text-ink">
                      {formatDateES(date)}
                    </p>
                  </div>
                )}
              </div>

              {date && slots.length === 0 && (
                <p className="mt-4 rounded-2xl bg-[var(--coral-300)] p-4 text-sm text-ink">
                  Los domingos descansamos. Elige otro día para agendar.
                </p>
              )}

              {slots.length > 0 && (
                <div className="mt-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted">
                    Horarios disponibles
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {slots.map((slot) => {
                      const taken = takenSlots.has(slot);
                      const active = slot === time;
                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={taken}
                          onClick={() => setTime(slot)}
                          className={cn(
                            "rounded-full px-4 py-2 text-sm font-semibold transition",
                            taken
                              ? "cursor-not-allowed bg-[var(--bg-cream)] text-muted line-through"
                              : active
                              ? "bg-[var(--teal-700)] text-white shadow-soft-mint"
                              : "bg-[var(--bg-cream)] text-ink hover:bg-[var(--mint-50)]"
                          )}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </Step>

            <Step number="05" title="Notas para el veterinario (opcional)">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Síntomas, dudas o si tu mascota está nerviosa con extraños..."
                rows={4}
                className="w-full resize-none rounded-2xl bg-[var(--bg-cream)] px-4 py-3 text-sm text-ink placeholder:text-muted outline-none focus:bg-white focus:ring-2 focus:ring-[var(--mint-300)]"
              />
            </Step>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <Summary
              pet={pets.find((p) => p.id === petId)?.name}
              vet={VETS.find((v) => v.id === vetId)?.name}
              service={SERVICES.find((s) => s.id === serviceId)}
              date={date}
              time={time}
              canSubmit={Boolean(petId && date && time)}
            />
          </aside>
        </form>
      </section>
    </>
  );
}

function Step({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[2rem] surface-paper p-7 shadow-soft-cream">
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-2xl bg-[var(--mint-100)] font-display text-sm font-semibold text-[var(--teal-700)]">
          {number}
        </span>
        <h2 className="font-display text-2xl font-semibold text-ink">{title}</h2>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Summary({
  pet,
  vet,
  service,
  date,
  time,
  canSubmit,
}: {
  pet: string | undefined;
  vet: string | undefined;
  service: (typeof SERVICES)[number] | undefined;
  date: string;
  time: string;
  canSubmit: boolean;
}) {
  return (
    <div className="rounded-[2rem] bg-[var(--mint-100)] p-7 shadow-soft-mint">
      <h2 className="font-display text-2xl font-semibold text-ink">
        Resumen de la cita
      </h2>
      <p className="mt-1 text-sm text-ink-soft">
        Revisa los datos antes de confirmar.
      </p>

      <dl className="mt-5 space-y-3 text-sm">
        <Row label="Mascota" value={pet} />
        <Row label="Veterinario" value={vet} />
        <Row label="Servicio" value={service?.title} />
        <Row label="Costo" value={service?.price} />
        <Row label="Día" value={date ? formatDateES(date) : undefined} />
        <Row label="Hora" value={time} />
      </dl>

      <button
        type="submit"
        disabled={!canSubmit}
        className={cn(
          "mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition",
          canSubmit
            ? "bg-[var(--teal-700)] text-white hover:-translate-y-0.5"
            : "cursor-not-allowed bg-white/60 text-muted"
        )}
      >
        <CalendarDays size={16} /> Confirmar cita
      </button>

      <p className="mt-3 text-center text-xs text-ink-soft">
        Operamos {CLINIC.hours.weekday.label.toLowerCase()} y{" "}
        {CLINIC.hours.saturday.label.toLowerCase()}.
      </p>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-[var(--bg-paper)] px-4 py-3">
      <dt className="text-xs uppercase tracking-widest text-muted">{label}</dt>
      <dd className="text-sm font-semibold text-ink">
        {value ?? <span className="text-muted">—</span>}
      </dd>
    </div>
  );
}

function SuccessCard({
  appt,
  onHistory,
  onAgain,
}: {
  appt: Appointment;
  onHistory: () => void;
  onAgain: () => void;
}) {
  return (
    <section className="relative mx-auto max-w-3xl px-5 py-24 md:px-8">
      <div className="rounded-[2.5rem] surface-paper p-10 text-center shadow-soft-mint">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-[var(--mint-200)] text-[var(--teal-700)]">
          <Check size={28} />
        </span>
        <h1 className="mt-6 font-display text-4xl font-semibold leading-tight text-ink">
          ¡Cita confirmada!
        </h1>
        <p className="mt-3 text-ink-soft">
          Te enviamos un recordatorio el día anterior. {appt.petName} estará
          en buenas manos.
        </p>

        <dl className="mt-8 grid gap-3 text-left">
          <Row label="Mascota" value={appt.petName} />
          <Row label="Servicio" value={appt.serviceTitle} />
          <Row label="Día" value={formatDateES(appt.date)} />
          <Row label="Hora" value={appt.time} />
          <Row label="Veterinario" value={VETS.find((v) => v.id === appt.vetId)?.name} />
        </dl>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={onHistory}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--teal-700)] px-6 py-3 text-sm font-semibold text-white"
          >
            <PawPrint size={16} /> Ver historial
          </button>
          <button
            type="button"
            onClick={onAgain}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--mint-100)] px-6 py-3 text-sm font-semibold text-[var(--teal-700)]"
          >
            Agendar otra cita
          </button>
        </div>
      </div>
    </section>
  );
}
