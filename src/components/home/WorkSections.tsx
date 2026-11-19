import { Link } from "react-router-dom";
import { Play } from "lucide-react";
import BeforeAfter from "@/components/BeforeAfter";
import { TOOLS, ToolIcon } from "@/components/ToolIcon";
import Carousel from "@/components/Carousel";
import { Reveal, Section, SectionHeader, YT, thumb, watchUrl } from "@/components/home/shared";

export const ToolsStrip = () => (
  <div className="border-y border-border bg-card/40">
    <div className="container mx-auto px-6 py-6 flex flex-wrap items-center justify-center gap-x-9 gap-y-4">
      <span className="eyebrow">Built with</span>
      {TOOLS.map((t) => (
        <span key={t.name} className="flex items-center gap-2.5 text-sm font-bold text-foreground font-body">
          <ToolIcon tool={t} className="h-5 w-5" />
          {t.name}
        </span>
      ))}
    </div>
  </div>
);

export const CompareBand = () => (
  <section id="compare" className="py-20 lg:py-28">
    <div className="container mx-auto px-6">
      <Reveal className="mb-10 max-w-3xl">
        <p className="eyebrow mb-4">How it is built</p>
        <h2 className="text-4xl sm:text-5xl lg:text-7xl">
          Grey blockout. <span className="text-primary">Final render.</span>
        </h2>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground font-body md:text-lg">
          Drag the line. Left is the Blender viewport, right is the finished Cycles render of the same scene.
        </p>
      </Reveal>
      <Reveal>
        <BeforeAfter
          alt="Frog Island scene compared between Blender viewport and final Cycles render"
          beforeSrc="/images/hero-viewport-1280.webp"
          beforeSrcSet="/images/hero-viewport-1280.webp 1280w, /images/hero-viewport.webp 1920w"
          afterSrc="/images/hero-render-1280.webp"
          afterSrcSet="/images/hero-render-1280.webp 1280w, /images/hero-render.webp 1920w"
          sizes="(min-width: 1280px) 1200px, 100vw"
        />
      </Reveal>
    </div>
  </section>
);

interface Work {
  title: string;
  tag: string;
  img: string;
  href: string;
  external?: boolean;
}

const works: Work[] = [
  { title: "Frog Island", tag: "Featured", img: "/images/hero-render-1280.webp", href: "/portfolio/frog-island" },
  { title: "Abandoned Gas Station", tag: "Full tutorial", img: thumb("EXmLxHDj9fY"), href: watchUrl("EXmLxHDj9fY"), external: true },
  { title: "Mistwood Giants", tag: "Breakdown", img: thumb("QlM7GWLuWHg"), href: watchUrl("QlM7GWLuWHg"), external: true },
  { title: "Fantasy Library", tag: "Breakdown", img: thumb("tZMJvOM_V1g"), href: watchUrl("tZMJvOM_V1g"), external: true },
  { title: "Dreamy Sunflower Field", tag: "Timelapse", img: thumb("ghNlJVkQ29w"), href: watchUrl("ghNlJVkQ29w"), external: true },
  { title: "Fantasy Environment", tag: "Timelapse", img: thumb("BgSP2-z1EBY"), href: watchUrl("BgSP2-z1EBY"), external: true },
  { title: "Dreamy Hilltop Morning", tag: "Animation", img: thumb("CwL3Nr8OTp0"), href: watchUrl("CwL3Nr8OTp0"), external: true },
  { title: "Abandoned Farm", tag: "Scene file", img: "/images/gumroad/hqosuz.webp", href: "/library" },
  { title: "Lakeside Mountain Monastery", tag: "Scene file", img: "/images/gumroad/pzvaov.webp", href: "/library" },
  { title: "Forgotten Tracks", tag: "Scene file", img: "/images/gumroad/dyrwjs.webp", href: "/library" },
];

const cardClass = "group relative block aspect-[4/3] overflow-hidden rounded-lg border border-border shadow-card";

const WorkCard = ({ w }: { w: Work }) => {
  const inner = (
    <>
      <img src={w.img} alt={`${w.title}, Blender environment`} width={1280} height={720} loading="lazy" draggable={false} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]" />
      <span className="chip absolute left-3 top-3">{w.tag}</span>
      {w.external && (
        <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-brand text-brand-foreground opacity-0 transition-opacity group-hover:opacity-100">
          <Play className="h-3.5 w-3.5 fill-current" />
        </span>
      )}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-5 pt-20">
        <p className="font-anton text-2xl leading-tight text-white">{w.title}</p>
      </div>
    </>
  );
  return w.external ? (
    <a href={w.href} target="_blank" rel="noopener noreferrer" className={cardClass}>{inner}</a>
  ) : (
    <Link to={w.href} className={cardClass}>{inner}</Link>
  );
};

export const FeaturedWork = () => (
  <Section id="work">
    <SectionHeader
      eyebrow="Portfolio"
      title={<>Environments I <span className="text-primary">built</span></>}
      intro="Every scene is modelled, lit and rendered by me in Blender. Drag, swipe or use the arrows."
      link={{ label: "See full portfolio", to: "/portfolio" }}
    />
    <Carousel label="Featured environments">
      {works.map((w) => (
        <WorkCard key={w.title} w={w} />
      ))}
    </Carousel>
  </Section>
);

const tutorials = [
  { id: "EXmLxHDj9fY", title: "How to Create a Realistic Abandoned Gas Station in Blender", meta: "Full environment tutorial" },
  { id: "QlM7GWLuWHg", title: "Mistwood Giants: Giant Fantasy Forest Breakdown", meta: "Breakdown" },
  { id: "tZMJvOM_V1g", title: "Fantasy Library Environment Breakdown", meta: "Breakdown" },
  { id: "ltvXyxY9_Xg", title: "How to Post Process Blender Renders for FREE", meta: "Photopea tutorial" },
  { id: "PI3nV4OVzVY", title: "Free Procedural Vine Generator Add-on for Blender", meta: "Install + tutorial" },
  { id: "yU29BsvJpt0", title: "10 Blender Tips & Tricks Every Beginner Should Know", meta: "Beginner tips" },
  { id: "vNpr1y_aoyA", title: "How to Make a Realistic Flag Animation in 2 Minutes", meta: "Beginner tutorial" },
];

export const LearnSection = () => (
  <Section tone="alt" id="learn">
    <SectionHeader
      eyebrow="Tutorials"
      title={<>Learn it <span className="text-primary">step by step</span></>}
      intro="Real projects, explained in simple English. The result comes first, then we build it together."
      link={{ label: "All tutorials", to: "/tutorials" }}
    />
    <Carousel label="Tutorials" slideClassName="basis-[85%] sm:basis-[46%] lg:basis-[31%] xl:basis-[24%]">
      {tutorials.map((t) => (
        <a key={t.id} href={watchUrl(t.id)} target="_blank" rel="noopener noreferrer" className="group block">
          <div className="relative overflow-hidden rounded-lg border border-border">
            <img src={thumb(t.id)} alt={t.title} width={1280} height={720} loading="lazy" draggable={false} className="aspect-video w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
            <span className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-brand text-brand-foreground">
              <Play className="h-4 w-4 fill-current" />
            </span>
          </div>
          <p className="eyebrow mt-4">{t.meta}</p>
          <h3 className="mt-2 text-base font-bold leading-snug text-foreground transition-colors group-hover:text-primary">{t.title}</h3>
        </a>
      ))}
    </Carousel>
    <p className="mt-2 text-sm text-muted-foreground font-body">
      More on <a href={YT} target="_blank" rel="noopener noreferrer" className="font-bold text-foreground hover:text-primary">YouTube</a>.
    </p>
  </Section>
);
