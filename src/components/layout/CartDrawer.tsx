"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, total } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/40"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-[80] w-full max-w-md bg-white shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-serif text-xl tracking-wider">Carrinho</h2>
              <button onClick={() => setIsOpen(false)} className="p-1">
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 text-muted">
                <ShoppingBag size={48} strokeWidth={1} />
                <p className="text-sm">Seu carrinho está vazio</p>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-sm underline hover:text-foreground transition-colors"
                >
                  Continuar comprando
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={`${item.productId}-${item.size}-${item.color}`}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-4"
                    >
                      <div className="relative w-20 h-28 bg-cream flex-shrink-0 overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium truncate">{item.title}</h3>
                        <p className="text-xs text-muted mt-0.5">
                          {item.size} / {item.color}
                        </p>
                        <p className="text-sm mt-1">{formatPrice(item.price)}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.size,
                                item.color,
                                item.quantity - 1
                              )
                            }
                            className="w-7 h-7 border border-border flex items-center justify-center hover:bg-cream transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-sm w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.size,
                                item.color,
                                item.quantity + 1
                              )
                            }
                            className="w-7 h-7 border border-border flex items-center justify-center hover:bg-cream transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                          <button
                            onClick={() =>
                              removeItem(item.productId, item.size, item.color)
                            }
                            className="text-xs text-muted ml-auto hover:text-sale transition-colors"
                          >
                            Remover
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="border-t border-border p-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm tracking-wider uppercase">Total</span>
                    <span className="font-medium text-lg">{formatPrice(total)}</span>
                  </div>
                  <Link
                    href="/carrinho"
                    onClick={() => setIsOpen(false)}
                    className="block w-full bg-foreground text-background text-center py-3.5 text-sm tracking-wider uppercase hover:bg-accent transition-colors duration-300"
                  >
                    Finalizar compra
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}