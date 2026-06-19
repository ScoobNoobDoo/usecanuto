"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSiteContent } from "@/context/SiteContentContext";

export default function WelcomeAnimation() {
  const { welcome } = useSiteContent();
  const [show, setShow] = useState(true);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 600);
    const t2 = setTimeout(() => setPhase(2), 1800);
    const t3 = setTimeout(() => setShow(false), 3200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="fixed inset-0 z-[100] bg-foreground flex items-center justify-center overflow-hidden"
        >
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-px bg-background/10"
                style={{ left: `${15 + i * 14}%`, height: "100%" }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 1.2, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              />
            ))}
          </div>

          <motion.div
            className="absolute w-64 h-64 rounded-full border border-background/5"
            animate={{ scale: [1, 1.5, 2], opacity: [0.3, 0.1, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          />

          <div className="relative text-center z-10">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: phase >= 1 ? 1 : 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="h-px w-32 bg-accent-light mx-auto mb-8 origin-center"
            />

            <motion.h1
              className="font-serif text-4xl sm:text-6xl md:text-7xl tracking-[0.2em] text-background font-light"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: phase >= 0 ? 1 : 0, y: phase >= 0 ? 0 : 30 }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {welcome.title}
            </motion.h1>

            <motion.p
              className="text-background/50 text-sm tracking-[0.4em] uppercase mt-6"
              initial={{ opacity: 0, letterSpacing: "0.6em" }}
              animate={{
                opacity: phase >= 1 ? 1 : 0,
                letterSpacing: phase >= 1 ? "0.4em" : "0.6em",
              }}
              transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {welcome.subtitle}
            </motion.p>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: phase >= 2 ? 1 : 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="h-px w-20 bg-background/20 mx-auto mt-8 origin-center"
            />
          </div>

          <motion.div
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 2 ? 0.4 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="w-5 h-8 border border-background/30 rounded-full flex justify-center pt-2"
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <motion.div className="w-0.5 h-1.5 bg-background/50 rounded-full" />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}