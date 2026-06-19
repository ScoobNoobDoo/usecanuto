"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";

export default function HeroBanner() {
  const { hero } = useSiteContent();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative h-[85vh] min-h-[600px] overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0">
        <Image
          src={hero.image}
          alt="Coleção UseCanuto"
          fill
          priority
          unoptimized={hero.image.startsWith("http")}
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center"
      >
        <div className="max-w-lg">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 3.5 }}
            className="inline-block text-xs tracking-[0.3em] uppercase text-white/70 mb-4"
          >
            {hero.eyebrow}
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 3.7 }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl text-white font-light leading-tight"
          >
            {hero.title}
            <br />
            <span className="italic">{hero.titleAccent}</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 3.9 }}
            className="text-white/60 mt-4 text-sm leading-relaxed max-w-sm"
          >
            {hero.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 4.1 }}
            className="flex gap-4 mt-8"
          >
            <Link
              href={hero.primaryCta.href}
              className="group inline-flex items-center gap-2 bg-white text-foreground px-8 py-3.5 text-sm tracking-wider uppercase hover:bg-accent hover:text-white transition-all duration-300"
            >
              {hero.primaryCta.text}
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </Link>
            <Link
              href={hero.secondaryCta.href}
              className="inline-flex items-center gap-2 border border-white/40 text-white px-8 py-3.5 text-sm tracking-wider uppercase hover:bg-white/10 transition-all duration-300"
            >
              {hero.secondaryCta.text}
            </Link>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, delay: 4.3 }}
        className="absolute bottom-0 left-0 right-0 h-px bg-white/20 origin-left"
      />
    </section>
  );
}