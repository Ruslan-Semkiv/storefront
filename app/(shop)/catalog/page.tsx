import { Suspense } from 'react';
import type { Metadata } from 'next';
import { PageBanner } from '@/components/shared/PageBanner';
import { ProductGrid } from '@/features/catalog';

export const metadata: Metadata = { title: 'Shop — Verdant Steps' };

export default function CatalogPage() {
  return (
    <>
      <PageBanner title="Shop" crumbs={[{ label: 'Shop' }]} />
      <div className="mx-auto max-w-6xl px-4 py-12">
        {/* useSearchParams (filters in the URL) needs a Suspense boundary */}
        <Suspense>
          <ProductGrid />
        </Suspense>
      </div>
    </>
  );
}
