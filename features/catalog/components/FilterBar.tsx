'use client';

import Link from 'next/link';
import { Check, ChevronDown, Plus, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { routes } from '@/config/routes';
import { cn } from '@/lib/cn';
import type { ProductColor } from '../schemas/product.schema';
import { SORT_OPTIONS, type ProductFilters } from '../lib/filter-products';

type Props = {
  filters: ProductFilters;
  options: { colors: ProductColor[]; sizes: number[] };
  onChange: (changes: Partial<Record<keyof ProductFilters, string | null>>) => void;
  resultCount: number;
};

function FilterMenu({
  label,
  title,
  active,
  children,
}: {
  label: string;
  title: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Popover>
      <PopoverTrigger className={cn('flex items-center gap-1 rounded-md px-1 py-1 text-sm font-medium hover:text-ink/70', active && 'text-forest-700')}>
        {label}
        {active && <span className="size-1.5 rounded-full bg-forest-700" aria-label="(active)" />}
        <ChevronDown aria-hidden className="size-3.5" />
      </PopoverTrigger>
      <PopoverContent>
        <p className="mb-3 font-medium">{title}</p>
        {children}
      </PopoverContent>
    </Popover>
  );
}

function OptionRow({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn('flex w-full items-center gap-2.5 rounded py-1.5 text-left text-sm text-muted-foreground hover:text-ink', selected && 'font-medium text-ink')}
    >
      {children}
      {selected && <Check aria-hidden className="ml-auto size-4" />}
    </button>
  );
}

export function FilterBar({ filters, options, onChange, resultCount }: Props) {
  const hasFilters = Boolean(filters.color || filters.size);
  const toggle = (key: 'color' | 'size', value: string) =>
    onChange({ [key]: filters[key] === value ? null : value });

  return (
    <div className="mb-8 flex flex-wrap items-center gap-x-5 gap-y-3 border-b border-border pb-5">
      <span className="text-sm text-muted-foreground">Filter by</span>

      <FilterMenu label="Color" title="Colors" active={Boolean(filters.color)}>
        {options.colors.map((c) => (
          <OptionRow key={c.name} selected={filters.color === c.name} onClick={() => toggle('color', c.name)}>
            <span
              className={cn('size-4 rounded-full ring-1 ring-black/10', filters.color === c.name && 'ring-2 ring-ink ring-offset-2')}
              style={{ backgroundColor: c.hex }}
            />
            {c.name}
          </OptionRow>
        ))}
      </FilterMenu>

      <FilterMenu label="Size" title="Sizes in stock" active={Boolean(filters.size)}>
        <div className="grid grid-cols-4 gap-1.5">
          {options.sizes.map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={filters.size === String(s)}
              onClick={() => toggle('size', String(s))}
              className={cn(
                'rounded-md border py-1.5 text-sm tabular-nums transition',
                filters.size === String(s) ? 'border-ink bg-ink text-white' : 'border-border hover:border-ink/40',
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </FilterMenu>

      {hasFilters && (
        <button
          type="button"
          onClick={() => onChange({ color: null, size: null })}
          className="flex items-center gap-1 text-sm text-muted-foreground underline-offset-4 hover:text-ink hover:underline"
        >
          <X aria-hidden className="size-3.5" /> Clear ({resultCount})
        </button>
      )}

      <div className="ml-auto flex items-center gap-3">
        <label className="sr-only" htmlFor="sort">Sort products</label>
        <select
          id="sort"
          value={filters.sort}
          onChange={(e) => onChange({ sort: e.target.value })}
          className="cursor-pointer rounded-md bg-transparent py-1 text-sm focus-visible:outline-none"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <Button asChild size="sm">
          <Link href={routes.addProduct}>
            <Plus aria-hidden /> Add shoe
          </Link>
        </Button>
      </div>
    </div>
  );
}
