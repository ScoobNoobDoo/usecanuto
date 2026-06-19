"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag } from "lucide-react";
import { formatPrice, type ProductData } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

export default function ProductModal({
  product,
  isOpen,
  onClose,
}: {
  product: ProductData;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "");
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || "");
  const [activeImage, setActiveImage] = useState(0);
  const { addItem } = useCart();
  const displayPrice = product.salePrice ?? product.price;

  const handleAdd = () => {
    addItem({
      productId: product.id,
      title: product.title,
      slug: product.slug,
      image: product.images[0],
      price: displayPrice,
      size: selectedSize,
      color: selectedColor,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-black/50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-[95] sm:w-full sm:max-w-3xl bg-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-1 bg-white/80 hover:bg-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col sm:flex-row overflow-y-auto">
              <div className="relative sm:w-1/2 aspect-[3/4] sm:aspect-auto bg-cream flex-shrink-0">
                <Image
                  src={product.images[activeImage] || product.images[0]}
                  alt={product.title}
                  fill
                  className="object-cover"
                  sizes="400px"
                />
                {product.images.length > 1 && (
                  <div className="absolute bottom-3 left-3 right-3 flex gap-2">
                    {product.images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImage(i)}
                        className={`relative w-12 h-16 border-2 overflow-hidden ${
                          activeImage === i ? "border-foreground" : "border-transparent"
                        }`}
                      >
                        <Image src={img} alt="" fill className="object-cover" sizes="48px" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="sm:w-1/2 p-6 sm:p-8 flex flex-col">
                <h2 className="font-serif text-2xl tracking-wide">{product.title}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-lg">{formatPrice(displayPrice)}</span>
                  {product.salePrice && (
                    <span className="text-sm text-muted line-through">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>

                <div className="mt-6 space-y-4 flex-1">
                  {product.sizes.length > 0 && (
                    <div>
                      <p className="text-xs tracking-wider uppercase text-muted mb-2">Tamanho</p>
                      <div className="flex flex-wrap gap-2">
                        {product.sizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`min-w-[40px] px-3 py-2 text-sm border transition-all duration-200 ${
                              selectedSize === size
                                ? "border-foreground bg-foreground text-background"
                                : "border-border hover:border-foreground"
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {product.colors.length > 0 && (
                    <div>
                      <p className="text-xs tracking-wider uppercase text-muted mb-2">Cor</p>
                      <div className="flex flex-wrap gap-2">
                        {product.colors.map((color) => (
                          <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`px-3 py-2 text-sm border transition-all duration-200 ${
                              selectedColor === color
                                ? "border-foreground bg-foreground text-background"
                                : "border-border hover:border-foreground"
                            }`}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-xs tracking-wider uppercase text-muted mb-2">Descrição</p>
                    <p className="text-sm text-muted leading-relaxed line-clamp-4">
                      {product.description}
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <button
                    onClick={handleAdd}
                    className="w-full flex items-center justify-center gap-2 bg-foreground text-background py-3.5 text-sm tracking-wider uppercase hover:bg-accent transition-colors duration-300"
                  >
                    <ShoppingBag size={16} />
                    Adicionar ao carrinho
                  </button>
                  <Link
                    href={`/produto/${product.slug}`}
                    onClick={onClose}
                    className="block text-center text-sm text-muted hover:text-foreground transition-colors underline"
                  >
                    Ver detalhes completos
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}