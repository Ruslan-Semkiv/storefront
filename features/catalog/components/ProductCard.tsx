'use client';

import { useState } from 'react';
import { Check, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Price } from '@/components/shared/Price';
import { cn } from '@/lib/cn';
import { useCart } from '@/features/cart';
import type { Product } from '../schemas/product.schema';
import { useLocalImage } from '../hooks/useLocalImage';
import { ShoeImage } from './ShoeImage';
import { ColorSwatches } from './ColorSwatches';

type Props = {
  product: Product;
  selected: boolean;
  onSelect: () => void;
};

/**
 * Click the card to reveal the frosted "Buy" button over the photo. Pick a colour and a size:
 * that pair is one backend item, and "Buy" puts one pair of it in the server cart.
 */
export function ProductCard({ product, selected, onSelect }: Props) {
  const { addItem, quantityOf, pendingItemId } = useCart();
  const localImage = useLocalImage(product.id);
  const [color, setColor] = useState(product.colors[0].name);
  const [size, setSize] = useState<number | null>(null);

  const sizes = product.variants.filter((v) => v.colour === color);
  const variant = sizes.find((v) => v.size === size && v.units > 0);
  const inCart = product.variants.reduce((n, v) => n + quantityOf(v.itemId), 0);
  const tint = product.colors.find((c) => c.name === color)?.hex ?? product.colors[0].hex;
  const imageUrl = localImage ?? product.imageUrl;
  const adding = variant != null && pendingItemId === variant.itemId;

  const label = !product.inStock
    ? 'Out of stock'
    : !variant
      ? 'Pick a size'
      : adding
        ? 'Adding…'
        : inCart > 0
          ? `Buy · ${inCart} in bucket`
          : 'Buy';

  return (
    <article className="group">
      <div className="relative">
        <button
          type="button"
          onClick={onSelect}
          aria-expanded={selected}
          aria-label={`${product.name}, show buy option`}
          className="block w-full focus-visible:outline-none"
        >
          <ShoeImage
            name={product.name}
            imageUrl={imageUrl}
            colorHex={tint}
            imageClassName="transition-transform duration-500 group-hover:scale-105"
          />
        </button>

        <div className="pointer-events-none absolute left-3 top-3 flex gap-2">
          {!product.inStock && <Badge variant="outline">Sold out</Badge>}
          {localImage && <Badge variant="outline">Your photo</Badge>}
        </div>

        {/* Frosted Buy button floats over the photo once the card is selected */}
        <div
          className={cn(
            'absolute inset-x-3 bottom-3 transition-all duration-300',
            selected ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0',
          )}
        >
          <Button
            className="w-full"
            disabled={!variant || adding}
            tabIndex={selected ? 0 : -1}
            onClick={() => variant && addItem(variant.itemId)}
          >
            {inCart > 0 ? <Check aria-hidden /> : <ShoppingBag aria-hidden />}
            {label}
          </Button>
        </div>
      </div>

      <div className="space-y-1.5 pt-4">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{product.model}</p>
        <h2 className="text-[15px] font-medium">{product.name}</h2>
        <Price amountMinor={product.priceMinor} currency={product.currency} className="text-[15px]" />
        <ColorSwatches
          colors={product.colors}
          selected={color}
          onSelect={(c) => {
            setColor(c);
            setSize(null);
          }}
        />
        <div className="flex flex-wrap gap-1 pt-1" role="radiogroup" aria-label="Sizes">
          {sizes.map((v) => (
            <button
              key={v.itemId}
              type="button"
              role="radio"
              aria-checked={size === v.size}
              aria-label={`Size ${v.size}${v.units > 0 ? '' : ', sold out'}`}
              disabled={v.units <= 0}
              title={v.units > 0 ? `${v.units} in stock` : 'Sold out'}
              onClick={() => setSize(v.size)}
              className={cn(
                'min-w-8 rounded border px-1.5 py-0.5 text-xs tabular-nums transition',
                size === v.size ? 'border-ink bg-ink text-white' : 'border-border hover:border-ink/40',
                v.units <= 0 && 'cursor-not-allowed text-muted-foreground line-through opacity-50',
              )}
            >
              {v.size}
            </button>
          ))}
        </div>
      </div>
    </article>
  );
}
