import { Link } from "react-router-dom";
import { ArrowUpRight, Mountain, Sun, Trees, Video } from "lucide-react";
import Layout from "@/components/Layout";
import PageMeta from "@/components/PageMeta";
import { LogoMark } from "@/components/Logo";
import { Reveal, Section, YT, GUMROAD } from "@/components/home/shared";
import { TOOLS, ToolIcon } from "@/components/ToolIcon";

const facts = [
  { value: "2+", label: "years working in Blender" },
  { value: "Cycles", label: "render engine I use" },
  { value: "No AI", label: "every scene made by hand" },
];

const focus = [
  { icon: Mountain, title: "Terrain and architecture", text: "Ground, rocks, buildings and ruins that feel like a real place." },
  { icon: Trees, title: "Vegetation and scatter", text: "Believable plants and detail without repeating patterns." },
  { icon: Sun, title: "Light and atmosphere", text: "Sun, fog, volumes and depth of field that set the mood." },
  { icon: Video, title: "Camera and animation", text: "Slow, weighty cinematic camera moves for short environment pieces." },
];

const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Salman",
  alternateName: "Beginner CG Artist",
  jobTitle: "Blender Environment Artist",
  url: "https://beginnercgartist.com/about",
  knowsAbout: ["Blender", "3D environment art", "Cycles", "Geometry Nodes", "Cinematic lighting", "Vegetation scattering"],
  sameAs: [YT, "https://www.instagram.com/beginnercg_artist/", "https://www.artstation.com/beginnercgartist", GUMROAD],
};

const About = () => (
  <Layout>
    <PageMeta
      title="About Salman"
      description="Salman is a Blender environment artist with 2+ years of experience. He builds realistic, cinematic environments and teaches the full process on YouTube."
      path="/about"
      jsonLd={personLd}
    />

    <section className="pt-36 pb-16 lg:pt-44 lg:pb-24">
      <div className="container mx-auto px-6 grid items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <p className="eyebrow mb-5">About</p>
          <h1 className="text-[clamp(3rem,8vw,7rem)] leading-[0.94]">
            Hi, I'm <span className="text-primary">Salman</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground font-body md:text-xl">
            I'm a Blender environment artist with 2+ years of experience. I build realistic and cinematic scenes, then explain the whole process step by step so you can build them too.
          </p>
        </div>
        <div className="lg:col-span-4">
          <div className="mx-auto flex aspect-square max-w-xs items-center justify-center rounded-lg border border-border bg-[#141414] shadow-card">
            <LogoMark className="h-3/4 w-3/4" />
          </div>
        </div>
      </div>
    </section>

    <div className="border-y border-border bg-card/50">
      <div className="container mx-auto grid grid-cols-3 divide-x divide-border px-6">
        {facts.map((f) => (
          <div key={f.label} className="px-4 py-8 text-center md:py-10">
            <p className="font-anton text-4xl text-foreground md:text-6xl">{f.value}</p>
            <p className="mt-2 text-xs font-semibold text-muted-foreground font-body md:text-sm">{f.label}</p>
          </div>
        ))}
      </div>
    </div>

    <Section>
      <div className="grid gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <p className="eyebrow mb-4">What I do</p>
          <h2 className="text-4xl sm:text-5xl">Realistic environments, <span className="text-primary">explained</span></h2>
        </Reveal>
        <Reveal delay={0.1} className="space-y-5 text-base leading-relaxed text-muted-foreground font-body md:text-lg lg:col-span-8">
          <p>
            My work is environment art: places you could walk into. Most of it is realistic, some of it is dreamy or fantasy, and all of it is lit and rendered in Cycles.
          </p>
          <p>
            I make videos that show the result first and then build it with you. When a scene is worth studying, I package the project file so you can open it, click through it and see how it works.
          </p>
          <p>
            I only claim what is true: the Blender version is the one I used, assets are my own or free to use, and nothing here is made with AI.
          </p>
        </Reveal>
      </div>
    </Section>

    <Section tone="alt">
      <Reveal className="mb-12 max-w-2xl">
        <p className="eyebrow mb-4">Focus</p>
        <h2 className="text-4xl sm:text-5xl">What I <span className="text-primary">work on</span></h2>
      </Reveal>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {focus.map((f, i) => (
          <Reveal key={f.title} delay={0.06 * i}>
            <div className="h-full rounded-lg border border-border bg-card p-6 shadow-card">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-md bg-brand text-brand-foreground">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground font-body">{f.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>

    <Section>
      <div className="grid gap-10 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <p className="eyebrow mb-4">Tools</p>
          <h2 className="text-4xl sm:text-5xl">What I <span className="text-primary">use</span></h2>
        </Reveal>
        <Reveal delay={0.1} className="lg:col-span-8">
          <ul className="flex flex-wrap gap-3">
            {TOOLS.map((t) => (
              <li key={t.name} className="flex items-center gap-3 rounded-lg border border-border bg-card px-5 py-3.5 text-sm font-bold text-foreground font-body shadow-card">
                <ToolIcon tool={t} className="h-6 w-6" />
                {t.name}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>

    <section className="bg-[#141414] py-20 text-white lg:py-24">
      <div className="container mx-auto px-6 text-center">
        <h2 className="mx-auto max-w-3xl text-4xl sm:text-5xl lg:text-6xl text-white">Let's build something</h2>
        <p className="mx-auto mt-5 max-w-xl text-[#BDBDBD] font-body md:text-lg">
          Watch the tutorials, grab a project file, or message me about a custom scene.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/contact" className="inline-flex items-center rounded-md bg-[#FFD23F] px-7 py-3.5 font-body font-bold text-[#141414] transition-opacity hover:opacity-90">
            Contact me
          </Link>
          <a href={YT} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-md border border-white/30 px-7 py-3.5 font-body font-bold text-white transition-colors hover:bg-white/10">
            YouTube channel <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  </Layout>
);

export default About;
