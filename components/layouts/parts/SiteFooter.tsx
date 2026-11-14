import Link from 'next/link';
import { Footprints } from 'lucide-react';
import { routes } from '@/config/routes';
import { NewsletterForm } from './NewsletterForm';

const columns = [
  { title: 'Company', links: [{ label: 'Shop', href: routes.catalog }, { label: 'Contact us', href: routes.contact }] },
  { title: 'Customer care', links: [{ label: 'Size guide' }, { label: 'Help & FAQs' }, { label: 'Return my order' }] },
  { title: 'Policies', links: [{ label: 'Shipping info' }, { label: 'Privacy policy' }, { label: 'Terms' }] },
] as const;

export function SiteFooter() {
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="space-y-6 md:border-r md:border-white/15 md:pr-10">
          <p className="text-xl leading-snug">
            Get an exclusive <span className="text-sale">20%</span> discount code when you sign up.
          </p>
          <NewsletterForm />
        </div>
        {columns.map((col) => (
          <div key={col.title} className="md:border-r md:border-white/15 md:last:border-r-0">
            <h3 className="mb-4 font-medium">{col.title}</h3>
            <ul className="space-y-2.5 text-sm text-white/70">
              {col.links.map((l) => (
                <li key={l.label}>
                  {'href' in l ? <Link href={l.href} className="hover:text-white">{l.label}</Link> : l.label}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-6 text-sm text-white/60">
          <span className="flex items-center gap-2 text-lg font-semibold text-white">
            <Footprints aria-hidden className="size-5" /> Verdant Steps
          </span>
          <span>© 2026 Verdant Steps. A test store, no real orders are shipped.</span>
        </div>
      </div>
    </footer>
  );
}
