"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useSearchParams } from "next/navigation";

function SuccessContent() {
  const searchParams = useSearchParams();
  const isDemo = searchParams.get("demo") === "true";

  useEffect(() => {
    const confetti = async () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.style.cssText =
          "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999";
        document.body.appendChild(canvas);
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = Array.from({ length: 80 }, () => ({
          x: Math.random() * canvas.width,
          y: -10,
          vx: (Math.random() - 0.5) * 3,
          vy: Math.random() * 3 + 2,
          color: ["#8b7355", "#c4a882", "#1a1a1a", "#c45c4a"][
            Math.floor(Math.random() * 4)
          ],
          size: Math.random() * 6 + 2,
        }));

        let frame = 0;
        const animate = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          particles.forEach((p) => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.05;
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, p.size, p.size);
          });
          frame++;
          if (frame < 120) requestAnimationFrame(animate);
          else canvas.remove();
        };
        animate();
      } catch {
        /* ignore */
      }
    };
    confetti();
  }, []);

  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
      >
        <CheckCircle size={64} strokeWidth={1} className="mx-auto text-accent mb-6" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="font-serif text-3xl tracking-wide mb-3"
      >
        Pedido confirmado!
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-sm text-muted mb-2"
      >
        Obrigada pela sua compra na UseCanuto.
      </motion.p>

      {isDemo && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-xs text-accent mb-6 bg-cream px-4 py-2 inline-block"
        >
          Modo demonstração — configure o Stripe para pagamentos reais
        </motion.p>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Link
          href="/loja"
          className="inline-flex items-center gap-2 bg-foreground text-background px-8 py-3.5 text-sm tracking-wider uppercase hover:bg-accent transition-colors mt-4"
        >
          Continuar comprando
          <ArrowRight size={16} />
        </Link>
      </motion.div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-muted">Carregando...</div>}>
      <SuccessContent />
    </Suspense>
  );
}