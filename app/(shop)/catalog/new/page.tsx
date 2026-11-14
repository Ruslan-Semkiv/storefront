import type { Metadata } from 'next';
import { PageBanner } from '@/components/shared/PageBanner';
import { routes } from '@/config/routes';
import { AddProductForm } from '@/features/catalog';

export const metadata: Metadata = { title: 'Add a shoe — Verdant Steps' };

export default function AddProductPage() {
  return (
    <>
      <PageBanner title="Add a shoe" crumbs={[{ label: 'Shop', href: routes.catalog }, { label: 'Add a shoe' }]} />
      <div className="mx-auto max-w-5xl px-4 py-12">
        <AddProductForm />
      </div>
    </>
  );
}
