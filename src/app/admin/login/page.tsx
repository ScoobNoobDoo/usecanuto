"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push("/admin");
      } else {
        setError(data.error || "Erro ao entrar");
      }
    } catch {
      setError("Erro de conexão");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl tracking-[0.15em]">USECANUTO</h1>
          <p className="text-xs tracking-[0.2em] uppercase text-muted mt-2">
            Área Administrativa
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-border p-8 space-y-5"
        >
          <div>
            <label className="text-xs tracking-wider uppercase text-muted">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-border px-4 py-3 text-sm mt-1 focus:outline-none focus:border-foreground transition-colors"
              placeholder="admin@usecanuto.com"
            />
          </div>
          <div>
            <label className="text-xs tracking-wider uppercase text-muted">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-border px-4 py-3 text-sm mt-1 focus:outline-none focus:border-foreground transition-colors"
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-sale"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-foreground text-background py-3.5 text-sm tracking-wider uppercase hover:bg-accent transition-colors disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                <Lock size={16} />
                Entrar
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}