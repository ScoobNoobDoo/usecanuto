"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Globe, Share2 } from "lucide-react";

const FOOTER_LINKS = {
  Loja: [
    { label: "Novidades", href: "/loja" },
    { label: "Vestidos", href: "/loja?categoria=vestidos" },
    { label: "Blusas", href: "/loja?categoria=blusas" },
    { label: "Sale", href: "/loja?sale=true" },
  ],
  Ajuda: [
    { label: "Trocas e Devoluções", href: "#" },
    { label: "Entregas", href: "#" },
    { label: "Pagamento", href: "#" },
    { label: "Contato", href: "#" },
  ],
  Institucional: [
    { label: "A Marca", href: "#" },
    { label: "Política de Privacidade", href: "#" },
    { label: "Termos de Uso", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-foreground text-background mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="font-serif text-2xl tracking-[0.15em] mb-4">USECANUTO</h3>
            <p className="text-sm text-background/60 leading-relaxed">
              Moda feminina com elegância e protagonismo. Peças pensadas para
              vestir mulheres que protagonizam suas escolhas.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="hover:text-accent-light transition-colors" aria-label="Instagram">
                <Globe size={20} strokeWidth={1.5} />
              </a>
              <a href="#" className="hover:text-accent-light transition-colors" aria-label="Facebook">
                <Share2 size={20} strokeWidth={1.5} />
              </a>
            </div>
          </motion.div>

          {Object.entries(FOOTER_LINKS).map(([title, links], i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <h4 className="text-xs tracking-[0.2em] uppercase mb-4 text-background/80">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-background/50 hover:text-background transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="border-t border-background/10 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-background/40">
            © {new Date().getFullYear()} UseCanuto. Todos os direitos reservados.
          </p>
          <div className="flex gap-6 text-xs text-background/40">
            <span>Cartão em até 6x</span>
            <span>PIX disponível</span>
            <span>Entrega expressa</span>
          </div>
        </div>
      </div>
    </footer>
  );
}