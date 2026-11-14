'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Clock, ShoppingBasket, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Price } from '@/components/shared/Price';
import { routes } from '@/config/routes';
import { ApiError } from '@/lib/api-client';
import { useCart } from '../context/CartContext';
import { usePayOrder, usePlaceOrder, type PurchaseResult } from '../api/usePlaceOrder';
import { PAYMENT_TYPES, type PaymentType } from '../schemas/order.schema';
import { CartLineItem } from './CartLineItem';

const selectClass =
  'flex h-10 w-full rounded-md border border-border bg-white px-3 text-sm focus-visible:border-ink focus-visible:outline-none';

/** After "Purchase all": the order is placed; shows how its payment went, and lets a failed one be retried. */
function PurchaseOutcome({ result, currency, onDone }: { result: PurchaseResult; currency: string; onDone: () => void }) {
  const retry = usePayOrder();
  const [paymentType, setPaymentType] = useState<PaymentType>((result.order.paymentType as PaymentType) ?? 'VISA');
  const current = retry.data ?? result;
  const status = current.payment?.status;
  const total = result.order.total;

  const paid = status === 'SUCCEEDED';
  const pending = status === 'PROCESSING' || status === 'RETRY_PENDING';
  const Icon = paid ? CheckCircle2 : pending ? Clock : XCircle;

  return (
    <Card className="mx-auto max-w-lg text-center">
      <CardContent className="space-y-4 p-8">
        <Icon aria-hidden className={paid ? 'mx-auto size-12 text-forest-700' : 'mx-auto size-12 text-muted-foreground'} />
        <h2 className="text-2xl font-medium">
          {paid ? 'Thank you, your order is paid!' : pending ? 'Your payment is being processed' : 'Your order is placed, but not paid'}
        </h2>
        <p className="text-muted-foreground">
          Order <span className="font-mono text-foreground">{result.order.id.slice(0, 8).toUpperCase()}</span>
          {total != null && (
            <>
              {' · '}
              <Price amountMinor={total} currency={current.payment?.currency ?? currency} className="font-medium text-foreground" />
            </>
          )}
        </p>
        {pending && (
          <p className="text-sm text-muted-foreground">
            The payment provider didn&apos;t answer in time. We keep trying in the background; nothing is charged twice.
          </p>
        )}
        {!paid && !pending && (
          <div className="space-y-3 text-left">
            <p className="text-sm text-destructive" role="alert">
              {status === 'DECLINED'
                ? 'Your payment was declined. Try another payment method.'
                : (current.paymentError ?? 'The payment could not be completed. Please try again.')}
            </p>
            <Label htmlFor="retry-payment-type">Pay with</Label>
            <select id="retry-payment-type" className={selectClass} value={paymentType} onChange={(e) => setPaymentType(e.target.value as PaymentType)}>
              {PAYMENT_TYPES.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
            <Button className="w-full" disabled={retry.isPending} onClick={() => retry.mutate({ orderId: result.order.id, paymentType })}>
              {retry.isPending ? 'Paying…' : 'Try paying again'}
            </Button>
          </div>
        )}
        <Button asChild variant="outline" onClick={onDone}>
          <Link href={routes.catalog}>Continue shopping</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export function CartView() {
  const { lines, itemCount, subtotalMinor, currency, clear, isLoading, error: cartError } = useCart();
  const placeOrder = usePlaceOrder();
  const [paymentType, setPaymentType] = useState<PaymentType>('VISA');

  if (placeOrder.isSuccess) {
    return <PurchaseOutcome result={placeOrder.data} currency={currency ?? 'EUR'} onDone={() => placeOrder.reset()} />;
  }

  if (isLoading) {
    return <div className="h-40 animate-pulse rounded-lg bg-tile" aria-busy="true" />;
  }

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-border py-16 text-center">
        <ShoppingBasket aria-hidden className="size-10 text-muted-foreground" />
        <p className="text-muted-foreground">Your bucket is empty.</p>
        <Button asChild>
          <Link href={routes.catalog}>Browse the catalog</Link>
        </Button>
      </div>
    );
  }

  const short = lines.some((l) => l.reservedQuantity < l.quantity);
  const errorMessage =
    placeOrder.error instanceof ApiError && placeOrder.error.status === 409
      ? 'One of the items just sold out. Lower its quantity or remove it and try again.'
      : placeOrder.error
        ? 'Something went wrong placing your order. Please try again.'
        : cartError;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <ul className="divide-y divide-border">
        {lines.map((line) => (
          <CartLineItem key={line.itemId} line={line} />
        ))}
      </ul>

      <Card className="h-fit">
        <CardContent className="space-y-4 p-6">
          <div className="flex justify-between text-sm">
            <span>Items</span>
            <span className="tabular-nums">{itemCount}</span>
          </div>
          <div className="flex justify-between text-lg font-medium">
            <span>Subtotal</span>
            {currency && <Price amountMinor={subtotalMinor} currency={currency} />}
          </div>
          <p className="text-xs text-muted-foreground">Pairs in your bucket are held for you while this page is open.</p>

          <div className="space-y-2">
            <Label htmlFor="payment-type">Pay with</Label>
            <select id="payment-type" className={selectClass} value={paymentType} onChange={(e) => setPaymentType(e.target.value as PaymentType)}>
              {PAYMENT_TYPES.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>

          {errorMessage && <p className="text-sm text-destructive" role="alert">{errorMessage}</p>}

          <Button size="lg" className="w-full" onClick={() => placeOrder.mutate(paymentType)} disabled={placeOrder.isPending || short}>
            {placeOrder.isPending ? 'Placing order…' : 'Purchase all'}
          </Button>
          <Button variant="ghost" className="w-full" onClick={clear} disabled={placeOrder.isPending}>
            Clear bucket
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
