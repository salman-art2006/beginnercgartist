import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Play, ArrowRight } from "lucide-react";

const HeroSection = () => (
  <section className="relative isolate overflow-hidden bg-[#141414] text-white">
    <img
      src="/images/hero-render-1280.webp"
      srcSet="/images/hero-render-1280.webp 1280w, /images/hero-render.webp 1920w"
      sizes="100vw"
      alt="Two giant stone frogs guarding a waterfall pond, rendered in Blender"
      width={1920}
      height={1080}
      {...{ fetchpriority: "high" }}
      className="absolute inset-0 -z-10 h-full w-full object-cover brightness-[0.5] saturate-[0.8]"
    />
    <div className="absolute inset-0 -z-10 bg-[#141414]/35" />
    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#141414]/90 via-[#141414]/50 to-transparent" />
    <div className="absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-gradient-to-t from-[#141414] to-transparent" />

    <div className="container mx-auto flex min-h-[100svh] flex-col justify-center px-6 pb-16 pt-28">
      <motion.h1
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-[12ch] text-[clamp(3.25rem,9vw,8rem)] leading-[0.94] text-white"
      >
        Realistic Blender Environments
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-6 max-w-md text-lg leading-relaxed text-white/85 font-body"
      >
        Learn to build the exact scene you see, step by step, then download the files. Made in Blender, no AI.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35 }}
        className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4"
      >
        <a
          href="https://www.youtube.com/@BeginnerCGArtist"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md bg-[#FFD23F] px-8 py-4 font-body text-base font-bold text-[#141414] transition-opacity hover:opacity-90"
        >
          <Play className="h-4 w-4 fill-current" />
          Watch on YouTube
        </a>
        <Link to="/library" className="group inline-flex items-center gap-2 font-body font-bold text-white">
          <span className="border-b border-white/50 pb-0.5 group-hover:border-white">Get free files</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </motion.div>
    </div>
  </section>
);

export default HeroSection;
