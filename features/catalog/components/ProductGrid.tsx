'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useProducts } from '../api/useProducts';
import { useFilterParams } from '../hooks/useFilterParams';
import { facets, filterAndSort, PAGE_SIZE } from '../lib/filter-products';
import { FilterBar } from './FilterBar';
import { Pagination } from './Pagination';
import { ProductCard } from './ProductCard';

const gridClass = 'grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4';

export function ProductGrid() {
  const { data: products, isPending, isError, refetch } = useProducts();
  const { filters, page, update } = useFilterParams();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const options = useMemo(() => facets(products ?? []), [products]);
  const visible = useMemo(() => filterAndSort(products ?? [], filters), [products, filters]);
  const pageCount = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const pageItems = visible.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  if (isPending) {
    return (
      <div className={gridClass} aria-busy="true">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse space-y-3">
            <div className="aspect-[4/5] bg-tile" />
            <div className="h-4 w-2/3 rounded bg-tile" />
            <div className="h-4 w-1/4 rounded bg-tile" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-md border border-border p-10 text-center">
        <p className="mb-4">We couldn&apos;t load the catalog. Is the Shop API running?</p>
        <Button variant="outline" onClick={() => refetch()}>Try again</Button>
      </div>
    );
  }

  return (
    <>
      <FilterBar filters={filters} options={options} onChange={update} resultCount={visible.length} />

      {pageItems.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">No shoes match these filters.</p>
      ) : (
        <div className={gridClass}>
          {pageItems.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              selected={selectedId === p.id}
              onSelect={() => setSelectedId((cur) => (cur === p.id ? null : p.id))}
            />
          ))}
        </div>
      )}

      <Pagination page={current} pageCount={pageCount} onPage={(p) => update({ page: String(p) })} />
    </>
  );
}
