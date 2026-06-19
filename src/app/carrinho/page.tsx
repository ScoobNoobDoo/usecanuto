"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

export default function CarrinhoPage() {
  const { items, removeItem, updateQuantity, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <ShoppingBag size={48} strokeWidth={1} className="mx-auto text-muted mb-6" />
        <h1 className="font-serif text-2xl tracking-wide mb-3">Carrinho vazio</h1>
        <p className="text-sm text-muted mb-8">
          Explore nossa coleção e encontre peças incríveis.
        </p>
        <Link
          href="/loja"
          className="inline-flex items-center gap-2 bg-foreground text-background px-8 py-3.5 text-sm tracking-wider uppercase hover:bg-accent transition-colors"
        >
          Ir para a loja
          <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-serif text-3xl tracking-wide mb-8"
      >
        Carrinho
      </motion.h1>

      <div className="space-y-4">
        {items.map((item, i) => (
          <motion.div
            key={`${item.productId}-${item.size}-${item.color}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex gap-4 sm:gap-6 border border-border p-4 sm:p-6"
          >
            <div className="relative w-24 h-32 sm:w-28 sm:h-36 bg-cream flex-shrink-0">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
                sizes="112px"
              />
            </div>
            <div className="flex-1 flex flex-col">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-sm font-medium">{item.title}</h3>
                  <p className="text-xs text-muted mt-1">
                    {item.size} / {item.color}
                  </p>
                </div>
                <button
                  onClick={() =>
                    removeItem(item.productId, item.size, item.color)
                  }
                  className="text-muted hover:text-sale transition-colors p-1"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="flex items-center justify-between mt-auto pt-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      updateQuantity(
                        item.productId,
                        item.size,
                        item.color,
                        item.quantity - 1
                      )
                    }
                    className="w-8 h-8 border border-border flex items-center justify-center hover:bg-cream transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-sm w-6 text-center">{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantity(
                        item.productId,
                        item.size,
                        item.color,
                        item.quantity + 1
                      )
                    }
                    className="w-8 h-8 border border-border flex items-center justify-center hover:bg-cream transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <span className="text-sm font-medium">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8 border-t border-border pt-8"
      >
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm tracking-wider uppercase">Subtotal</span>
          <span className="text-xl font-medium">{formatPrice(total)}</span>
        </div>
        <p className="text-xs text-muted mb-6">
          Frete calculado no checkout. Parcelamento em até 6x no cartão.
        </p>
        <Link
          href="/checkout"
          className="block w-full bg-foreground text-background text-center py-4 text-sm tracking-wider uppercase hover:bg-accent transition-colors duration-300"
        >
          Finalizar compra
        </Link>
      </motion.div>
    </div>
  );
}