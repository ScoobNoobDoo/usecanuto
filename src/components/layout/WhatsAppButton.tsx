"use client";

import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export default function WhatsAppButton() {
  return (
    <a
      href={siteConfig.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-12 h-12 bg-foreground text-background shadow-lg hover:bg-accent transition-colors duration-300"
    >
      <MessageCircle size={22} strokeWidth={1.5} />
    </a>
  );
}