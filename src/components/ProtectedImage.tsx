interface ProtectedImageProps {
  src: string;
  alt: string;
  className?: string;
  watermark?: boolean;
}

/**
 * Protected Image Component
 * 
 * Wraps images with:
 * - Right-click prevention
 * - Drag prevention
 * - Optional watermark overlay
 * - Pointer-events control
 */
const ProtectedImage = ({ src, alt, className = "", watermark = false }: ProtectedImageProps) => {
  return (
    <div
      className="relative overflow-hidden protected-content"
      data-protected="true"
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
    >
      <img
        src={src}
        alt={alt}
        className={`select-none ${className}`}
        draggable={false}
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        style={{ WebkitUserDrag: "none" } as any}
      />
      {/* Transparent overlay to prevent direct image interaction */}
      <div className="absolute inset-0 z-10" style={{ pointerEvents: "all" }} />
      {/* Watermark */}
      {watermark && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none opacity-[0.06]">
          <span
            className="font-display text-foreground text-4xl md:text-6xl font-bold tracking-widest rotate-[-30deg] select-none whitespace-nowrap"
          >
            ENV.ART
          </span>
        </div>
      )}
    </div>
  );
};

export default ProtectedImage;
