import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/layout/CartDrawer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { CartProvider } from "@/context/CartContext";
import { SiteContentProvider } from "@/context/SiteContentContext";
import { fetchSiteContent } from "@/lib/data";

export const dynamic = "force-dynamic";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "UseCanuto — Moda Feminina com Elegância",
  description:
    "UseCanuto: roupas femininas com elegância e protagonismo. Vestidos, blusas, calças e mais.",
  openGraph: {
    title: "UseCanuto",
    description: "Moda feminina com elegância e protagonismo",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteContent = await fetchSiteContent();

  return (
    <html lang="pt-BR" className={`${cormorant.variable} ${jost.variable}`}>
      <body className="min-h-screen flex flex-col antialiased">
        <SiteContentProvider content={siteContent}>
          <CartProvider>
            <Header />
            <main className="flex-1 pt-[104px] lg:pt-[120px]">{children}</main>
            <Footer />
            <CartDrawer />
            <WhatsAppButton />
          </CartProvider>
        </SiteContentProvider>
      </body>
    </html>
  );
}