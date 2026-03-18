import Layout from "@/components/Layout";
import PageMeta from "@/components/PageMeta";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { Palette, Monitor, Boxes, Cpu, Target, Sparkles } from "lucide-react";

const skills = [
  { icon: Boxes, name: "3D Modeling", desc: "Hard-surface and organic modeling with clean topology for game and film assets." },
  { icon: Palette, name: "Texturing", desc: "Procedural shaders, PBR materials, and hand-painted textures for believable surfaces." },
  { icon: Sparkles, name: "Lighting", desc: "Cinematic lighting setups with volumetrics, HDRI, and color temperature storytelling." },
  { icon: Monitor, name: "Rendering", desc: "Production renders in Cycles and EEVEE with compositing and post-processing." },
  { icon: Cpu, name: "Blender", desc: "Primary tool for all 3D work — modeling, sculpting, texturing, animation, and rendering." },
  { icon: Target, name: "Composition", desc: "Camera framing, visual hierarchy, and storytelling through environmental design." },
];

const About = () => {
  const storyRef = useRef(null);
  const storyInView = useInView(storyRef, { once: true, margin: "-50px" });
  const skillsRef = useRef(null);
  const skillsInView = useInView(skillsRef, { once: true, margin: "-50px" });
  const philosophyRef = useRef(null);
  const philosophyInView = useInView(philosophyRef, { once: true, margin: "-50px" });
  const journeyRef = useRef(null);
  const journeyInView = useInView(journeyRef, { once: true, margin: "-50px" });

  return (
    <Layout>
      <PageMeta
        title="About"
        description="Independent 3D Environment Artist with 1 year of Blender experience. Building a community around environment art, sharing workflows and project files."
        path="/about"
      />

      {/* Section 1: Personal Story */}
      <section className="pt-28 pb-20" ref={storyRef}>
        <div className="container mx-auto px-6 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={storyInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="text-center mb-12">
            <p className="text-primary font-display text-sm tracking-[0.3em] uppercase mb-4">About</p>
            <h1 className="font-display text-3xl md:text-5xl font-bold mb-6">Building Worlds, <span className="text-gradient-gold">One Polygon at a Time</span></h1>
            <p className="text-muted-foreground font-body text-lg max-w-2xl mx-auto leading-relaxed">
              I'm an independent 3D environment artist with a passion for creating immersive digital worlds in Blender. What started as curiosity about 3D software turned into a full creative obsession — and now I'm building a community around the art of virtual world-building.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 40 }} animate={storyInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.2 }} className="grid md:grid-cols-2 gap-8">
            <div className="bg-card rounded-xl p-8 border border-border shadow-card">
              <h3 className="font-display text-xl font-semibold mb-4 text-foreground">The Beginning</h3>
              <p className="text-muted-foreground leading-relaxed font-body">
                One year ago, I opened Blender for the first time. Within weeks, I was hooked — spending every free moment learning about vertices, faces, and shader nodes. My first environment was a simple forest clearing, but it taught me something profound: 3D art isn't about perfecting individual objects, it's about crafting entire experiences. That realization changed everything.
              </p>
            </div>
            <div className="bg-card rounded-xl p-8 border border-border shadow-card">
              <h3 className="font-display text-xl font-semibold mb-4 text-foreground">The Mission</h3>
              <p className="text-muted-foreground leading-relaxed font-body">
                As an independent artist, I believe in learning in public and sharing the journey. Every project file I release, every workflow breakdown I write, is an invitation for others to learn alongside me. I'm not waiting to become an expert before sharing — the process itself is the value. My goal is to build a community of creators who support each other's growth.
              </p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={storyInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.4 }} className="flex flex-wrap justify-center gap-10 mt-16">
            {[
              { label: "Year in Blender", value: "1+" },
              { label: "Environments Created", value: "20+" },
              { label: "Project Files Shared", value: "10+" },
              { label: "Community Members", value: "Growing" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-display text-3xl font-bold text-gradient-gold">{stat.value}</p>
                <p className="text-muted-foreground text-sm mt-1 font-body">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Section 2: Skills & Tools */}
      <section className="py-20 bg-card/50" ref={skillsRef}>
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={skillsInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="text-center mb-12">
            <p className="text-primary font-display text-sm tracking-[0.3em] uppercase mb-4">Capabilities</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold">Skills & <span className="text-gradient-gold">Tools</span></h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {skills.map((skill, i) => (
              <motion.div key={skill.name} initial={{ opacity: 0, y: 30 }} animate={skillsInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.08 }} className="bg-card border border-border rounded-xl p-6 shadow-card hover:border-primary/30 transition-colors group">
                <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mb-4 group-hover:shadow-glow transition-shadow">
                  <skill.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{skill.name}</h3>
                <p className="text-muted-foreground text-sm font-body leading-relaxed">{skill.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Creative Philosophy */}
      <section className="py-20" ref={philosophyRef}>
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={philosophyInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="text-center mb-12">
            <p className="text-primary font-display text-sm tracking-[0.3em] uppercase mb-4">Philosophy</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold">Creative <span className="text-gradient-gold">Direction</span></h2>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={philosophyInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.2 }} className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">Storytelling First</h3>
              <p className="text-muted-foreground text-sm font-body leading-relaxed">Every environment should tell a story. Before I model a single polygon, I ask: what happened here? Who lived here? What feeling should the viewer experience?</p>
            </div>
            <div className="text-center">
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">Cinematic Mood</h3>
              <p className="text-muted-foreground text-sm font-body leading-relaxed">I approach every scene like a film frame. Lighting, composition, and atmosphere are not afterthoughts — they're the foundation of the emotional impact.</p>
            </div>
            <div className="text-center">
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">Open Knowledge</h3>
              <p className="text-muted-foreground text-sm font-body leading-relaxed">Art grows when knowledge is shared freely. I publish project files, explain my mistakes, and document the learning process for the community.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 4: The Journey Ahead */}
      <section className="py-20 bg-card/50" ref={journeyRef}>
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={journeyInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}>
            <p className="text-primary font-display text-sm tracking-[0.3em] uppercase mb-4">What's Next</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">The Journey <span className="text-gradient-gold">Ahead</span></h2>
            <p className="text-muted-foreground font-body text-lg leading-relaxed mb-8">
              I'm just getting started. My goals for this year include mastering photorealistic exterior environments, exploring real-time rendering in EEVEE, and growing this community of creators to hundreds of subscribers. Every project I complete teaches me something new, and I want to bring you along for the ride.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/portfolio" className="bg-gradient-gold text-primary-foreground font-display font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity shadow-glow inline-block">View My Work</Link>
              <Link to="/resources" className="border border-border text-foreground font-display font-medium px-8 py-3 rounded-lg hover:bg-secondary transition-colors inline-block">Get Project Files</Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
