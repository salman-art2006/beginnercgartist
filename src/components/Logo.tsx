import { Link } from "react-router-dom";

export const LogoMark = ({ className = "w-9 h-9" }: { className?: string }) => (
  <svg viewBox="0 0 128 128" className={className} role="img" aria-label="Beginner CG Artist mark">
    <circle cx="64" cy="64" r="64" fill="#1F1F1F" />
    <circle cx="64" cy="64" r="60" fill="none" stroke="#FFD23F" strokeWidth="3" />
    <polygon points="20,90 46,50 62,70 80,38 108,90" fill="#FFFFFF" fillOpacity="0.08" />
    <polyline points="20,90 46,50 62,70 80,38 108,90" fill="none" stroke="#FFFFFF" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round" />
    <line x1="16" y1="90" x2="112" y2="90" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
    <rect x="41" y="45" width="10" height="10" fill="#FFFFFF" />
    <rect x="57" y="65" width="10" height="10" fill="#FFFFFF" />
    <rect x="73" y="31" width="14" height="14" fill="#FFD23F" stroke="#141414" strokeWidth="2" />
  </svg>
);

const Logo = ({ to = "/", size = "md", onDark = false }: { to?: string; size?: "md" | "lg"; onDark?: boolean }) => (
  <Link to={to} className="flex items-center gap-3" aria-label="Beginner CG Artist, home">
    <LogoMark className={size === "lg" ? "w-12 h-12" : "w-9 h-9"} />
    <span className={`font-anton leading-none tracking-wide ${onDark ? "text-white" : "text-foreground"} ${size === "lg" ? "text-2xl" : "text-xl"}`}>
      Beginner CG <span className={onDark ? "text-[#FFD23F]" : "text-primary"}>Artist</span>
    </span>
  </Link>
);

export default Logo;
