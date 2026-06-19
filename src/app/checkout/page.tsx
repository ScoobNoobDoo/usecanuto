"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CreditCard, QrCode, Loader2, Lock } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { useRouter } from "next/navigation";
export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "pix">("card");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
  });

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready && items.length === 0) {
      router.push("/carrinho");
    }
  }, [ready, items.length, router]);

  if (!ready || items.length === 0) {
    return (
      <div className="py-24 text-center text-muted text-sm">
        Redirecionando...
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          customerName: form.name,
          customerEmail: form.email,
          customerPhone: form.phone,
          paymentMethod,
          address: form.address,
          city: form.city,
          zip: form.zip,
        }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else if (data.demo) {
        clearCart();
        router.push(
          `/checkout/sucesso?demo=true&order=${data.orderId}&method=${data.paymentMethod || paymentMethod}`
        );
      } else {
        setError(data.error || "Erro ao processar. Tente novamente.");
      }
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-serif text-3xl tracking-wide mb-8"
      >
        Checkout
      </motion.h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3 space-y-8">
          <section>
            <h2 className="text-xs tracking-[0.2em] uppercase mb-4">Dados pessoais</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: "name", label: "Nome completo", type: "text", col: "sm:col-span-2" },
                { key: "email", label: "E-mail", type: "email", col: "" },
                { key: "phone", label: "Telefone", type: "tel", col: "" },
                { key: "address", label: "Endereço", type: "text", col: "sm:col-span-2" },
                { key: "city", label: "Cidade", type: "text", col: "" },
                { key: "zip", label: "CEP", type: "text", col: "" },
              ].map((field) => (
                <div key={field.key} className={field.col}>
                  <label className="text-xs text-muted">{field.label}</label>
                  <input
                    type={field.type}
                    required={["name", "email"].includes(field.key)}
                    value={form[field.key as keyof typeof form]}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, [field.key]: e.target.value }))
                    }
                    className="w-full border border-border px-4 py-3 text-sm mt-1 focus:outline-none focus:border-foreground transition-colors"
                  />
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xs tracking-[0.2em] uppercase mb-4">Pagamento</h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`flex items-center gap-3 p-4 border transition-all duration-200 ${
                  paymentMethod === "card"
                    ? "border-foreground bg-cream"
                    : "border-border hover:border-foreground/50"
                }`}
              >
                <CreditCard size={20} strokeWidth={1.5} />
                <div className="text-left">
                  <p className="text-sm font-medium">Cartão</p>
                  <p className="text-xs text-muted">Até 6x sem juros</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("pix")}
                className={`flex items-center gap-3 p-4 border transition-all duration-200 ${
                  paymentMethod === "pix"
                    ? "border-foreground bg-cream"
                    : "border-border hover:border-foreground/50"
                }`}
              >
                <QrCode size={20} strokeWidth={1.5} />
                <div className="text-left">
                  <p className="text-sm font-medium">PIX</p>
                  <p className="text-xs text-muted">Aprovação instantânea</p>
                </div>
              </button>
            </div>
          </section>
        </div>

        <div className="lg:col-span-2">
          <div className="border border-border p-6 sticky top-32">
            <h2 className="text-xs tracking-[0.2em] uppercase mb-4">Resumo</h2>
            <div className="space-y-3 mb-6">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.size}-${item.color}`}
                  className="flex justify-between text-sm"
                >
                  <span className="text-muted truncate mr-4">
                    {item.title} × {item.quantity}
                  </span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-4 flex justify-between">
              <span className="text-sm tracking-wider uppercase">Total</span>
              <span className="text-lg font-medium">{formatPrice(total)}</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 flex items-center justify-center gap-2 bg-foreground text-background py-4 text-sm tracking-wider uppercase hover:bg-accent transition-colors duration-300 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  <Lock size={16} />
                  Pagar {formatPrice(total)}
                </>
              )}
            </button>

            {error && (
              <p className="text-xs text-sale text-center mt-4">{error}</p>
            )}

            <p className="text-[10px] text-muted text-center mt-4">
              {paymentMethod === "pix"
                ? "PIX com aprovação instantânea"
                : "Pagamento seguro — cartão em até 6x"}
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}