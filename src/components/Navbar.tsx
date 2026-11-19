import { useState, useEffect } from "react";
import { Menu, X, ShoppingBag } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import JoinButton from "@/components/JoinButton";

const links = [
  { label: "Portfolio", href: "/portfolio" },
  { label: "Tutorials", href: "/tutorials" },
  { label: "Library", href: "/library" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const GUMROAD = "https://beginnercgartist.gumroad.com/";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location]);

  const overHero = location.pathname === "/" && !scrolled && !open;
  const isActive = (href: string) => location.pathname === href || location.pathname.startsWith(href + "/");

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-colors duration-300 ${
        overHero ? "bg-transparent border-transparent" : "bg-background/90 backdrop-blur-md border-border"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between h-16">
        <Logo onDark={overHero} />

        <div className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.href}
              aria-current={isActive(l.href) ? "page" : undefined}
              className={`text-sm font-semibold font-body transition-colors ${
                overHero
                  ? isActive(l.href) ? "text-white" : "text-white/80 hover:text-white"
                  : isActive(l.href) ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className={isActive(l.href) ? "border-b-2 border-brand pb-1" : ""}>{l.label}</span>
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <ThemeToggle onDark={overHero} />
          <JoinButton size="sm" variant={overHero ? "light" : "brand"} />
          <a
            href={GUMROAD}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-1.5 font-body font-bold text-sm px-4 h-9 rounded-md transition-colors ${overHero ? "border border-white/40 text-white hover:bg-white/10" : "border border-foreground/30 text-foreground hover:bg-secondary"}`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Shop
          </a>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle onDark={overHero} />
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-md ${overHero ? "text-white" : "text-foreground"}`}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <div className="container mx-auto px-6 py-4 flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.label}
                to={l.href}
                className={`py-3 text-base font-semibold font-body border-b border-border/60 ${
                  isActive(l.href) ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <JoinButton size="lg" className="mt-3 w-full" />
            <a
              href={GUMROAD}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center justify-center gap-2 bg-brand text-brand-foreground font-body font-bold py-3 rounded-md"
            >
              <ShoppingBag className="w-4 h-4" />
              Shop on Gumroad
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
