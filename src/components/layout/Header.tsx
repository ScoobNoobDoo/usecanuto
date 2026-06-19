"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Heart,
  ShoppingBag,
  Menu,
  X,
  User,
  ChevronDown,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useSiteContent } from "@/context/SiteContentContext";

const NAV_ITEMS = [
  {
    label: "Novidades",
    href: "/loja",
    children: [
      { label: "Vestidos", href: "/loja?categoria=vestidos" },
      { label: "Blusas", href: "/loja?categoria=blusas" },
      { label: "Calças", href: "/loja?categoria=calcas" },
      { label: "Saias", href: "/loja?categoria=saias" },
    ],
  },
  {
    label: "Sale",
    href: "/loja?sale=true",
    children: [
      { label: "Até 40% OFF", href: "/loja?sale=true" },
      { label: "Últimas peças", href: "/loja" },
    ],
  },
  {
    label: "Coleções",
    href: "/loja",
    children: [
      { label: "Verão 26", href: "/loja" },
      { label: "Essenciais", href: "/loja" },
      { label: "Acessórios", href: "/loja?categoria=acessorios" },
    ],
  },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const { count, setIsOpen } = useCart();
  const { headerMarquee, brandName } = useSiteContent();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "glass shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="bg-foreground text-background text-center py-2 text-xs tracking-[0.2em] uppercase overflow-hidden">
          <div className="animate-marquee whitespace-nowrap inline-flex gap-16">
            {[...Array(4)].map((_, i) => (
              <span key={i} className="inline-flex gap-16">
                {headerMarquee.map((line, j) => (
                  <span key={j}>{line}</span>
                ))}
              </span>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <button
              className="lg:hidden p-2 -ml-2"
              onClick={() => setMenuOpen(true)}
              aria-label="Menu"
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>

            <nav className="hidden lg:flex items-center gap-8 flex-1">
              {NAV_ITEMS.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setActiveMenu(item.label)}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  <Link
                    href={item.href}
                    className="text-sm tracking-wider uppercase flex items-center gap-1 hover:text-accent transition-colors duration-300"
                  >
                    {item.label}
                    <ChevronDown size={12} className="opacity-50" />
                  </Link>
                  <AnimatePresence>
                    {activeMenu === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 pt-4"
                      >
                        <div className="bg-white shadow-xl border border-border min-w-[200px] py-3">
                          {item.children.map((child) => (
                            <Link
                              key={child.label}
                              href={child.href}
                              className="block px-5 py-2.5 text-sm hover:bg-cream transition-colors"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>

            <Link href="/" className="absolute left-1/2 -translate-x-1/2">
              <motion.h1
                className="font-serif text-2xl lg:text-3xl tracking-[0.15em] font-light"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {brandName}
              </motion.h1>
            </Link>

            <div className="flex items-center gap-3 lg:gap-5 flex-1 justify-end">
              <button className="hidden sm:block p-2 hover:text-accent transition-colors" aria-label="Buscar">
                <Search size={20} strokeWidth={1.5} />
              </button>
              <button className="hidden sm:block p-2 hover:text-accent transition-colors" aria-label="Favoritos">
                <Heart size={20} strokeWidth={1.5} />
              </button>
              <Link
                href="/admin/login"
                className="hidden md:flex items-center gap-1.5 text-xs tracking-wider uppercase text-muted hover:text-accent transition-colors"
              >
                <User size={16} strokeWidth={1.5} />
                <span>Admin</span>
              </Link>
              <motion.button
                className="relative p-2 hover:text-accent transition-colors"
                onClick={() => setIsOpen(true)}
                whileTap={{ scale: 0.95 }}
                aria-label="Carrinho"
              >
                <ShoppingBag size={20} strokeWidth={1.5} />
                <AnimatePresence>
                  {count > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-0.5 -right-0.5 bg-foreground text-background text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium"
                    >
                      {count}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/40 lg:hidden"
            onClick={() => setMenuOpen(false)}
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute left-0 top-0 bottom-0 w-[80%] max-w-sm bg-white p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8">
                <span className="font-serif text-xl tracking-widest">{brandName}</span>
                <button onClick={() => setMenuOpen(false)}>
                  <X size={22} />
                </button>
              </div>
              <nav className="space-y-1">
                {NAV_ITEMS.map((item) => (
                  <div key={item.label}>
                    <Link
                      href={item.href}
                      className="block py-3 text-sm tracking-wider uppercase font-medium"
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                    <div className="pl-4 space-y-1 mb-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="block py-1.5 text-sm text-muted"
                          onClick={() => setMenuOpen(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
                <Link
                  href="/admin/login"
                  className="block py-3 text-sm tracking-wider uppercase text-accent mt-4"
                  onClick={() => setMenuOpen(false)}
                >
                  Área Admin
                </Link>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}