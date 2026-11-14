import type { Metadata } from 'next';
import { PageBanner } from '@/components/shared/PageBanner';
import { ContactInfo } from '@/features/contact';

export const metadata: Metadata = { title: 'Contact us — Verdant Steps' };

export default function ContactPage() {
  return (
    <>
      <PageBanner title="Contact us" crumbs={[{ label: 'Contact us' }]} />
      <div className="mx-auto max-w-4xl px-4 py-12">
        <p className="mb-8 text-muted-foreground">
          Questions about sizing, orders or returns? We usually reply within a day.
        </p>
        <ContactInfo />
      </div>
    </>
  );
}
