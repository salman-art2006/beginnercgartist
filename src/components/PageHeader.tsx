import { ReactNode } from "react";

export const PageHeader = ({ eyebrow, title, intro }: { eyebrow: string; title: ReactNode; intro?: string }) => (
  <section className="pt-36 pb-10 lg:pt-44 lg:pb-14">
    <div className="container mx-auto px-6">
      <p className="eyebrow mb-5">{eyebrow}</p>
      <h1 className="text-[clamp(3rem,8vw,7rem)] leading-[0.94]">{title}</h1>
      {intro && <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground font-body md:text-xl">{intro}</p>}
    </div>
  </section>
);

export const FilterChips = ({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) => (
  <div className="flex flex-wrap gap-2" role="tablist">
    {options.map((o) => (
      <button
        key={o}
        type="button"
        role="tab"
        aria-selected={value === o}
        onClick={() => onChange(o)}
        className={`rounded-md border px-4 py-2 text-sm font-bold font-body transition-colors ${
          value === o ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/40"
        }`}
      >
        {o}
      </button>
    ))}
  </div>
);

export const EmptyState = ({ children }: { children: ReactNode }) => (
  <div className="rounded-lg border border-dashed border-border py-20 text-center text-muted-foreground font-body">{children}</div>
);
