import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-32 relative" ref={ref}>
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <p className="text-primary font-display text-sm tracking-[0.3em] uppercase mb-4">
            About
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-8">
            Building Worlds,{" "}
            <span className="text-gradient-gold">One Polygon at a Time</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid md:grid-cols-2 gap-8 mt-12"
        >
          <div className="bg-card rounded-xl p-8 border border-border shadow-card">
            <h3 className="font-display text-xl font-semibold mb-4 text-foreground">
              The Journey
            </h3>
            <p className="text-muted-foreground leading-relaxed font-body">
              With 1 year of dedicated experience in Blender, I've been building immersive 3D environments — 
              from ancient ruins to futuristic cityscapes. Every scene tells a story, and every render pushes 
              the boundaries of what's possible.
            </p>
          </div>

          <div className="bg-card rounded-xl p-8 border border-border shadow-card">
            <h3 className="font-display text-xl font-semibold mb-4 text-foreground">
              The Mission
            </h3>
            <p className="text-muted-foreground leading-relaxed font-body">
              As an independent artist, I'm building a community around environment art. Sharing project files, 
              workflow breakdowns, and learning resources — because great art grows when knowledge is shared.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-8 mt-16"
        >
          {[
            { label: "Year in Blender", value: "1+" },
            { label: "Environments Created", value: "20+" },
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
  );
};

export default AboutSection;
