"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";

export default function Newsletter() {
  const { newsletter } = useSiteContent();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section className="py-20 border-t border-border">
      <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs tracking-[0.3em] uppercase text-muted">
            {newsletter.eyebrow}
          </span>
          <h2 className="font-serif text-3xl tracking-wide mt-2 mb-3">
            {newsletter.title}
          </h2>
          <p className="text-sm text-muted mb-8">{newsletter.description}</p>

          {submitted ? (
            <motion.p
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-sm text-accent"
            >
              {newsletter.successMessage}
            </motion.p>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-0 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu e-mail"
                required
                className="flex-1 border border-border px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors"
              />
              <button
                type="submit"
                className="bg-foreground text-background px-5 hover:bg-accent transition-colors duration-300"
              >
                <ArrowRight size={18} />
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}