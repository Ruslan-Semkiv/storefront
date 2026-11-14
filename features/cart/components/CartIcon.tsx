'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { routes } from '@/config/routes';
import { useCart } from '../context/CartContext';

export function CartIcon() {
  const { itemCount } = useCart();

  return (
    <Link
      href={routes.cart}
      className="relative inline-flex size-10 items-center justify-center rounded-xl border border-current/15 bg-current/5 backdrop-blur-xl transition-colors hover:bg-current/10"
      aria-label={`Bucket, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}
    >
      <ShoppingBag aria-hidden className="size-5" />
      {itemCount > 0 && (
        <span className="absolute -right-1.5 -top-1.5 flex min-w-5 items-center justify-center rounded-full bg-ink px-1 text-[11px] font-semibold text-white ring-2 ring-white/80">
          {itemCount}
        </span>
      )}
    </Link>
  );
}
