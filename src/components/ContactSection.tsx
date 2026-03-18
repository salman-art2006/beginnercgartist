import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Instagram, Youtube, Mail, Globe } from "lucide-react";

const socials = [
  { icon: Instagram, label: "Instagram", href: "#", handle: "@artist" },
  { icon: Youtube, label: "YouTube", href: "#", handle: "3D Artist" },
  { icon: Globe, label: "ArtStation", href: "#", handle: "artist" },
  { icon: Mail, label: "Email", href: "mailto:hello@artist.com", handle: "hello@artist.com" },
];

const ContactSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section id="contact" className="py-32" ref={ref}>
      <div className="container mx-auto px-6 max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="text-primary font-display text-sm tracking-[0.3em] uppercase mb-4">
            Connect
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            Let's <span className="text-gradient-gold">Create</span>
          </h2>
          <p className="text-muted-foreground font-body mb-12">
            Follow along on social media or reach out directly.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-colors group shadow-card"
            >
              <s.icon className="w-6 h-6 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <p className="font-display text-sm font-medium text-foreground">{s.label}</p>
              <p className="text-muted-foreground text-xs mt-1 font-body">{s.handle}</p>
            </a>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-muted-foreground/50 text-sm font-body mt-20"
        >
          © 2026 3D Environment Artist. Built with passion.
        </motion.p>
      </div>
    </section>
  );
};

export default ContactSection;
