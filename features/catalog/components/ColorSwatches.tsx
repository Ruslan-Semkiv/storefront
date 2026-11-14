'use client';

import { cn } from '@/lib/cn';
import type { ProductColor } from '../schemas/product.schema';

type Props = {
  colors: ProductColor[];
  selected?: string;
  onSelect?: (name: string) => void;
  size?: 'sm' | 'md';
};

/** Row of round colour dots. The selected dot gets a ring, like the reference design. */
export function ColorSwatches({ colors, selected, onSelect, size = 'sm' }: Props) {
  return (
    <div className="flex items-center gap-2" role={onSelect ? 'radiogroup' : 'list'} aria-label="Colours">
      {colors.map((c) => {
        const isSelected = selected === c.name;
        const dot = (
          <span
            className={cn('block rounded-full ring-1 ring-black/10', size === 'sm' ? 'size-3.5' : 'size-4')}
            style={{ backgroundColor: c.hex }} // runtime value from the API
          />
        );
        return onSelect ? (
          <button
            key={c.name}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={c.name}
            title={c.name}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(c.name);
            }}
            className={cn(
              'rounded-full p-0.5 ring-1 ring-transparent transition',
              isSelected ? 'ring-ink' : 'hover:ring-black/30',
            )}
          >
            {dot}
          </button>
        ) : (
          <span key={c.name} role="listitem" title={c.name} className="p-0.5">
            {dot}
          </span>
        );
      })}
    </div>
  );
}
