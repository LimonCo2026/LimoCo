import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";
import CartFAB from "@/components/CartFAB";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ÁUREA | Moda Contemporánea",
  description:
    "Ropa y accesorios para mujer y hombre. Piezas con carácter, diseñadas para durar.",
  openGraph: {
    title: "ÁUREA | Moda Contemporánea",
    description:
      "Ropa y accesorios para mujer y hombre. Piezas con carácter, diseñadas para durar.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#2C1810] antialiased">
        <Header />
        {children}
        <CartDrawer />
        <CartFAB />
      </body>
    </html>
  );
}
