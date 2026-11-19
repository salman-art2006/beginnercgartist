import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import JoinButton from "@/components/JoinButton";

const InstagramIcon =({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
  </svg>
);

const ArtStationIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M0 17.723l2.027 3.505h.001a2.424 2.424 0 0 0 2.164 1.333h13.457l-2.792-4.838H0zm24 .025c0-.484-.143-.935-.388-1.314L15.728 2.728a2.424 2.424 0 0 0-2.164-1.333H9.419L21.598 22.54l1.92-3.325c.378-.637.482-.919.482-1.467zm-11.129-3.462L7.428 4.858l-5.444 9.428h10.887z" />
  </svg>
);

const GumroadIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 19.2c-3.978 0-7.2-3.222-7.2-7.2S8.022 4.8 12 4.8c2.467 0 4.64 1.24 5.94 3.13l-2.07 1.16A3.84 3.84 0 0 0 12 7.68c-2.386 0-4.32 1.934-4.32 4.32S9.614 16.32 12 16.32c1.813 0 3.368-1.115 4.03-2.7H12v-2.4h6.48c.048.348.072.703.072 1.06 0 3.977-3.222 6.92-6.552 6.92z" />
  </svg>
);

const socials = [
  { icon: InstagramIcon, label: "Instagram", href: "https://www.instagram.com/beginnercg_artist/" },
  { icon: YoutubeIcon, label: "YouTube", href: "https://www.youtube.com/@BeginnerCGArtist" },
  { icon: ArtStationIcon, label: "ArtStation", href: "https://www.artstation.com/beginnercgartist" },
  { icon: GumroadIcon, label: "Gumroad", href: "https://beginnercgartist.gumroad.com/" },
];

const explore = [
  { label: "Portfolio", href: "/portfolio" },
  { label: "Tutorials", href: "/tutorials" },
  { label: "Library", href: "/library" },
  { label: "Workflow", href: "/workflow" },
  { label: "Blog", href: "/blog" },
];

const company = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const Footer = () => (
  <footer className="border-t border-border bg-card/40">
    <div className="container mx-auto px-6 py-14 grid gap-10 md:grid-cols-12">
      <div className="md:col-span-5">
        <Logo size="lg" />
        <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground font-body">
          Realistic, cinematic Blender environments, and how to build them step by step. Made in Blender, no AI.
        </p>
        <div className="mt-6"><JoinButton size="md" /></div>
        <div className="mt-5 flex items-center gap-3">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
            >
              <s.icon className="w-[18px] h-[18px]" />
            </a>
          ))}
        </div>
      </div>

      <nav aria-label="Explore" className="md:col-span-3 md:col-start-7">
        <p className="eyebrow mb-4">Explore</p>
        <ul className="space-y-3">
          {explore.map((l) => (
            <li key={l.label}>
              <Link to={l.href} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">{l.label}</Link>
            </li>
          ))}
        </ul>
      </nav>

      <nav aria-label="Company" className="md:col-span-3">
        <p className="eyebrow mb-4">Site</p>
        <ul className="space-y-3">
          {company.map((l) => (
            <li key={l.label}>
              <Link to={l.href} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">{l.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
    <div className="border-t border-border">
      <div className="container mx-auto px-6 py-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground font-body">© {new Date().getFullYear()} Salman · Beginner CG Artist</p>
        <p className="text-xs text-muted-foreground font-body">beginnercgartist.com</p>
      </div>
    </div>
  </footer>
);

export default Footer;
