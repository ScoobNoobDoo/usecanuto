"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Plus,
  LogOut,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { formatPrice, type ProductData } from "@/lib/utils";

export default function AdminDashboard({
  products,
  adminEmail,
}: {
  products: ProductData[];
  adminEmail: string;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir este produto?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    router.refresh();
  };

  const handleToggleActive = async (id: string, active: boolean) => {
    await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !active }),
    });
    router.refresh();
  };

  const handleSavePrice = async (id: string) => {
    setLoading(true);
    await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price: parseFloat(editPrice) }),
    });
    setEditing(null);
    setLoading(false);
    router.refresh();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div>
          <h1 className="font-serif text-3xl tracking-wide">Painel Admin</h1>
          <p className="text-sm text-muted mt-1">{adminEmail}</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/novo-produto"
            className="flex items-center gap-2 bg-foreground text-background px-5 py-2.5 text-sm tracking-wider uppercase hover:bg-accent transition-colors"
          >
            <Plus size={16} />
            Novo Anúncio
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 border border-border px-5 py-2.5 text-sm tracking-wider uppercase hover:bg-cream transition-colors"
          >
            <LogOut size={16} />
            Sair
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { label: "Total de produtos", value: products.length },
          { label: "Ativos", value: products.filter((p) => p.active).length },
          { label: "Em destaque", value: products.filter((p) => p.featured).length },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="border border-border p-5 text-center"
          >
            <p className="text-2xl font-medium">{stat.value}</p>
            <p className="text-xs text-muted mt-1 tracking-wider uppercase">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>

      <h2 className="text-xs tracking-[0.2em] uppercase text-muted mb-4">
        Produtos cadastrados
      </h2>

      <div className="space-y-3">
        {products.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            className={`flex items-center gap-4 border border-border p-4 ${
              !product.active ? "opacity-50" : ""
            }`}
          >
            <div className="relative w-14 h-18 bg-cream flex-shrink-0">
              <Image
                src={product.images[0] || "/placeholder.jpg"}
                alt={product.title}
                fill
                className="object-cover"
                sizes="56px"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium truncate">{product.title}</h3>
              <p className="text-xs text-muted">
                {product.sizes.join(", ")} · {product.colors.join(", ")}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {editing === product.id ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.01"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="w-24 border border-border px-2 py-1 text-sm"
                    autoFocus
                  />
                  <button
                    onClick={() => handleSavePrice(product.id)}
                    disabled={loading}
                    className="text-xs text-accent hover:underline"
                  >
                    {loading ? <Loader2 size={14} className="animate-spin" /> : "Salvar"}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setEditing(product.id);
                    setEditPrice(String(product.price));
                  }}
                  className="text-sm hover:text-accent transition-colors flex items-center gap-1"
                >
                  {formatPrice(product.salePrice ?? product.price)}
                  <Edit size={12} />
                </button>
              )}
            </div>

            <Link
              href={`/admin/produto/${product.id}`}
              className="p-2 hover:bg-cream transition-colors text-xs tracking-wider uppercase hidden sm:block"
            >
              Editar
            </Link>

            <div className="flex gap-1">
              <button
                onClick={() => handleToggleActive(product.id, product.active)}
                className="p-2 hover:bg-cream transition-colors"
                title={product.active ? "Desativar" : "Ativar"}
              >
                {product.active ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="p-2 hover:bg-cream text-sale transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </motion.div>
        ))}

        {products.length === 0 && (
          <div className="text-center py-16 text-muted">
            <p className="text-sm">Nenhum produto cadastrado ainda.</p>
            <Link
              href="/admin/novo-produto"
              className="text-sm text-accent underline mt-2 inline-block"
            >
              Criar primeiro anúncio
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}