"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, ChevronRight } from "lucide-react";
import { formatPrice, type ProductData } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import ProductGrid from "@/components/home/ProductGrid";

export default function ProductDetail({
  product,
  related,
}: {
  product: ProductData;
  related: ProductData[];
}) {
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "");
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || "");
  const [activeTab, setActiveTab] = useState<"descricao" | "detalhes">("descricao");
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
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <nav className="flex items-center gap-2 text-xs text-muted mb-8">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight size={12} />
          <Link href="/loja" className="hover:text-foreground transition-colors">
            Loja
          </Link>
          <ChevronRight size={12} />
          <span className="text-foreground">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative aspect-[3/4] bg-cream overflow-hidden">
              <Image
                src={product.images[activeImage] || product.images[0]}
                alt={product.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2 mt-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative w-16 h-20 border-2 overflow-hidden transition-colors ${
                      activeImage === i ? "border-foreground" : "border-transparent"
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" sizes="64px" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col"
          >
            {product.category && (
              <span className="text-xs tracking-[0.2em] uppercase text-muted">
                {product.category.name}
              </span>
            )}
            <h1 className="font-serif text-3xl sm:text-4xl tracking-wide mt-2">
              {product.title}
            </h1>

            <div className="flex items-center gap-3 mt-4">
              <span className="text-2xl">{formatPrice(displayPrice)}</span>
              {product.salePrice && (
                <>
                  <span className="text-muted line-through">
                    {formatPrice(product.price)}
                  </span>
                  <span className="bg-sale text-white text-xs px-2 py-0.5 tracking-wider uppercase">
                    Sale
                  </span>
                </>
              )}
            </div>

            {product.sizes.length > 0 && (
              <div className="mt-8">
                <p className="text-xs tracking-wider uppercase text-muted mb-3">Tamanho</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[44px] px-4 py-2.5 text-sm border transition-all duration-200 ${
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
              <div className="mt-6">
                <p className="text-xs tracking-wider uppercase text-muted mb-3">Cor</p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2.5 text-sm border transition-all duration-200 ${
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

            <motion.button
              onClick={handleAdd}
              whileTap={{ scale: 0.98 }}
              className="mt-8 w-full flex items-center justify-center gap-2 bg-foreground text-background py-4 text-sm tracking-wider uppercase hover:bg-accent transition-colors duration-300"
            >
              <ShoppingBag size={18} />
              Adicionar ao carrinho
            </motion.button>

            <div className="mt-10 border-t border-border pt-6">
              <div className="flex gap-6 border-b border-border">
                {(["descricao", "detalhes"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 text-xs tracking-wider uppercase transition-colors ${
                      activeTab === tab
                        ? "text-foreground border-b-2 border-foreground -mb-px"
                        : "text-muted hover:text-foreground"
                    }`}
                  >
                    {tab === "descricao" ? "Descrição" : "Detalhes"}
                  </button>
                ))}
              </div>
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="pt-4"
              >
                {activeTab === "descricao" ? (
                  <p className="text-sm text-muted leading-relaxed">
                    {product.description}
                  </p>
                ) : (
                  <div className="text-sm text-muted space-y-2">
                    <p>Tamanhos: {product.sizes.join(", ")}</p>
                    <p>Cores: {product.colors.join(", ")}</p>
                    <p>Entrega expressa disponível</p>
                    <p>Trocas em até 30 dias</p>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {related.length > 0 && (
        <ProductGrid products={related} title="Você também pode gostar" />
      )}
    </div>
  );
}