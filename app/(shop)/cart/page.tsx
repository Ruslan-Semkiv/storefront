import type { Metadata } from 'next';
import { PageBanner } from '@/components/shared/PageBanner';
import { CartView } from '@/features/cart';

export const metadata: Metadata = { title: 'Your bucket — Verdant Steps' };

export default function CartPage() {
  return (
    <>
      <PageBanner title="Your bucket" crumbs={[{ label: 'Bucket' }]} />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <CartView />
      </div>
    </>
  );
}
