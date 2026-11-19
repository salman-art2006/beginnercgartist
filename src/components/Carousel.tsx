import { Children, ReactNode, useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface CarouselProps {
  children: ReactNode;
  slideClassName?: string;
  label: string;
}

const Carousel = ({ children, slideClassName = "basis-[85%] sm:basis-[46%] lg:basis-[31%]", label }: CarouselProps) => {
  const [ref, api] = useEmblaCarousel({ align: "start", containScroll: "trimSnaps", dragFree: false, slidesToScroll: 1 });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const update = useCallback(() => {
    if (!api) return;
    setCanPrev(api.canScrollPrev());
    setCanNext(api.canScrollNext());
  }, [api]);

  useEffect(() => {
    if (!api) return;
    update();
    api.on("select", update).on("reInit", update);
    return () => {
      api.off("select", update).off("reInit", update);
    };
  }, [api, update]);

  const btn =
    "inline-flex h-11 w-11 items-center justify-center rounded-full border border-foreground/30 text-foreground transition-colors enabled:hover:bg-foreground enabled:hover:text-background disabled:opacity-30";

  return (
    <div role="region" aria-roledescription="carousel" aria-label={label}>
      <div ref={ref} className="overflow-hidden">
        <div className="-ml-5 flex">
          {Children.map(children, (child) => (
            <div className={`min-w-0 shrink-0 grow-0 pl-5 ${slideClassName}`}>{child}</div>
          ))}
        </div>
      </div>
      <div className="mt-8 flex justify-end gap-3">
        <button type="button" className={btn} onClick={() => api?.scrollPrev()} disabled={!canPrev} aria-label="Previous">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <button type="button" className={btn} onClick={() => api?.scrollNext()} disabled={!canNext} aria-label="Next">
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Carousel;
