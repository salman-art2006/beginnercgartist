import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import heroImg from "@/assets/hero-env.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="3D environment art - fantasy forest with volumetric lighting"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-primary font-display text-sm tracking-[0.3em] uppercase mb-6"
        >
          Independent Artist • Blender
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
        >
          3D Environment
          <br />
          <span className="text-gradient-gold">Artist</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 font-body"
        >
          Crafting immersive digital worlds and cinematic environments in Blender.
          Sharing the journey, the process, and the project files.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/resources"
            className="bg-gradient-gold text-primary-foreground font-display font-semibold px-8 py-4 rounded-lg hover:opacity-90 transition-opacity shadow-glow"
          >
            Get Project Files
          </Link>
          <Link
            to="/portfolio"
            className="border border-border text-foreground font-display font-medium px-8 py-4 rounded-lg hover:bg-secondary transition-colors"
          >
            View Portfolio
          </Link>
        </motion.div>

        {/* Platform badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="flex flex-col items-center gap-3 mt-8"
        >
          <p className="text-muted-foreground/60 text-xs font-body tracking-widest uppercase">Also available on</p>
          <div className="flex items-center gap-3">
            <a
              href="https://beginnercgartist.gumroad.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-background/40 backdrop-blur-sm border border-border/60 hover:border-primary/50 text-muted-foreground hover:text-primary transition-all px-4 py-2 rounded-lg text-sm font-display font-medium"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 19.2c-3.978 0-7.2-3.222-7.2-7.2S8.022 4.8 12 4.8c2.467 0 4.64 1.24 5.94 3.13l-2.07 1.16A3.84 3.84 0 0 0 12 7.68c-2.386 0-4.32 1.934-4.32 4.32S9.614 16.32 12 16.32c1.813 0 3.368-1.115 4.03-2.7H12v-2.4h6.48c.048.348.072.703.072 1.06 0 3.977-3.222 6.92-6.552 6.92z" />
              </svg>
              Gumroad
            </a>
            <a
              href="https://www.artstation.com/beginnercgartist"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-background/40 backdrop-blur-sm border border-border/60 hover:border-primary/50 text-muted-foreground hover:text-primary transition-all px-4 py-2 rounded-lg text-sm font-display font-medium"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M0 17.723l2.027 3.505h.001a2.424 2.424 0 0 0 2.164 1.333h13.457l-2.792-4.838H0zm24 .025c0-.484-.143-.935-.388-1.314L15.728 2.728a2.424 2.424 0 0 0-2.164-1.333H9.419L21.598 22.54l1.92-3.325c.378-.637.482-.919.482-1.467zm-11.129-3.462L7.428 4.858l-5.444 9.428h10.887z" />
              </svg>
              ArtStation
            </a>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-5 h-8 border-2 border-muted-foreground/30 rounded-full flex justify-center"
        >
          <div className="w-1 h-2 bg-primary rounded-full mt-1.5" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
