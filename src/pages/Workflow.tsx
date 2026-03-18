import Layout from "@/components/Layout";
import PageMeta from "@/components/PageMeta";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { Lightbulb, Box, Paintbrush, Sun, Camera, Monitor, Layers, Settings } from "lucide-react";

const steps = [
  { icon: Lightbulb, title: "Concept & Research", desc: "Every project starts with gathering references, creating mood boards, and defining the visual story. I use PureRef to organize reference images — studying real-world architecture, lighting conditions, and natural phenomena that will inform the scene." },
  { icon: Box, title: "Blockout & Composition", desc: "Using simple shapes, I establish scale, camera angle, and compositional flow. This is the most important phase — if the blockout doesn't work, no amount of detail will save it. I test multiple camera angles before committing." },
  { icon: Layers, title: "Detailed Modeling", desc: "With the composition locked, I add geometric detail. Subdivision modeling for organic forms, boolean operations for damage and wear, and kitbashing from personal asset libraries for mechanical elements." },
  { icon: Paintbrush, title: "Materials & Texturing", desc: "I use a hybrid approach: procedural materials in Blender's shader editor for large-scale variation, and image textures from Quixel Megascans for fine surface detail. UV unwrapping strategy depends on asset importance." },
  { icon: Sun, title: "Lighting & Atmosphere", desc: "Lighting makes or breaks a scene. I start with HDRI for natural ambient light, then add key lights for dramatic focus. Volumetric effects — god rays, fog, dust particles — bring scenes to life." },
  { icon: Camera, title: "Rendering & Post", desc: "Final renders in Cycles with OptiX denoising. Post-processing adds color grading, subtle bloom, vignette, and chromatic aberration in the Blender compositor." },
];

const tools = [
  { icon: Monitor, name: "Blender 3.6+", desc: "Primary 3D application for all modeling, texturing, lighting, and rendering." },
  { icon: Paintbrush, name: "Substance Painter", desc: "Detailed texture painting for hero assets with PBR material workflows." },
  { icon: Settings, name: "Substance Designer", desc: "Procedural material creation for tileable textures and surface patterns." },
  { icon: Layers, name: "Quixel Megascans", desc: "Photogrammetry-based textures and 3D assets for photorealistic environments." },
];

const insights = [
  { title: "Start Simple", desc: "Don't jump to details. A beautiful blockout with great lighting will always outperform a detailed scene with bad composition." },
  { title: "Reference Everything", desc: "Reality is the best teacher. Study photos, visit real locations, observe how light behaves. Your 3D work will improve dramatically." },
  { title: "Iterate on Lighting", desc: "I often spend as much time on lighting as modeling. Save multiple lighting setups and compare them. Small changes create huge mood shifts." },
  { title: "Share Your Process", desc: "Document your work from the beginning. Process shots, viewport screenshots, and wip renders are more valuable than you think." },
];

const Workflow = () => {
  const introRef = useRef(null);
  const introInView = useInView(introRef, { once: true, margin: "-50px" });
  const stepsRef = useRef(null);
  const stepsInView = useInView(stepsRef, { once: true, margin: "-50px" });
  const toolsRef = useRef(null);
  const toolsInView = useInView(toolsRef, { once: true, margin: "-50px" });
  const insightsRef = useRef(null);
  const insightsInView = useInView(insightsRef, { once: true, margin: "-50px" });

  return (
    <Layout>
      <PageMeta
        title="Workflow"
        description="Learn the step-by-step 3D environment art workflow: concept, modeling, texturing, lighting, and rendering in Blender."
        path="/workflow"
      />

      {/* Section 1: Workflow Intro */}
      <section className="pt-28 pb-16" ref={introRef}>
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={introInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}>
            <p className="text-primary font-display text-sm tracking-[0.3em] uppercase mb-4">Process</p>
            <h1 className="font-display text-3xl md:text-5xl font-bold mb-6">My <span className="text-gradient-gold">Workflow</span></h1>
            <p className="text-muted-foreground font-body text-lg leading-relaxed">
              Creating a 3D environment is a journey from concept to final pixel. Each step builds on the previous one, and the process is as important as the result. Here's how I approach every project.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Section 2: Step-by-Step Process */}
      <section className="py-16 bg-card/50" ref={stepsRef}>
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={stepsInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="text-center mb-12">
            <h2 className="font-display text-2xl md:text-3xl font-bold">Step-by-Step <span className="text-gradient-gold">Process</span></h2>
          </motion.div>
          <div className="space-y-10">
            {steps.map((step, i) => (
              <motion.div key={step.title} initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }} animate={stepsInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: i * 0.1 }} className="flex items-start gap-6">
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-secondary flex items-center justify-center border border-border">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-primary font-display text-xs tracking-widest">0{i + 1}</span>
                    <h3 className="font-display text-xl font-semibold text-foreground">{step.title}</h3>
                  </div>
                  <p className="text-muted-foreground font-body leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Tools & Software */}
      <section className="py-16" ref={toolsRef}>
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={toolsInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="text-center mb-12">
            <h2 className="font-display text-2xl md:text-3xl font-bold">Tools & <span className="text-gradient-gold">Software</span></h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {tools.map((tool, i) => (
              <motion.div key={tool.name} initial={{ opacity: 0, y: 30 }} animate={toolsInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.08 }} className="bg-card border border-border rounded-xl p-6 text-center shadow-card">
                <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mx-auto mb-4">
                  <tool.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-base font-semibold text-foreground mb-2">{tool.name}</h3>
                <p className="text-muted-foreground text-sm font-body">{tool.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Learning Insights */}
      <section className="py-16 bg-card/50" ref={insightsRef}>
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={insightsInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="text-center mb-12">
            <h2 className="font-display text-2xl md:text-3xl font-bold">Process <span className="text-gradient-gold">Insights</span></h2>
            <p className="text-muted-foreground font-body mt-3">Lessons learned from creating 20+ environment scenes</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            {insights.map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} animate={insightsInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.1 }} className="bg-card border border-border rounded-xl p-6 shadow-card">
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm font-body leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/blog" className="border border-border text-foreground font-display font-medium px-8 py-3 rounded-lg hover:bg-secondary transition-colors inline-block">Read Workflow Articles</Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Workflow;
