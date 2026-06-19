"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { STORE_CATEGORIES } from "@/lib/categories";

export default function CategoryGrid() {
  return (
    <section className="py-16 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="text-xs tracking-[0.3em] uppercase text-muted">
            Explore por categoria
          </span>
          <h2 className="font-serif text-3xl tracking-wide mt-2">Navegue</h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {STORE_CATEGORIES.filter((cat) => cat.slug !== "acessorios").map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <Link href={`/loja?categoria=${cat.slug}`} className="group block relative aspect-[4/5] overflow-hidden">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                  <h3 className="text-white font-serif text-lg sm:text-xl tracking-wider">
                    {cat.name}
                  </h3>
                  <motion.span
                    className="inline-block text-white/70 text-xs tracking-wider uppercase mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    Ver coleção →
                  </motion.span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}