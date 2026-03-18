import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { FileDown, BookOpen, Layers, Eye } from "lucide-react";

const benefits = [
  { icon: FileDown, title: "Free Project Files", desc: "Download Blender project files and assets from featured environments." },
  { icon: BookOpen, title: "Workflow Explanations", desc: "Step-by-step breakdowns of how each environment was created." },
  { icon: Layers, title: "Learning Resources", desc: "Curated tips, tutorials, and techniques for environment art." },
  { icon: Eye, title: "Behind the Scenes", desc: "Exclusive look into the creative process and decision-making." },
];

const BenefitsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section className="py-32 bg-card/50" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-primary font-display text-sm tracking-[0.3em] uppercase mb-4">
            Subscriber Benefits
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-bold">
            What You <span className="text-gradient-gold">Get</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="bg-card border border-border rounded-xl p-6 text-center shadow-card hover:border-primary/30 transition-colors group"
            >
              <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mx-auto mb-4 group-hover:shadow-glow transition-shadow">
                <b.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">{b.title}</h3>
              <p className="text-muted-foreground text-sm font-body leading-relaxed">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
