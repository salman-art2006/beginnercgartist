import { Link } from "react-router-dom";
import { ArrowUpRight, Play } from "lucide-react";
import Layout from "@/components/Layout";
import PageMeta from "@/components/PageMeta";
import BeforeAfter from "@/components/BeforeAfter";
import { PageHeader } from "@/components/PageHeader";
import { TOOLS, ToolIcon } from "@/components/ToolIcon";
import { Reveal, Section, watchUrl } from "@/components/home/shared";

const steps = [
  {
    n: "01", title: "References and composition",
    text: "I collect references first and decide the camera angle and the one thing the eye should land on. Scale and mood are decided here, before any modelling.",
    points: ["Reference images for the look, scale and light", "Camera angle and focal point chosen early"],
  },
  {
    n: "02", title: "Terrain and blockout",
    text: "I sculpt the ground and place the big shapes: rocks, buildings, trees. Then I check the scene from the render camera. If the blockout does not work, details will not fix it.",
    points: ["Terrain sculpting", "Big shapes and scale checked through the camera"],
  },
  {
    n: "03", title: "Assets and architecture",
    text: "I build the hero pieces and use free, licence-clean assets for the rest. I vary rotation, scale and placement so nothing looks copy-pasted.",
    points: ["Own models plus free sources like Poly Haven and AmbientCG", "Variation so repetition stays hidden"],
    video: { id: "EXmLxHDj9fY", label: "Watch: Abandoned Gas Station tutorial" },
  },
  {
    n: "04", title: "Scatter and materials",
    text: "Grass, flowers and trees are scattered with the right tool for the Blender version I am on. Materials are mostly procedural: noise, colour ramps and mixes for natural variation.",
    points: ["Vegetation scattering and wind", "Procedural materials with Geometry Nodes where it helps"],
    video: { id: "PI3nV4OVzVY", label: "Watch: Procedural Vine Generator" },
  },
  {
    n: "05", title: "Light, atmosphere and camera",
    text: "I start with an HDRI or sky for natural light, rotate it until the shadows work, then add fog and volumes for depth. Depth of field and a slow, weighty camera finish the shot.",
    points: ["HDRI / Sky texture, volumetrics, depth of field", "Slow start, steady middle, slow finish for animation"],
    video: { id: "QlM7GWLuWHg", label: "Watch: Mistwood Giants breakdown" },
  },
  {
    n: "06", title: "Render and finish",
    text: "I render in Cycles. Heavy animation scenes go to a cloud GPU. The final look is graded in DaVinci Resolve, and stills are finished in Photopea.",
    points: ["Cycles with denoising, passes when needed", "Colour grading and final polish"],
    video: { id: "ltvXyxY9_Xg", label: "Watch: Post-process renders for free" },
  },
];

const toolNotes: Record<string, string> = {
  "Blender 5.2": "Everything 3D: modelling, sculpting, scattering, lighting and animation.",
  Cycles: "The render engine for every scene on this site.",
  "Geometry Nodes": "Procedural setups for scattering and repeatable details.",
  "DaVinci Resolve Studio": "Editing and colour grading for animations.",
  Photopea: "Free finishing for still renders in the browser.",
  "OctaSpace cloud rendering": "Cloud GPUs for scenes too heavy to render locally.",
};

const habits = [
  { title: "Check scale early", text: "Look through the render camera from the first minute. Scale mistakes are cheap to fix at blockout and expensive later." },
  { title: "Light with intent", text: "Try a few HDRI rotations and compare them. Small changes in light direction change the whole mood." },
  { title: "Vary everything", text: "Rotate, scale and swap assets. Repetition is the fastest way to make a scene look fake." },
  { title: "Render smart", text: "Test at low samples, lock the camera, and only then send the heavy final render." },
];

const Workflow = () => (
  <Layout>
    <PageMeta
      title="Workflow"
      description="How Salman builds realistic Blender environments, from references and blockout to Cycles rendering and colour grading, with the tools used at each step."
      path="/workflow"
    />
    <PageHeader
      eyebrow="Workflow"
      title={<>From grey blockout to <span className="text-primary">final render</span></>}
      intro="The same six steps sit behind every scene on this site."
    />

    <section className="pb-20">
      <div className="container mx-auto px-6">
        <BeforeAfter
          alt="Frog Island compared between the Blender viewport and the final Cycles render"
          beforeSrc="/images/hero-viewport-1280.webp"
          beforeSrcSet="/images/hero-viewport-1280.webp 1280w, /images/hero-viewport.webp 1920w"
          afterSrc="/images/hero-render-1280.webp"
          afterSrcSet="/images/hero-render-1280.webp 1280w, /images/hero-render.webp 1920w"
          sizes="(min-width: 1280px) 1200px, 100vw"
        />
        <p className="mt-3 text-sm font-semibold text-muted-foreground">Drag to compare: the Frog Island viewport on the left, the final render on the right.</p>
      </div>
    </section>

    <Section tone="alt">
      <ol>
        {steps.map((s, i) => (
          <Reveal key={s.n} delay={0.04 * (i % 3)}>
            <li className="grid gap-6 border-t border-border py-10 lg:grid-cols-12 lg:gap-10">
              <div className="flex items-baseline gap-5 lg:col-span-4">
                <span className="font-anton text-5xl text-primary">{s.n}</span>
                <h2 className="text-3xl leading-none sm:text-4xl">{s.title}</h2>
              </div>
              <div className="lg:col-span-5">
                <p className="text-base leading-relaxed text-muted-foreground font-body md:text-lg">{s.text}</p>
                <ul className="mt-5 space-y-2">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-start gap-3 text-sm font-semibold text-foreground font-body">
                      <span className="mt-1.5 h-2 w-2 shrink-0 bg-brand" aria-hidden="true" /> {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="lg:col-span-3 lg:justify-self-end">
                {s.video && (
                  <a href={watchUrl(s.video.id)} target="_blank" rel="noopener noreferrer" className="group block w-full max-w-xs">
                    <div className="relative overflow-hidden rounded-lg border border-border">
                      <img src={`/images/yt/${s.video.id}.webp`} alt={s.video.label} width={1280} height={720} loading="lazy" className="aspect-video w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]" />
                      <span className="absolute bottom-2.5 right-2.5 flex h-9 w-9 items-center justify-center rounded-full bg-brand text-brand-foreground"><Play className="h-3.5 w-3.5 fill-current" /></span>
                    </div>
                    <p className="mt-2 text-sm font-bold text-foreground transition-colors group-hover:text-primary">{s.video.label}</p>
                  </a>
                )}
              </div>
            </li>
          </Reveal>
        ))}
      </ol>
    </Section>

    <Section>
      <Reveal className="mb-12 max-w-2xl">
        <p className="eyebrow mb-4">Tools</p>
        <h2 className="text-4xl sm:text-5xl">What I use at <span className="text-primary">each step</span></h2>
      </Reveal>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((t, i) => (
          <Reveal key={t.name} delay={0.05 * i}>
            <div className="h-full rounded-lg border border-border bg-card p-6 shadow-card">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-md border border-border bg-background">
                <ToolIcon tool={t} className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">{t.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground font-body">{toolNotes[t.name]}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>

    <Section tone="alt">
      <Reveal className="mb-12 max-w-2xl">
        <p className="eyebrow mb-4">Habits</p>
        <h2 className="text-4xl sm:text-5xl">Four things that <span className="text-primary">help most</span></h2>
      </Reveal>
      <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
        {habits.map((h, i) => (
          <Reveal key={h.title} delay={0.05 * i}>
            <div className="border-t-2 border-foreground pt-5">
              <h3 className="text-xl font-bold text-foreground">{h.title}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground font-body">{h.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>

    <section className="bg-[#141414] py-20 text-white lg:py-24">
      <div className="container mx-auto px-6 text-center">
        <h2 className="mx-auto max-w-3xl text-4xl text-white sm:text-5xl lg:text-6xl">Want to see it built <span className="text-[#FFD23F]">in full?</span></h2>
        <p className="mx-auto mt-5 max-w-xl text-[#BDBDBD] font-body md:text-lg">The tutorials show each step on a real scene, and the library has the project files.</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/tutorials" className="inline-flex items-center rounded-md bg-[#FFD23F] px-7 py-3.5 font-bold text-[#141414] hover:opacity-90">Watch the tutorials</Link>
          <Link to="/library" className="inline-flex items-center gap-1.5 rounded-md border border-white/30 px-7 py-3.5 font-bold text-white hover:bg-white/10">Open the library <ArrowUpRight className="h-4 w-4" /></Link>
        </div>
      </div>
    </section>
  </Layout>
);

export default Workflow;
