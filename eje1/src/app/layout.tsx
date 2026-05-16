import type { Metadata } from 'next';
import Navbar from '@/components/navbar';
import { AuthProvider } from '@/context/AuthContext';
import LayoutContent from './layout-content';

export const metadata: Metadata = {
  title: 'Barbería Limón',
  description: 'Cortes con frescura única',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <LayoutContent>{children}</LayoutContent>
        </AuthProvider>
      </body>
    </html>
  );
}