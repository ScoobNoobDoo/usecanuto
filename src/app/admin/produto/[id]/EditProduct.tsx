"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Upload, Loader2, ArrowLeft, Save } from "lucide-react";
import { formatPrice, type ProductData } from "@/lib/utils";

export default function EditProduct({ product }: { product: ProductData }) {
  const router = useRouter();
  const [images, setImages] = useState(product.images);
  const [price, setPrice] = useState(String(product.price));
  const [salePrice, setSalePrice] = useState(
    product.salePrice ? String(product.salePrice) : ""
  );
  const [description, setDescription] = useState(product.description);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    const newImages = [...images];
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) newImages.push(data.url);
    }
    setImages(newImages);
    setUploading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    await fetch(`/api/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        images,
        price: parseFloat(price),
        salePrice: salePrice ? parseFloat(salePrice) : null,
        description,
      }),
    });
    setSaving(false);
    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground mb-8"
      >
        <ArrowLeft size={16} />
        Voltar ao painel
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-serif text-2xl tracking-wide mb-1">{product.title}</h1>
        <p className="text-sm text-muted mb-8">Editar preço e fotos</p>

        <div className="space-y-8">
          <section>
            <h2 className="text-xs tracking-wider uppercase text-muted mb-4">Fotos</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
              {images.map((img, i) => (
                <div key={i} className="relative aspect-square bg-cream group">
                  <Image src={img} alt="" fill className="object-cover" sizes="100px" />
                  <button
                    onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                    className="absolute top-1 right-1 w-5 h-5 bg-sale text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <label className="inline-flex items-center gap-2 border border-border px-4 py-2.5 text-sm cursor-pointer hover:bg-cream transition-colors">
              <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
              {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
              Adicionar imagens
            </label>
          </section>

          <section className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs tracking-wider uppercase text-muted">Preço</label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border border-border px-4 py-3 text-sm mt-1 focus:outline-none focus:border-foreground"
              />
            </div>
            <div>
              <label className="text-xs tracking-wider uppercase text-muted">Preço promocional</label>
              <input
                type="number"
                step="0.01"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                className="w-full border border-border px-4 py-3 text-sm mt-1 focus:outline-none focus:border-foreground"
              />
            </div>
          </section>

          <section>
            <label className="text-xs tracking-wider uppercase text-muted">Descrição</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="w-full border border-border px-4 py-3 text-sm mt-1 focus:outline-none focus:border-foreground resize-none"
            />
          </section>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-foreground text-background px-6 py-3 text-sm tracking-wider uppercase hover:bg-accent transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Salvar alterações
          </button>
        </div>
      </motion.div>
    </div>
  );
}