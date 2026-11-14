import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { routes } from '@/config/routes';

export default function HomePage() {
  return (
    <section className="relative h-svh min-h-140 w-full overflow-hidden bg-hero-teal">
      <Image
        src="/hero-shoe.png"
        alt="Black suede low-top sneaker with a teal accent"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[50%_62%]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

      <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-end px-4 pb-12 pt-header text-white md:pb-16">
        {/* Frosted glass panel */}
        <div className="max-w-lg rounded-3xl border border-white/25 bg-white/10 p-7 shadow-[inset_0_1px_0_rgb(255_255_255/0.3),0_20px_50px_-20px_rgb(0_0_0/0.5)] backdrop-blur-2xl backdrop-saturate-150 md:p-9">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-white/80">New season</p>
          <h1 className="mt-3 text-4xl font-medium leading-tight tracking-tight md:text-5xl">
            Step into something quietly bold.
          </h1>
          <Button asChild variant="accent" size="lg" className="mt-7">
            <Link href={routes.catalog}>
              Shop the catalog <ArrowRight aria-hidden />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
