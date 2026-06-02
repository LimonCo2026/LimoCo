import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const CLINIC = {
  name: "PataVet",
  tagline: "Cuidamos a quien te cuida.",
  email: "hola@patavet.mx",
  phone: "+52 555 010 2026",
  address: "Av. Reforma 88, Col. Centro · CDMX",
  hours: {
    weekday: { label: "Lunes a Viernes", start: "09:00", end: "19:00" },
    saturday: { label: "Sábados", start: "09:00", end: "14:00" },
  },
};

export type VetId = "mendez" | "torres";

export const VETS: {
  id: VetId;
  name: string;
  role: string;
  specialty: string;
  blurb: string;
  initials: string;
}[] = [
  {
    id: "mendez",
    name: "Dr. Méndez",
    role: "Veterinario titular",
    specialty: "Perros y gatos",
    blurb:
      "Doce años en consulta general, vacunación y cirugía menor. Explica cada diagnóstico con paciencia, sin tecnicismos.",
    initials: "DM",
  },
  {
    id: "torres",
    name: "Dra. Torres",
    role: "Veterinaria titular",
    specialty: "Animales exóticos y aves",
    blurb:
      "Especializada en reptiles, aves de compañía, hurones y conejos. Asesora dietas y enriquecimiento ambiental.",
    initials: "DT",
  },
];

export type ServiceId =
  | "consulta"
  | "vacunacion"
  | "desparasitacion"
  | "estetica"
  | "cirugia"
  | "imagen";

export const SERVICES: {
  id: ServiceId;
  title: string;
  price: string;
  numericPrice: number;
  duration: string;
  description: string;
  highlights: string[];
  accent: "mint" | "teal" | "coral";
}[] = [
  {
    id: "consulta",
    title: "Consulta general",
    price: "$250",
    numericPrice: 250,
    duration: "30 min",
    description:
      "Revisión completa, peso, temperatura y orientación sobre alimentación. Ideal para chequeo regular.",
    highlights: ["Examen físico", "Plan de cuidados", "Próximos pasos claros"],
    accent: "mint",
  },
  {
    id: "vacunacion",
    title: "Vacunación",
    price: "$180",
    numericPrice: 180,
    duration: "20 min",
    description:
      "Aplicamos cuádruple, antirrábica, leucemia felina y refuerzos según edad y especie. Registramos cada dosis en el historial.",
    highlights: ["Recordatorio automático", "Cartilla digital", "Vacunas certificadas"],
    accent: "teal",
  },
  {
    id: "desparasitacion",
    title: "Desparasitación",
    price: "$150",
    numericPrice: 150,
    duration: "15 min",
    description:
      "Internos y externos. Dosis ajustada por peso y especie, con plan de seguimiento cada 3 meses.",
    highlights: ["Interna y externa", "Sin estrés", "Calendario por mascota"],
    accent: "mint",
  },
  {
    id: "estetica",
    title: "Baño y estética",
    price: "$200 – $350",
    numericPrice: 275,
    duration: "60 – 90 min",
    description:
      "Baño, secado, corte de uñas y limpieza de oídos. El precio cambia según el tamaño y el tipo de pelaje.",
    highlights: ["Shampoo hipoalergénico", "Estilistas con experiencia", "Aroma natural"],
    accent: "coral",
  },
  {
    id: "cirugia",
    title: "Cirugía menor",
    price: "$800",
    numericPrice: 800,
    duration: "Programada",
    description:
      "Esterilización, extracción de masas pequeñas y suturas. Hospitalización ambulatoria, anestesia monitoreada.",
    highlights: ["Pre y post quirúrgico", "Monitoreo continuo", "Alta el mismo día"],
    accent: "teal",
  },
  {
    id: "imagen",
    title: "Placa o ultrasonido",
    price: "$400",
    numericPrice: 400,
    duration: "45 min",
    description:
      "Radiografía digital o estudio ultrasonográfico abdominal. Resultados inmediatos y explicación en consulta.",
    highlights: ["Imagen digital", "Interpretación clínica", "Sin radiación innecesaria"],
    accent: "mint",
  },
];

export function timeSlotsForDate(dateStr: string): string[] {
  if (!dateStr) return [];
  const d = new Date(`${dateStr}T00:00:00`);
  const dow = d.getDay();
  if (dow === 0) return [];
  const slots: string[] = [];
  const endHour = dow === 6 ? 14 : 19;
  for (let h = 9; h < endHour; h++) {
    slots.push(`${String(h).padStart(2, "0")}:00`);
    slots.push(`${String(h).padStart(2, "0")}:30`);
  }
  return slots;
}

export function formatDateES(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
