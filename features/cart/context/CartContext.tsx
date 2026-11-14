'use client';

import { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { apiClient, ApiError } from '@/lib/api-client';
import { queryKeys } from '@/config/query-keys';
import { colorOf, useProducts } from '@/features/catalog';
import { useCartMutation, useCartQuery } from '../api/useServerCart';

/**
 * The bucket is the Shop API's cart (an order in CART status, its id in the cart_id cookie).
 * Adding a pair holds it in stock for the customer; the API keeps the hold alive while the
 * page pings /heartbeat, and the stock goes back if the tab is closed for good.
 */

export type CartLine = {
  itemId: string;
  productId: string; // the model: the catalog card (and local photo) it belongs to
  name: string;
  model: string;
  colour: string;
  colorHex: string;
  size: number;
  quantity: number;
  /** Pairs actually held for the customer; lower than quantity = the rest sold out. */
  reservedQuantity: number;
  priceMinor: number;
  currency: string;
};

type CartContextValue = {
  lines: CartLine[];
  orderId: string | null;
  itemCount: number;
  /** Display-only total. The amount charged is always computed by the API. */
  subtotalMinor: number;
  currency: string | null;
  isLoading: boolean;
  /** The item a change is being sent for (to show a spinner on its button). */
  pendingItemId: string | null;
  /** Message of the last failed change, e.g. "not enough units in stock". */
  error: string | null;
  addItem: (itemId: string) => void;
  removeItem: (itemId: string) => void;
  setQuantity: (itemId: string, quantity: number) => void;
  clear: () => void;
  quantityOf: (itemId: string) => number;
};

const CartContext = createContext<CartContextValue | null>(null);
const HEARTBEAT_MS = 2 * 60_000; // the API's hold lives 15 minutes after the last ping

export function CartProvider({ children }: { children: React.ReactNode }) {
  const qc = useQueryClient();
  const cart = useCartQuery();
  const products = useProducts();
  const change = useCartMutation();

  const orderId = cart.data?.orderId ?? null;
  const hasLines = (cart.data?.lines.length ?? 0) > 0;

  // Keep the holds alive while the store is open; 404 = the cart is gone, reload it.
  useEffect(() => {
    if (!orderId || !hasLines) return;
    const id = window.setInterval(() => {
      apiClient.post('/v1/cart/heartbeat').catch((e) => {
        if (e instanceof ApiError && e.status === 404) qc.invalidateQueries({ queryKey: queryKeys.cart });
      });
    }, HEARTBEAT_MS);
    return () => window.clearInterval(id);
  }, [orderId, hasLines, qc]);

  const { mutate } = change;
  const addItem = useCallback((itemId: string) => mutate({ type: 'add', itemId, quantity: 1 }), [mutate]);
  const removeItem = useCallback((itemId: string) => mutate({ type: 'remove', itemId }), [mutate]);
  const clear = useCallback(() => {
    if (orderId) mutate({ type: 'clear', orderId });
  }, [mutate, orderId]);

  const lines = useMemo<CartLine[]>(() => {
    // the cart has no prices: take them from the catalog (both are cached queries)
    const variants = new Map(
      (products.data ?? []).flatMap((p) => p.variants.map((v) => [v.itemId, { product: p }] as const)),
    );
    return (cart.data?.lines ?? []).map((l) => {
      const product = variants.get(l.itemId)?.product;
      return {
        itemId: l.itemId,
        productId: l.model,
        name: l.name,
        model: l.model,
        colour: colorOf(l.colour).name,
        colorHex: colorOf(l.colour).hex,
        size: l.size,
        quantity: l.quantity,
        reservedQuantity: l.reservedQuantity,
        priceMinor: product?.priceMinor ?? 0,
        currency: l.currency ?? product?.currency ?? 'EUR',
      };
    });
  }, [cart.data, products.data]);

  const setQuantity = useCallback(
    (itemId: string, quantity: number) => {
      const current = lines.find((l) => l.itemId === itemId)?.quantity ?? 0;
      const diff = Math.min(quantity, 10) - current;
      if (diff > 0) mutate({ type: 'add', itemId, quantity: diff });
      else if (diff < 0) mutate({ type: 'subtract', itemId, quantity: -diff });
    },
    [lines, mutate],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      orderId,
      itemCount: lines.reduce((n, l) => n + l.quantity, 0),
      subtotalMinor: lines.reduce((sum, l) => sum + l.priceMinor * l.quantity, 0),
      currency: lines[0]?.currency ?? null,
      isLoading: cart.isPending,
      pendingItemId:
        change.isPending && change.variables && 'itemId' in change.variables ? change.variables.itemId : null,
      error: change.error?.message ?? null,
      addItem,
      removeItem,
      setQuantity,
      clear,
      quantityOf: (id) => lines.find((l) => l.itemId === id)?.quantity ?? 0,
    }),
    [lines, orderId, cart.isPending, change.isPending, change.variables, change.error, addItem, removeItem, setQuantity, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
