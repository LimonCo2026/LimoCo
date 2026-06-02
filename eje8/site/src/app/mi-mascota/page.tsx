"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { PawPrint, PlusCircle, Trash2, CalendarClock, Syringe, BellRing, ArrowRight } from "lucide-react";
import { usePets, useAppointments, appointmentsForPet, nextVaccineReminder } from "@/lib/store";
import { VETS, formatDateES } from "@/lib/utils";
import { cn } from "@/lib/utils";

const species = ["Perro", "Gato", "Ave", "Conejo", "Hurón", "Reptil", "Otro"];

export default function MiMascotaPage() {
  const { pets, addPet, removePet, ready } = usePets();
  const { appointments } = useAppointments();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedPet = useMemo(
    () => pets.find((p) => p.id === selectedId) ?? pets[0] ?? null,
    [pets, selectedId]
  );

  return (
    <>
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="blob blob-anim absolute -top-24 -right-24 h-80 w-80 rounded-full"
          style={{ background: "var(--mint-200)" }}
        />
        <div className="relative mx-auto max-w-6xl px-5 pt-16 pb-10 md:px-8 md:pt-24">
          <span className="inline-flex items-center gap-2 rounded-full bg-[var(--mint-100)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--teal-700)]">
            <PawPrint size={14} /> Perfil de tu mascota
          </span>
          <h1 className="mt-5 max-w-3xl font-display text-5xl font-semibold leading-[1.05] text-ink md:text-6xl">
            El historial de tu compañero,
            <span className="italic text-[var(--teal-700)]"> siempre a la mano.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-ink-soft">
            Registra a tu mascota una sola vez. Cada vacuna, baño y consulta
            se guarda aquí. Te avisamos cuando se acerque el próximo refuerzo.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_1.4fr]">
          <PetForm onAdd={addPet} />

          <div className="space-y-6">
            <PetList
              pets={pets}
              ready={ready}
              selectedId={selectedPet?.id ?? null}
              onSelect={setSelectedId}
              onRemove={removePet}
            />
            {selectedPet && (
              <PetHistory
                petId={selectedPet.id}
                petName={selectedPet.name}
                appointments={appointmentsForPet(appointments, selectedPet.id)}
              />
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 md:px-8">
        <div className="rounded-[2.5rem] bg-[var(--mint-50)] p-8 md:p-12">
          <div className="grid items-center gap-6 md:grid-cols-[1fr_auto]">
            <div>
              <h2 className="font-display text-3xl font-semibold text-ink md:text-4xl">
                ¿Listo para agendar la próxima visita?
              </h2>
              <p className="mt-2 max-w-xl text-ink-soft">
                Si ya registraste a tu mascota, en el formulario de agenda solo
                eliges veterinario, servicio, fecha y hora.
              </p>
            </div>
            <Link
              href="/agendar"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--teal-700)] px-6 py-3 text-sm font-semibold text-white shadow-soft-mint"
            >
              Agendar cita <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function PetForm({
  onAdd,
}: {
  onAdd: (data: {
    name: string;
    species: string;
    breed: string;
    age: string;
    weight: string;
    ownerName: string;
    ownerPhone: string;
  }) => void;
}) {
  const [name, setName] = useState("");
  const [sp, setSp] = useState(species[0]);
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name || !ownerName) return;
    onAdd({ name, species: sp, breed, age, weight, ownerName, ownerPhone });
    setName("");
    setBreed("");
    setAge("");
    setWeight("");
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-[2rem] surface-paper p-7 shadow-soft-cream"
    >
      <h2 className="font-display text-2xl font-semibold text-ink">
        Registrar mascota
      </h2>
      <p className="mt-1 text-sm text-ink-soft">
        Datos básicos para abrir su expediente.
      </p>

      <div className="mt-6 grid gap-4">
        <Field label="Nombre de la mascota" required>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Mía, Pelusa, Loro..."
            required
            className={inputCls}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Especie" required>
            <select
              value={sp}
              onChange={(e) => setSp(e.target.value)}
              className={inputCls}
            >
              {species.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </Field>
          <Field label="Raza">
            <input
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              placeholder="Labrador, Persa, Periquito..."
              className={inputCls}
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Edad">
            <input
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="3 años"
              className={inputCls}
            />
          </Field>
          <Field label="Peso">
            <input
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="12 kg"
              className={inputCls}
            />
          </Field>
        </div>

        <Field label="Tu nombre" required>
          <input
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            placeholder="Como te llaman tus amigos"
            required
            className={inputCls}
          />
        </Field>

        <Field label="Teléfono de contacto">
          <input
            value={ownerPhone}
            onChange={(e) => setOwnerPhone(e.target.value)}
            placeholder="55 1234 5678"
            className={inputCls}
          />
        </Field>
      </div>

      <button
        type="submit"
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--teal-700)] px-6 py-3 text-sm font-semibold text-white shadow-soft-mint transition-transform hover:-translate-y-0.5"
      >
        <PlusCircle size={16} /> Guardar mascota
      </button>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold uppercase tracking-widest text-muted">
        {label}{required && <span className="text-[var(--coral-500)]"> *</span>}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

const inputCls =
  "w-full rounded-2xl bg-[var(--bg-cream)] px-4 py-3 text-sm text-ink placeholder:text-muted outline-none transition focus:bg-white focus:ring-2 focus:ring-[var(--mint-300)]";

function PetList({
  pets,
  ready,
  selectedId,
  onSelect,
  onRemove,
}: {
  pets: ReturnType<typeof usePets>["pets"];
  ready: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  if (!ready) {
    return (
      <div className="rounded-[2rem] surface-paper p-7 shadow-soft-cream">
        <p className="text-sm text-muted">Cargando perfiles…</p>
      </div>
    );
  }

  if (pets.length === 0) {
    return (
      <div className="rounded-[2rem] surface-paper p-8 shadow-soft-cream">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[var(--mint-100)] text-[var(--teal-700)]">
          <PawPrint size={22} />
        </span>
        <h3 className="mt-4 font-display text-2xl font-semibold text-ink">
          Aún no hay mascotas registradas
        </h3>
        <p className="mt-2 text-ink-soft">
          Llena el formulario para abrir el primer expediente. Toma menos
          de un minuto.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[2rem] surface-paper p-7 shadow-soft-cream">
      <h2 className="font-display text-2xl font-semibold text-ink">
        Tus mascotas
      </h2>
      <p className="mt-1 text-sm text-ink-soft">
        Toca un nombre para ver su historial.
      </p>
      <ul className="mt-5 space-y-3">
        {pets.map((p) => (
          <li
            key={p.id}
            className={cn(
              "flex items-center justify-between gap-3 rounded-2xl px-4 py-3 transition",
              p.id === selectedId
                ? "bg-[var(--mint-100)]"
                : "bg-[var(--bg-cream)] hover:bg-[var(--mint-50)]"
            )}
          >
            <button
              onClick={() => onSelect(p.id)}
              className="flex flex-1 items-center gap-3 text-left"
            >
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--mint-200)] font-display text-lg font-semibold text-[var(--teal-700)]">
                {p.name.charAt(0).toUpperCase()}
              </span>
              <div className="flex-1">
                <p className="font-display text-lg font-semibold leading-tight text-ink">
                  {p.name}
                </p>
                <p className="text-xs text-ink-soft">
                  {p.species}
                  {p.breed && ` · ${p.breed}`}
                  {p.age && ` · ${p.age}`}
                </p>
              </div>
            </button>
            <button
              onClick={() => {
                if (confirm(`¿Eliminar el perfil de ${p.name}?`)) onRemove(p.id);
              }}
              aria-label={`Eliminar ${p.name}`}
              className="grid h-9 w-9 place-items-center rounded-xl text-muted hover:bg-white hover:text-[var(--coral-500)]"
            >
              <Trash2 size={16} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PetHistory({
  petId,
  petName,
  appointments,
}: {
  petId: string;
  petName: string;
  appointments: ReturnType<typeof appointmentsForPet>;
}) {
  const next = nextVaccineReminder(appointments);

  return (
    <div className="rounded-[2rem] surface-paper p-7 shadow-soft-cream">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display text-2xl font-semibold text-ink">
          Historial · {petName}
        </h2>
        <Link
          href={`/agendar?pet=${petId}`}
          className="inline-flex items-center gap-2 rounded-full bg-[var(--mint-100)] px-4 py-2 text-xs font-semibold text-[var(--teal-700)]"
        >
          Nueva cita <ArrowRight size={14} />
        </Link>
      </div>

      {next && (
        <div className="mt-5 flex items-start gap-3 rounded-2xl bg-[var(--coral-300)] p-4">
          <BellRing size={18} className="mt-0.5 text-ink" />
          <div className="text-sm text-ink">
            <p className="font-semibold">Próximo refuerzo de vacuna</p>
            <p>Aproximadamente el {next}.</p>
          </div>
        </div>
      )}

      {appointments.length === 0 ? (
        <p className="mt-5 rounded-2xl bg-[var(--bg-cream)] p-5 text-sm text-ink-soft">
          Aún no hay visitas registradas para {petName}. Cuando agendes una
          cita, aparecerá aquí con la fecha y veterinario.
        </p>
      ) : (
        <ul className="mt-5 space-y-3">
          {appointments.map((a) => {
            const vet = VETS.find((v) => v.id === a.vetId);
            return (
              <li
                key={a.id}
                className="rounded-2xl bg-[var(--bg-cream)] p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[var(--mint-100)] text-[var(--teal-700)]">
                      {a.serviceId === "vacunacion" ? (
                        <Syringe size={18} />
                      ) : (
                        <CalendarClock size={18} />
                      )}
                    </span>
                    <div>
                      <p className="font-display text-lg font-semibold leading-tight text-ink">
                        {a.serviceTitle}
                      </p>
                      <p className="text-xs text-ink-soft">
                        {formatDateES(a.date)} · {a.time}
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-[var(--mint-100)] px-3 py-1 text-xs font-semibold text-[var(--teal-700)]">
                    {vet?.name ?? "Veterinario"}
                  </span>
                </div>
                {a.notes && (
                  <p className="mt-3 text-sm text-ink-soft">{a.notes}</p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
