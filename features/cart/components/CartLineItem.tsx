'use client';

import { Minus, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Price } from '@/components/shared/Price';
import { ShoeImage, useLocalImage } from '@/features/catalog';
import { useCart, type CartLine } from '../context/CartContext';

export function CartLineItem({ line }: { line: CartLine }) {
  const { removeItem, setQuantity, pendingItemId } = useCart();
  const { itemId, quantity, reservedQuantity } = line;
  const localImage = useLocalImage(line.productId);
  const busy = pendingItemId === itemId;
  const short = quantity - reservedQuantity;

  return (
    <li className="flex items-center gap-4 py-4">
      <ShoeImage
        name={line.name}
        imageUrl={localImage}
        colorHex={line.colorHex}
        className="aspect-square size-20 shrink-0 rounded-md"
      />
      <div className="min-w-0 flex-1">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{line.model}</p>
        <p className="truncate font-medium">{line.name}</p>
        <p className="text-sm text-muted-foreground">
          {line.colour} · size {line.size} · <Price amountMinor={line.priceMinor} currency={line.currency} />
        </p>
        {short > 0 && (
          <p className="text-sm text-destructive">
            {reservedQuantity === 0 ? 'Sold out meanwhile' : `Only ${reservedQuantity} still available`}
          </p>
        )}
      </div>

      <div className="flex items-center gap-1" aria-label={`Quantity of ${line.name}`}>
        <Button variant="outline" size="icon" className="size-8" disabled={busy} onClick={() => setQuantity(itemId, quantity - 1)} aria-label="Decrease quantity">
          <Minus aria-hidden />
        </Button>
        <span className="w-6 text-center tabular-nums" aria-live="polite">{quantity}</span>
        <Button variant="outline" size="icon" className="size-8" disabled={busy || quantity >= 10} onClick={() => setQuantity(itemId, quantity + 1)} aria-label="Increase quantity">
          <Plus aria-hidden />
        </Button>
      </div>

      <Price amountMinor={line.priceMinor * quantity} currency={line.currency} className="hidden w-24 text-right font-medium sm:block" />

      <Button variant="destructive" size="sm" disabled={busy} onClick={() => removeItem(itemId)} aria-label={`Remove ${line.name} from bucket`}>
        <X aria-hidden />
        <span className="hidden sm:inline">Remove</span>
      </Button>
    </li>
  );
}
