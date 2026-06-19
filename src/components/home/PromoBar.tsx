"use client";

import { motion } from "framer-motion";
import { CreditCard, Truck, Gift, Zap } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";

const ICONS = [CreditCard, Truck, Zap, Gift];

export default function PromoBar() {
  const { promoBar } = useSiteContent();

  return (
    <section className="py-12 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {promoBar.map((item, i) => {
            const Icon = ICONS[i] || CreditCard;
            return (
              <motion.div
                key={`${item.title}-${i}`}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <Icon
                  size={24}
                  strokeWidth={1.5}
                  className="mx-auto mb-3 text-accent"
                />
                <h3 className="text-xs tracking-wider uppercase font-medium">
                  {item.title}
                </h3>
                <p className="text-xs text-muted mt-1">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}