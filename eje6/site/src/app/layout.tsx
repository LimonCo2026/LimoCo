import type { Metadata } from 'next';
import { Fira_Code, Fira_Sans } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';

const firaSans = Fira_Sans({
  variable: '--font-fira-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const firaCode = Fira_Code({
  variable: '--font-fira-code',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'StockPro — Control de Inventario',
  description: 'Sistema de gestión de inventario para ferreterías. Controla entradas, salidas y reportes en tiempo real.',
  openGraph: {
    title: 'StockPro — Control de Inventario',
    description: 'Sistema interno de inventario para ferreterías.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${firaSans.variable} ${firaCode.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#EDEDE8] text-neutral-900 font-[family-name:var(--font-fira-sans)]">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
