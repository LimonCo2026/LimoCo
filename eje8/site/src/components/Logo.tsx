import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span
        aria-hidden
        className="grid h-10 w-10 place-items-center rounded-2xl bg-[var(--mint-200)] text-[var(--teal-700)] shadow-soft-mint"
      >
        <svg viewBox="0 0 32 32" className="h-6 w-6" fill="currentColor">
          <ellipse cx="9" cy="13" rx="3" ry="4" />
          <ellipse cx="23" cy="13" rx="3" ry="4" />
          <ellipse cx="5" cy="20" rx="2.5" ry="3" />
          <ellipse cx="27" cy="20" rx="2.5" ry="3" />
          <path d="M16 16c-4.5 0-8 3-8 6.5C8 25 10.5 27 13 27c1.5 0 2-.8 3-.8s1.5.8 3 .8c2.5 0 5-2 5-4.5 0-3.5-3.5-6.5-8-6.5z" />
        </svg>
      </span>
      <span className="flex flex-col leading-tight">
        <span className="font-display text-xl font-semibold text-ink">
          PataVet
        </span>
        <span className="text-[11px] uppercase tracking-[0.18em] text-muted">
          Clínica Veterinaria
        </span>
      </span>
    </span>
  );
}
