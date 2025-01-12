'use client';

import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from '@/context/CartContext';
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });
const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
});

export const Metadata = {
  title: 'Fahika',
  description: 'Hayatınıza dokunan anılarınızı eşsiz kokularla taçlandırıyor',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  return (
    <html lang="tr" className={playfair.className}>
      <body className={inter.className}>
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            {!isAdminPage && <Header />}
            <main className="flex-grow">
              {children}
            </main>
            {!isAdminPage && <Footer />}
          </div>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 2000,
              style: {
                background: '#333',
                color: '#fff',
                padding: '16px',
                borderRadius: '8px',
                fontSize: '16px',
              },
              success: {
                iconTheme: {
                  primary: '#fff',
                  secondary: '#333',
                },
              },
            }}
          />
        </CartProvider>
      </body>
    </html>
  );
}
