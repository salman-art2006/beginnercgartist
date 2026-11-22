import { Link } from "react-router-dom";
import { ArrowUpRight, Box, Clapperboard, Gamepad2, Wrench, Camera, Mail, Instagram, Youtube } from "lucide-react";
import BeforeAfter from "@/components/BeforeAfter";
import SubscribeForm from "@/components/SubscribeForm";
import { LogoMark } from "@/components/Logo";
import { GUMROAD, Reveal, Section, SectionHeader, YT, thumb, watchUrl } from "@/components/home/shared";

const INSTAGRAM = "https://www.instagram.com/beginnercg_artist/";

export const LibrarySection = () => (
  <Section id="library">
    <SectionHeader
      eyebrow="Library"
      title={<>Free files and <span className="text-primary">scene packs</span></>}
      intro="Start with the free tools. When you want to open a full scene and see exactly how it is built, grab a project file."
      link={{ label: "Open the library", to: "/library" }}
    />
    <div className="grid gap-5 md:grid-cols-2">
      <Reveal>
        <article className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card shadow-card">
          <img src={thumb("PI3nV4OVzVY")} alt="Procedural Vine Generator add-on for Blender" width={1280} height={720} loading="lazy" className="aspect-video w-full object-cover" />
          <div className="flex flex-1 flex-col p-6">
            <span className="chip-brand mb-4 w-fit">Free</span>
            <h3 className="text-xl font-bold text-foreground">Procedural Vine Generator</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground font-body">
              A Blender add-on that grows vines with branches and leaves. Free, with an optional donation.
            </p>
            <a href={watchUrl("PI3nV4OVzVY")} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-foreground hover:text-primary transition-colors">
              Watch install guide <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </article>
      </Reveal>

      <Reveal delay={0.08}>
        <article className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card shadow-card">
          <img src={thumb("EXmLxHDj9fY")} alt="Abandoned gas station Blender scene" width={1280} height={720} loading="lazy" className="aspect-video w-full object-cover" />
          <div className="flex flex-1 flex-col p-6">
            <span className="chip mb-4 w-fit">Scene files</span>
            <h3 className="text-xl font-bold text-foreground">Project files on Gumroad</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground font-body">
              Full .blend scenes you can open, study and render yourself. Each listing says what is included.
            </p>
            <a href={GUMROAD} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-foreground hover:text-primary transition-colors">
              Browse on Gumroad <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </article>
      </Reveal>
    </div>
  </Section>
);

const services = [
  { icon: Camera, title: "Cinematic environment render", text: "A finished still of a scene built from your brief, rendered in Cycles." },
  { icon: Clapperboard, title: "Environment animation / loop", text: "Slow, weighty camera moves and 4K loops for music channels, intros and stock." },
  { icon: Gamepad2, title: "Indie game concept art", text: "Concept art for your indie game: realistic or fantasy forest exteriors, made in Blender." },
  { icon: Wrench, title: "Blender scene help", text: "Lighting, render settings, optimisation and fixes for a scene that is not working." },
];

export const ServicesSection = () => (
  <Section tone="alt" id="services">
    <SectionHeader
      eyebrow="Work with me"
      title={<>Need an environment <span className="text-primary">made for you?</span></>}
      intro="I take a small number of custom projects. Tell me what you need and I will reply with a clear scope and price."
    />
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {services.map((s, i) => (
        <Reveal key={s.title} delay={0.06 * i}>
          <div className="h-full rounded-lg border border-border bg-card p-6 shadow-card">
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-md bg-brand text-brand-foreground">
              <s.icon className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold leading-snug text-foreground">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground font-body">{s.text}</p>
          </div>
        </Reveal>
      ))}
    </div>
    <Reveal className="mt-10">
      <Link to="/contact?topic=Custom%20project%20%2F%20quote" className="inline-flex items-center rounded-md bg-brand px-6 py-3.5 font-body font-bold text-brand-foreground transition-opacity hover:opacity-90">
        Request a quote
      </Link>
    </Reveal>
  </Section>
);

const steps = [
  { n: "01", title: "Reference and composition", text: "Collect references, decide the camera angle and the one thing the eye should land on." },
  { n: "02", title: "Terrain and blockout", text: "Sculpt the ground, place the big shapes and check scale before any detail." },
  { n: "03", title: "Assets, scatter and materials", text: "Build or choose assets, scatter vegetation, and add realistic materials." },
  { n: "04", title: "Light, atmosphere, camera", text: "Sun and sky, fog and volumes, depth of field, and a slow cinematic camera." },
  { n: "05", title: "Render and finish", text: "Render in Cycles, then colour grade and polish in DaVinci Resolve or Photopea." },
];

export const WorkflowSteps = () => (
  <Section id="workflow">
    <div className="grid items-start gap-12 lg:grid-cols-12">
      <div className="lg:col-span-5 lg:sticky lg:top-28">
        <SectionHeader
          eyebrow="Workflow"
          title={<>From grey blockout to <span className="text-primary">final render</span></>}
          intro="The same five steps behind every scene on this site."
        />
        <Reveal>
          <BeforeAfter
            alt="Frog Island scene compared between viewport and final render"
            beforeSrc="/images/hero-viewport-1280.webp"
            afterSrc="/images/hero-render-1280.webp"
            beforeLabel="Viewport"
            afterLabel="Render"
          />
        </Reveal>
        <Reveal className="mt-6">
          <Link to="/workflow" className="inline-flex items-center gap-1.5 text-sm font-bold text-foreground hover:text-primary transition-colors">
            Read the full workflow <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>

      <ol className="lg:col-span-7">
        {steps.map((s, i) => (
          <Reveal key={s.n} delay={0.05 * i}>
            <li className="flex gap-6 border-t border-border py-8">
              <span className="font-anton text-4xl text-primary">{s.n}</span>
              <div>
                <h3 className="text-xl font-bold text-foreground">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground font-body">{s.text}</p>
              </div>
            </li>
          </Reveal>
        ))}
      </ol>
    </div>
  </Section>
);

export const AboutBlock = () => (
  <Section tone="alt" id="about">
    <div className="grid items-center gap-12 lg:grid-cols-12">
      <Reveal className="lg:col-span-4">
        <div className="relative mx-auto flex aspect-square max-w-xs items-center justify-center rounded-lg border border-border bg-[#141414] shadow-card">
          <LogoMark className="h-3/4 w-3/4" />
        </div>
      </Reveal>
      <Reveal delay={0.1} className="lg:col-span-8">
        <p className="eyebrow mb-4">About</p>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl">Hi, I'm <span className="text-primary">Salman</span></h2>
        <div className="mt-6 max-w-2xl space-y-4 text-base leading-relaxed text-muted-foreground font-body md:text-lg">
          <p>
            I'm a Blender environment artist with 2+ years of experience. I build realistic and cinematic scenes, then teach the full process on YouTube so you can build them too.
          </p>
          <p>
            Everything here is made by hand in Blender, no AI. I sell the scene files and kits so you can open them, see how they are built and learn faster.
          </p>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/about" className="inline-flex items-center rounded-md border border-foreground/30 px-5 py-3 text-sm font-bold text-foreground transition-colors hover:bg-secondary">
            More about me
          </Link>
          <a href={YT} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-md px-5 py-3 text-sm font-bold text-foreground hover:text-primary transition-colors">
            YouTube channel <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </Reveal>
    </div>
  </Section>
);

export const SubscribeBand = () => (
  <Section id="subscribe">
    <div className="grid items-center gap-10 lg:grid-cols-2">
      <Reveal>
        <p className="eyebrow mb-4">Free files</p>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl">Get the free <span className="text-primary">project files</span></h2>
        <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground font-body md:text-lg">
          Join with your email to unlock the free downloads and get a note when a new tutorial or file is out.
        </p>
        <ul className="mt-6 space-y-3">
          {["Free Blender project files and tools", "New tutorial and release alerts", "Unsubscribe any time"].map((t) => (
            <li key={t} className="flex items-center gap-3 text-sm font-semibold text-foreground font-body">
              <Box className="h-4 w-4 text-primary" /> {t}
            </li>
          ))}
        </ul>
      </Reveal>
      <Reveal delay={0.1}>
        <SubscribeForm />
      </Reveal>
    </div>
  </Section>
);

export const ContactBand = () => (
  <section className="bg-[#141414] py-20 text-white lg:py-24">
    <div className="container mx-auto px-6 text-center">
      <h2 className="mx-auto max-w-3xl text-4xl sm:text-5xl lg:text-6xl">
        Have a project or a <span className="text-[#FFD23F]">question?</span>
      </h2>
      <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[#BDBDBD] font-body md:text-lg">
        Custom work, a kit you want to see, or a Blender problem. Send a message and I will get back to you.
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link to="/contact" className="inline-flex items-center gap-2 rounded-md bg-[#FFD23F] px-7 py-3.5 font-body font-bold text-[#141414] transition-opacity hover:opacity-90">
          <Mail className="h-4 w-4" />
          Contact me
        </Link>
        <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-md border border-white/30 px-7 py-3.5 font-body font-bold text-white transition-colors hover:bg-white/10">
          <Instagram className="h-4 w-4" />
          Follow me on Instagram
        </a>
        <a href={`${YT}?sub_confirmation=1`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-md border border-white/30 px-7 py-3.5 font-body font-bold text-white transition-colors hover:bg-white/10">
          <Youtube className="h-4 w-4" />
          Subscribe on YouTube
        </a>
      </div>
    </div>
  </section>
);
