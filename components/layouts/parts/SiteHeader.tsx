'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Footprints } from 'lucide-react';
import { routes } from '@/config/routes';
import { cn } from '@/lib/cn';
import { CartIcon } from '@/features/cart';

const navItems = [
  { href: routes.catalog, label: 'Shop' },
  { href: routes.contact, label: 'Contact us' },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const onHero = pathname === routes.home;

  // Frosted pill for the active item, hover state for the rest.
  const pill = cn(
    'whitespace-nowrap rounded-xl border px-3 py-2 text-sm transition-colors',
    onHero
      ? 'border-transparent hover:border-white/30 hover:bg-white/15'
      : 'border-transparent hover:border-black/10 hover:bg-black/[0.04]',
  );
  const activePill = onHero
    ? 'border-white/40 bg-white/20 shadow-[inset_0_1px_0_rgb(255_255_255/0.35)] backdrop-blur-xl'
    : 'border-black/10 bg-white/60 shadow-[inset_0_1px_0_rgb(255_255_255/0.9),0_4px_12px_-6px_rgb(0_0_0/0.15)] backdrop-blur-xl';

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 h-header border-b backdrop-blur-xl backdrop-saturate-150 transition-colors',
        onHero ? 'border-white/15 bg-black/20 text-white' : 'border-black/5 bg-white/55 text-ink',
      )}
    >
      <nav className="mx-auto flex h-full max-w-6xl items-center gap-1 px-2 sm:gap-2 sm:px-4" aria-label="Main">
        {/* Main button: always returns to the landing page */}
        <Link
          href={routes.home}
          className={cn(pill, 'mr-1 flex items-center gap-2 text-lg font-semibold tracking-tight sm:mr-4 sm:text-xl', onHero && activePill)}
        >
          <Footprints aria-hidden className="size-5" />
          Verdant<span className="hidden sm:inline"> Steps</span>
        </Link>

        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className={cn(pill, pathname.startsWith(item.href) && activePill)}>
            {item.label}
          </Link>
        ))}

        <div className="ml-auto">
          <CartIcon />
        </div>
      </nav>
    </header>
  );
}
