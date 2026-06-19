import Link from "next/link";
import { ArrowLeft, Mail, MessageCircle, Globe } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export default function ContatoPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground mb-8"
      >
        <ArrowLeft size={16} />
        Voltar
      </Link>

      <h1 className="font-serif text-3xl tracking-wide mb-1">Contato</h1>
      <p className="text-sm text-muted mb-10">
        Estamos aqui para ajudar com pedidos, trocas e dúvidas sobre a coleção.
      </p>

      <div className="space-y-4">
        <a
          href={siteConfig.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 border border-border p-5 hover:bg-cream transition-colors"
        >
          <MessageCircle size={22} strokeWidth={1.5} className="text-accent" />
          <div>
            <p className="text-sm font-medium">WhatsApp</p>
            <p className="text-xs text-muted">Resposta rápida em horário comercial</p>
          </div>
        </a>

        <a
          href={`mailto:${siteConfig.email}`}
          className="flex items-center gap-4 border border-border p-5 hover:bg-cream transition-colors"
        >
          <Mail size={22} strokeWidth={1.5} className="text-accent" />
          <div>
            <p className="text-sm font-medium">E-mail</p>
            <p className="text-xs text-muted">{siteConfig.email}</p>
          </div>
        </a>

        <a
          href={siteConfig.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 border border-border p-5 hover:bg-cream transition-colors"
        >
          <Globe size={22} strokeWidth={1.5} className="text-accent" />
          <div>
            <p className="text-sm font-medium">Instagram</p>
            <p className="text-xs text-muted">Novidades e inspirações de look</p>
          </div>
        </a>
      </div>
    </div>
  );
}