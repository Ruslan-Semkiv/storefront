'use client';

import { useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SORT_OPTIONS, type ProductFilters, type SortValue } from '../lib/filter-products';

/** Filters live in the URL (?color=Red&size=42&sort=price-asc&page=2) so they survive refresh and can be shared. */
export function useFilterParams() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const sortParam = params.get('sort');
  const filters: ProductFilters = {
    color: params.get('color'),
    size: params.get('size'),
    sort: SORT_OPTIONS.some((o) => o.value === sortParam) ? (sortParam as SortValue) : 'default',
  };
  const page = Math.max(1, Number(params.get('page')) || 1);

  const update = useCallback(
    (changes: Partial<Record<keyof ProductFilters | 'page', string | null>>) => {
      const next = new URLSearchParams(params.toString());
      for (const [key, value] of Object.entries(changes)) {
        if (value == null || value === '' || value === 'default') next.delete(key);
        else next.set(key, value);
      }
      if (!('page' in changes)) next.delete('page'); // new filter -> back to page 1
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [params, pathname, router],
  );

  return { filters, page, update };
}
