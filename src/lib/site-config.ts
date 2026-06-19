/** Links e textos institucionais — configure no .env ou Netlify. */
export const siteConfig = {
  instagram:
    process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com/usecanuto",
  whatsapp:
    process.env.NEXT_PUBLIC_WHATSAPP_URL || "https://wa.me/5511999999999",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contato@usecanuto.com",
  paymentMethods: [
    "Cartão em até 6x",
    "PIX disponível",
    "Entrega expressa",
  ] as string[],
};