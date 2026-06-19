"use client";

import ProductCard from "@/components/product/ProductCard";
import { motion } from "framer-motion";
import type { ProductData } from "@/lib/utils";

export default function ProductGrid({
  products,
  title = "Destaques",
  subtitle,
}: {
  products: ProductData[];
  title?: string;
  subtitle?: string;
}) {
  if (!products.length) return null;

  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          {subtitle && (
            <span className="text-xs tracking-[0.3em] uppercase text-muted">
              {subtitle}
            </span>
          )}
          <h2 className="font-serif text-3xl sm:text-4xl tracking-wide mt-2">
            {title}
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-px w-16 bg-accent mx-auto mt-4 origin-center"
          />
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-12">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}