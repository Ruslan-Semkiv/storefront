import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { routes } from '@/config/routes';

type Props = { title: string; crumbs?: { label: string; href?: string }[] };

/** Sand-coloured page banner: big title + breadcrumb on the left, product photo bleeding off the right. */
export function PageBanner({ title, crumbs = [] }: Props) {
  return (
    <section className="relative overflow-hidden bg-sand pt-header">
      <div className="absolute inset-y-0 right-0 hidden w-3/5 md:block" aria-hidden>
        <Image src="/hero-shoe.png" alt="" fill sizes="60vw" className="object-cover object-[50%_60%]" />
        <div className="absolute inset-0 bg-gradient-to-r from-sand via-sand/30 to-transparent" />
      </div>
      <div className="relative mx-auto flex h-56 max-w-6xl flex-col justify-center px-4 md:h-72">
        <h1 className="text-4xl font-medium tracking-tight md:text-5xl">{title}</h1>
        <nav aria-label="Breadcrumb" className="mt-3">
          <ol className="flex items-center gap-1.5 text-sm">
            <li>
              <Link href={routes.home} className="hover:underline">Home</Link>
            </li>
            {crumbs.map((c) => (
              <li key={c.label} className="flex items-center gap-1.5">
                <ChevronRight aria-hidden className="size-3.5 text-muted-foreground" />
                {c.href ? (
                  <Link href={c.href} className="hover:underline">{c.label}</Link>
                ) : (
                  <span className="text-muted-foreground" aria-current="page">{c.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </section>
  );
}
