import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export const YT = "https://www.youtube.com/@BeginnerCGArtist";
export const GUMROAD = "https://beginnercgartist.gumroad.com/";
export const watchUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;
export const thumb = (id: string) => `/images/yt/${id}.webp`;

export const Reveal = ({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.6, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

interface SectionHeaderProps {
  eyebrow: string;
  title: ReactNode;
  intro?: string;
  link?: { label: string; to: string; external?: boolean };
}

export const SectionHeader = ({ eyebrow, title, intro, link }: SectionHeaderProps) => (
  <Reveal className="mb-10 flex flex-col gap-5 md:mb-14 md:flex-row md:items-end md:justify-between">
    <div className="max-w-2xl">
      <p className="eyebrow mb-4">{eyebrow}</p>
      <h2 className="text-4xl sm:text-5xl lg:text-6xl">{title}</h2>
      {intro && <p className="mt-5 text-base leading-relaxed text-muted-foreground font-body md:text-lg">{intro}</p>}
    </div>
    {link &&
      (link.external ? (
        <a href={link.to} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center gap-1.5 text-sm font-bold text-foreground hover:text-primary transition-colors">
          {link.label} <ArrowUpRight className="h-4 w-4" />
        </a>
      ) : (
        <Link to={link.to} className="inline-flex shrink-0 items-center gap-1.5 text-sm font-bold text-foreground hover:text-primary transition-colors">
          {link.label} <ArrowUpRight className="h-4 w-4" />
        </Link>
      ))}
  </Reveal>
);

export const Section = ({ children, tone = "base", id }: { children: ReactNode; tone?: "base" | "alt"; id?: string }) => (
  <section id={id} className={`py-20 lg:py-28 ${tone === "alt" ? "bg-card/50 border-y border-border" : ""}`}>
    <div className="container mx-auto px-6">{children}</div>
  </section>
);
