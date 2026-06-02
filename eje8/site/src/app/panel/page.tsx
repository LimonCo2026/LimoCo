"use client";

import { useMemo, useState } from "react";
import { CalendarRange, Clock, ClipboardList, Filter, PawPrint, Stethoscope, Trash2 } from "lucide-react";
import { useAppointments } from "@/lib/store";
import { VETS, SERVICES, formatDateES, type VetId } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function PanelPage() {
  const { appointments, removeAppointment } = useAppointments();
  const todayISO = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(todayISO);
  const [filterVet, setFilterVet] = useState<"all" | VetId>("all");

  const dayAppts = useMemo(
    () =>
      appointments
        .filter((a) => a.date === date)
        .filter((a) => (filterVet === "all" ? true : a.vetId === filterVet))
        .sort((a, b) => a.time.localeCompare(b.time)),
    [appointments, date, filterVet]
  );

  const grouped = useMemo(() => {
    const map: Record<VetId, typeof appointments> = { mendez: [], torres: [] };
    dayAppts.forEach((a) => map[a.vetId].push(a));
    return map;
  }, [dayAppts]);

  const totals = useMemo(() => {
    const sum = dayAppts.reduce((acc, a) => {
      const s = SERVICES.find((sv) => sv.id === a.serviceId);
      return acc + (s?.numericPrice ?? 0);
    }, 0);
    return {
      count: dayAppts.length,
      revenue: sum,
      mendez: grouped.mendez.length,
      torres: grouped.torres.length,
    };
  }, [dayAppts, grouped]);

  return (
    <>
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="blob blob-anim absolute -top-24 left-1/3 h-80 w-80 rounded-full"
          style={{ background: "var(--mint-200)" }}
        />
        <div className="relative mx-auto max-w-6xl px-5 pt-16 pb-10 md:px-8 md:pt-24">
          <span className="inline-flex items-center gap-2 rounded-full bg-[var(--mint-100)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--teal-700)]">
            <ClipboardList size={14} /> Panel de administración
          </span>
          <h1 className="mt-5 max-w-3xl font-display text-5xl font-semibold leading-[1.05] text-ink md:text-6xl">
            Citas del día,
            <span className="italic text-[var(--teal-700)]"> organizadas por veterinario.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-ink-soft">
            Vista interna para el equipo. Aquí ves la agenda completa, quién
            atiende qué y el ingreso estimado del día.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="rounded-[2rem] surface-paper p-6 shadow-soft-cream md:p-7">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="grid gap-3 sm:grid-cols-[auto_auto]">
              <label className="block">
                <span className="block text-xs font-semibold uppercase tracking-widest text-muted">
                  Fecha
                </span>
                <div className="mt-1.5 flex items-center gap-2 rounded-2xl bg-[var(--bg-cream)] px-4 py-3">
                  <CalendarRange size={16} className="text-[var(--teal-700)]" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="bg-transparent text-sm text-ink outline-none"
                  />
                </div>
              </label>

              <label className="block">
                <span className="block text-xs font-semibold uppercase tracking-widest text-muted">
                  Veterinario
                </span>
                <div className="mt-1.5 flex items-center gap-2 rounded-2xl bg-[var(--bg-cream)] px-4 py-3">
                  <Filter size={16} className="text-[var(--teal-700)]" />
                  <select
                    value={filterVet}
                    onChange={(e) => setFilterVet(e.target.value as "all" | VetId)}
                    className="bg-transparent text-sm text-ink outline-none"
                  >
                    <option value="all">Todos</option>
                    {VETS.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                </div>
              </label>
            </div>

            <p className="font-display text-sm text-ink-soft">
              {formatDateES(date)}
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-4">
            <StatBox label="Citas del día" value={totals.count.toString()} accent="mint" />
            <StatBox label="Dr. Méndez" value={totals.mendez.toString()} accent="mint" />
            <StatBox label="Dra. Torres" value={totals.torres.toString()} accent="coral" />
            <StatBox label="Ingreso estimado" value={`$${totals.revenue}`} accent="teal" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pt-10 md:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          {VETS.map((v) => (
            <VetColumn
              key={v.id}
              vetId={v.id}
              vetName={v.name}
              specialty={v.specialty}
              appts={grouped[v.id]}
              onRemove={removeAppointment}
            />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 md:px-8">
        <div className="rounded-[2rem] bg-[var(--mint-50)] p-8 md:p-12">
          <h2 className="font-display text-3xl font-semibold text-ink md:text-4xl">
            Tip operativo
          </h2>
          <p className="mt-3 max-w-2xl text-ink-soft">
            Si una cita se cancela, elimínala del panel para liberar el horario.
            Los recordatorios automáticos se ajustan en tiempo real.
          </p>
        </div>
      </section>
    </>
  );
}

function StatBox({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: "mint" | "coral" | "teal";
}) {
  const cls = {
    mint: "bg-[var(--mint-100)] text-ink",
    coral: "bg-[var(--coral-300)] text-ink",
    teal: "bg-[var(--teal-700)] text-white",
  }[accent];
  return (
    <div className={cn("rounded-2xl p-5", cls)}>
      <p className="text-xs uppercase tracking-widest opacity-80">{label}</p>
      <p className="mt-1 font-display text-3xl font-semibold">{value}</p>
    </div>
  );
}

function VetColumn({
  vetId,
  vetName,
  specialty,
  appts,
  onRemove,
}: {
  vetId: VetId;
  vetName: string;
  specialty: string;
  appts: ReturnType<typeof useAppointments>["appointments"];
  onRemove: (id: string) => void;
}) {
  const accent = vetId === "mendez" ? "var(--mint-100)" : "var(--coral-300)";
  return (
    <div className="rounded-[2rem] surface-paper p-7 shadow-soft-cream">
      <header
        className="flex items-center gap-3 rounded-2xl p-4"
        style={{ background: accent }}
      >
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--bg-paper)] text-[var(--teal-700)]">
          <Stethoscope size={20} />
        </span>
        <div>
          <p className="font-display text-xl font-semibold leading-tight text-ink">
            {vetName}
          </p>
          <p className="text-xs text-ink-soft">{specialty}</p>
        </div>
        <span className="ml-auto rounded-full bg-[var(--bg-paper)] px-3 py-1 text-xs font-semibold text-[var(--teal-700)]">
          {appts.length} {appts.length === 1 ? "cita" : "citas"}
        </span>
      </header>

      {appts.length === 0 ? (
        <p className="mt-5 rounded-2xl bg-[var(--bg-cream)] p-5 text-sm text-ink-soft">
          Sin citas en este día.
        </p>
      ) : (
        <ul className="mt-5 space-y-3">
          {appts.map((a) => {
            const service = SERVICES.find((s) => s.id === a.serviceId);
            return (
              <li
                key={a.id}
                className="flex flex-wrap items-start justify-between gap-3 rounded-2xl bg-[var(--bg-cream)] p-5"
              >
                <div className="flex items-start gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--mint-100)] text-[var(--teal-700)]">
                    <Clock size={18} />
                  </span>
                  <div>
                    <p className="font-display text-lg font-semibold leading-tight text-ink">
                      {a.time} · {a.serviceTitle}
                    </p>
                    <p className="text-xs text-ink-soft">
                      <PawPrint size={12} className="-mt-0.5 mr-1 inline" />
                      {a.petName} — {a.ownerName}
                    </p>
                    {a.notes && (
                      <p className="mt-2 max-w-md rounded-xl bg-white/70 p-3 text-xs text-ink-soft">
                        {a.notes}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {service && (
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[var(--teal-700)]">
                      {service.price}
                    </span>
                  )}
                  <button
                    onClick={() => {
                      if (
                        confirm(`¿Cancelar la cita de ${a.petName} a las ${a.time}?`)
                      )
                        onRemove(a.id);
                    }}
                    aria-label="Cancelar cita"
                    className="grid h-9 w-9 place-items-center rounded-xl text-muted hover:bg-white hover:text-[var(--coral-500)]"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
