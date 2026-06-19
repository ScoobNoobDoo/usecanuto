"use client";

import { motion } from "framer-motion";
import { CreditCard, Truck, Gift, Zap } from "lucide-react";

const ITEMS = [
  { icon: CreditCard, title: "Pagamento", desc: "Cartão em até 6x | PIX em 4x" },
  { icon: Truck, title: "Frete Grátis", desc: "Acima de R$ 399" },
  { icon: Zap, title: "Entrega Expressa", desc: "Receba em até 1 dia útil" },
  { icon: Gift, title: "Primeira compra", desc: "15% OFF — BEMVINDA15" },
];

export default function PromoBar() {
  return (
    <section className="py-12 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {ITEMS.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <item.icon
                size={24}
                strokeWidth={1.5}
                className="mx-auto mb-3 text-accent"
              />
              <h3 className="text-xs tracking-wider uppercase font-medium">
                {item.title}
              </h3>
              <p className="text-xs text-muted mt-1">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}