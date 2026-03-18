import { Instagram, Youtube, Globe, Mail } from "lucide-react";

const socials = [
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Youtube, label: "YouTube", href: "#" },
  { icon: Globe, label: "ArtStation", href: "#" },
  { icon: Mail, label: "Email", href: "mailto:hello@artist.com" },
];

const Footer = () => (
  <footer className="border-t border-border py-10">
    <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
      <a href="/" className="font-display text-lg font-bold text-gradient-gold">
        ENV.ART
      </a>
      <div className="flex items-center gap-5">
        {socials.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.label}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <s.icon className="w-5 h-5" />
          </a>
        ))}
      </div>
      <p className="text-muted-foreground/50 text-sm font-body">
        © {new Date().getFullYear()} ENV.ART. Built with passion.
      </p>
    </div>
  </footer>
);

export default Footer;
