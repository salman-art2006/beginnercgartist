import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Lightbulb, Box, Paintbrush, Sun, Camera } from "lucide-react";

const steps = [
  { icon: Lightbulb, title: "Concept", desc: "Gathering references, mood boards, and defining the visual story." },
  { icon: Box, title: "Modeling", desc: "Building the 3D geometry — from blockout to detailed meshes in Blender." },
  { icon: Paintbrush, title: "Texturing", desc: "Adding materials, UV mapping, and creating realistic surface details." },
  { icon: Sun, title: "Lighting", desc: "Setting up volumetric lights, HDRI, and crafting the cinematic mood." },
  { icon: Camera, title: "Rendering", desc: "Final render passes, compositing, and post-processing in Blender." },
];

const WorkflowSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section id="workflow" className="py-32 bg-card/50" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-primary font-display text-sm tracking-[0.3em] uppercase mb-4">
            Process
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-bold">
            My <span className="text-gradient-gold">Workflow</span>
          </h2>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="flex items-start gap-6 mb-12 last:mb-0"
            >
              <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-secondary flex items-center justify-center border border-border">
                <step.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-primary font-display text-xs tracking-widest">
                    0{i + 1}
                  </span>
                  <h3 className="font-display text-xl font-semibold text-foreground">{step.title}</h3>
                </div>
                <p className="text-muted-foreground font-body leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkflowSection;
