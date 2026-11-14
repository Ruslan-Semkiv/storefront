'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/cn';

type Props = { page: number; pageCount: number; onPage: (page: number) => void };

export function Pagination({ page, pageCount, onPage }: Props) {
  if (pageCount <= 1) return null;
  const go = (p: number) => {
    onPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="mt-14 flex items-center justify-center gap-2" aria-label="Pagination">
      {page > 1 && (
        <button type="button" onClick={() => go(page - 1)} className="flex size-10 items-center justify-center rounded-full hover:bg-black/5" aria-label="Previous page">
          <ArrowLeft aria-hidden className="size-5" />
        </button>
      )}
      {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => go(p)}
          aria-current={p === page ? 'page' : undefined}
          className={cn(
            'flex size-10 items-center justify-center rounded-full text-sm tabular-nums transition-colors',
            p === page ? 'bg-ink text-white' : 'hover:bg-black/5',
          )}
        >
          {p}
        </button>
      ))}
      {page < pageCount && (
        <button type="button" onClick={() => go(page + 1)} className="flex size-10 items-center justify-center rounded-full hover:bg-black/5" aria-label="Next page">
          <ArrowRight aria-hidden className="size-5" />
        </button>
      )}
    </nav>
  );
}
