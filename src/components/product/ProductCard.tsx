"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Eye } from "lucide-react";
import { formatPrice, type ProductData } from "@/lib/utils";
import ProductModal from "./ProductModal";

export default function ProductCard({
  product,
  index = 0,
}: {
  product: ProductData;
  index?: number;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const displayPrice = product.salePrice ?? product.price;
  const hasSale = product.salePrice !== null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="product-card group"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="relative aspect-[3/4] bg-cream overflow-hidden cursor-pointer">
          <Link href={`/produto/${product.slug}`}>
            <Image
              src={product.images[0] || "/placeholder.jpg"}
              alt={product.title}
              fill
              className="product-image-hover object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </Link>

          {hasSale && (
            <span className="absolute top-3 left-3 bg-sale text-white text-[10px] tracking-wider uppercase px-2.5 py-1">
              Sale
            </span>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-3 right-3 flex flex-col gap-2"
          >
            <button
              className="w-9 h-9 bg-white/90 flex items-center justify-center hover:bg-white transition-colors shadow-sm"
              aria-label="Favoritar"
            >
              <Heart size={16} strokeWidth={1.5} />
            </button>
            <button
              onClick={() => setModalOpen(true)}
              className="w-9 h-9 bg-white/90 flex items-center justify-center hover:bg-white transition-colors shadow-sm"
              aria-label="Ver detalhes"
            >
              <Eye size={16} strokeWidth={1.5} />
            </button>
          </motion.div>

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: hovered ? "0%" : "100%" }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute bottom-0 left-0 right-0 p-3"
          >
            <button
              onClick={() => setModalOpen(true)}
              className="w-full bg-foreground/90 text-background py-2.5 text-xs tracking-wider uppercase hover:bg-foreground transition-colors"
            >
              Compra rápida
            </button>
          </motion.div>
        </div>

        <div className="mt-3 space-y-1">
          <Link href={`/produto/${product.slug}`}>
            <h3 className="text-sm font-medium hover:text-accent transition-colors line-clamp-1">
              {product.title}
            </h3>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-sm">{formatPrice(displayPrice)}</span>
            {hasSale && (
              <span className="text-xs text-muted line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          {product.colors.length > 0 && (
            <div className="flex gap-1.5 pt-1">
              {product.colors.slice(0, 4).map((color) => (
                <span
                  key={color}
                  className="text-[10px] text-muted tracking-wide"
                >
                  {color}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      <ProductModal
        product={product}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}