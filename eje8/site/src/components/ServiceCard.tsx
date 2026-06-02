import { Syringe, Stethoscope, Scissors, ShieldCheck, Bandage, Activity } from "lucide-react";
import type { ServiceId } from "@/lib/utils";
import { cn } from "@/lib/utils";

const iconMap: Record<ServiceId, React.ComponentType<{ size?: number }>> = {
  consulta: Stethoscope,
  vacunacion: Syringe,
  desparasitacion: ShieldCheck,
  estetica: Scissors,
  cirugia: Bandage,
  imagen: Activity,
};

const accentMap = {
  mint: {
    chip: "bg-[var(--mint-100)] text-[var(--teal-700)]",
    icon: "bg-[var(--mint-200)] text-[var(--teal-700)]",
    glow: "shadow-soft-mint",
  },
  teal: {
    chip: "bg-[var(--teal-700)] text-white",
    icon: "bg-[var(--teal-700)] text-white",
    glow: "shadow-soft-mint",
  },
  coral: {
    chip: "bg-[var(--coral-300)] text-ink",
    icon: "bg-[var(--coral-300)] text-ink",
    glow: "shadow-soft-coral",
  },
};

export type ServiceCardProps = {
  id: ServiceId;
  title: string;
  price: string;
  duration: string;
  description: string;
  highlights: string[];
  accent: "mint" | "teal" | "coral";
};

export function ServiceCard(props: ServiceCardProps) {
  const Icon = iconMap[props.id];
  const a = accentMap[props.accent];
  return (
    <article
      className={cn(
        "group relative flex flex-col gap-5 rounded-3xl surface-paper p-7 transition-transform duration-300 hover:-translate-y-1",
        a.glow
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <span
          aria-hidden
          className={cn(
            "grid h-14 w-14 place-items-center rounded-2xl",
            a.icon
          )}
        >
          <Icon size={24} />
        </span>
        <span
          className={cn(
            "rounded-full px-3 py-1 text-xs font-semibold tracking-wide",
            a.chip
          )}
        >
          {props.duration}
        </span>
      </div>

      <div className="space-y-2">
        <h3 className="font-display text-2xl font-semibold leading-tight text-ink">
          {props.title}
        </h3>
        <p className="text-sm leading-relaxed text-ink-soft">
          {props.description}
        </p>
      </div>

      <ul className="space-y-1.5 text-sm text-ink-soft">
        {props.highlights.map((h) => (
          <li key={h} className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--mint-500)]" />
            <span>{h}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto flex items-end justify-between pt-2">
        <div>
          <span className="block text-xs uppercase tracking-widest text-muted">
            Desde
          </span>
          <span className="font-display text-3xl font-semibold text-ink">
            {props.price}
          </span>
        </div>
      </div>
    </article>
  );
}
