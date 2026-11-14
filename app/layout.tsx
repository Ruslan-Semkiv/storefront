import type { Metadata } from 'next';
import { QueryProvider } from '@/providers/QueryProvider';
import { CartProvider } from '@/features/cart';
import './globals.css';

export const metadata: Metadata = {
  title: 'Verdant Steps — Shoe Store',
  description: 'Test shoe store: catalog, cart and checkout.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <QueryProvider>
          <CartProvider>{children}</CartProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
