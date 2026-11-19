import { useState } from "react";

interface BeforeAfterProps {
  beforeSrc: string;
  beforeSrcSet?: string;
  afterSrc: string;
  afterSrcSet?: string;
  beforeLabel?: string;
  afterLabel?: string;
  alt: string;
  priority?: boolean;
  className?: string;
  sizes?: string;
}

const BeforeAfter = ({
  beforeSrc,
  beforeSrcSet,
  afterSrc,
  afterSrcSet,
  beforeLabel = "Viewport",
  afterLabel = "Final render",
  alt,
  priority = false,
  className = "",
  sizes = "(min-width: 1024px) 58vw, 100vw",
}: BeforeAfterProps) => {
  const [pos, setPos] = useState(50);

  return (
    <div className={`relative aspect-video w-full select-none overflow-hidden rounded-lg border border-border bg-card shadow-card ${className}`}>
      <img
        src={afterSrc}
        srcSet={afterSrcSet}
        sizes={sizes}
        alt={alt}
        width={1920}
        height={1080}
        loading={priority ? "eager" : "lazy"}
        {...(priority ? { fetchpriority: "high" } : {})}
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <img
        src={beforeSrc}
        srcSet={beforeSrcSet}
        sizes={sizes}
        alt=""
        aria-hidden="true"
        width={1920}
        height={1080}
        loading={priority ? "eager" : "lazy"}
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      />

      <span className="chip absolute left-3 top-3">{beforeLabel}</span>
      <span className="chip-brand absolute right-3 top-3">{afterLabel}</span>

      <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.35)]" style={{ left: `${pos}%` }}>
        <div className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-[#141414] text-white shadow-lg">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" />
          </svg>
        </div>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        step={0.5}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label="Compare viewport and final render"
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
};

export default BeforeAfter;
