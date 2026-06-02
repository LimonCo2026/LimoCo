"use client";

import { useEffect, useState, useCallback } from "react";

export type Pet = {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: string;
  weight: string;
  ownerName: string;
  ownerPhone: string;
  createdAt: string;
};

export type Appointment = {
  id: string;
  petId: string;
  petName: string;
  ownerName: string;
  vetId: "mendez" | "torres";
  serviceId: string;
  serviceTitle: string;
  date: string;
  time: string;
  notes?: string;
  createdAt: string;
};

const KEY_PETS = "patavet:pets";
const KEY_APPTS = "patavet:appointments";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent(`patavet:${key}`));
}

function useLocalCollection<T>(key: string): [T[], (next: T[]) => void, boolean] {
  const [items, setItems] = useState<T[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItems(read<T[]>(key, []));
    setReady(true);
    const handler = () => setItems(read<T[]>(key, []));
    window.addEventListener(`patavet:${key}`, handler);
    return () => window.removeEventListener(`patavet:${key}`, handler);
  }, [key]);

  const update = useCallback(
    (next: T[]) => {
      write(key, next);
      setItems(next);
    },
    [key]
  );

  return [items, update, ready];
}

export function usePets() {
  const [pets, setPets, ready] = useLocalCollection<Pet>(KEY_PETS);

  const addPet = useCallback(
    (data: Omit<Pet, "id" | "createdAt">) => {
      const pet: Pet = {
        ...data,
        id: `pet-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        createdAt: new Date().toISOString(),
      };
      setPets([pet, ...pets]);
      return pet;
    },
    [pets, setPets]
  );

  const removePet = useCallback(
    (id: string) => {
      setPets(pets.filter((p) => p.id !== id));
    },
    [pets, setPets]
  );

  return { pets, addPet, removePet, ready };
}

export function useAppointments() {
  const [appts, setAppts, ready] = useLocalCollection<Appointment>(KEY_APPTS);

  const addAppointment = useCallback(
    (data: Omit<Appointment, "id" | "createdAt">) => {
      const appt: Appointment = {
        ...data,
        id: `cita-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        createdAt: new Date().toISOString(),
      };
      setAppts([appt, ...appts]);
      return appt;
    },
    [appts, setAppts]
  );

  const removeAppointment = useCallback(
    (id: string) => {
      setAppts(appts.filter((a) => a.id !== id));
    },
    [appts, setAppts]
  );

  return { appointments: appts, addAppointment, removeAppointment, ready };
}

export function appointmentsForPet(all: Appointment[], petId: string) {
  return all
    .filter((a) => a.petId === petId)
    .sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));
}

export function nextVaccineReminder(appts: Appointment[]): string | null {
  const lastVacc = appts
    .filter((a) => a.serviceId === "vacunacion")
    .sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time))[0];
  if (!lastVacc) return null;
  const date = new Date(`${lastVacc.date}T00:00:00`);
  date.setFullYear(date.getFullYear() + 1);
  return date.toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
