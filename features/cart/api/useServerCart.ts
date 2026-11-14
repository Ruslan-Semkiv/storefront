import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/config/query-keys';
import { cartSchema, type Cart } from '../schemas/order.schema';

/**
 * The server cart. Its id lives in the API's HttpOnly cart_id cookie, so there is nothing to keep
 * in the browser: every call just sends the cookie and gets the whole cart back.
 */
export function useCartQuery() {
  return useQuery({
    queryKey: queryKeys.cart,
    queryFn: async () => cartSchema.parse(await apiClient.get('/v1/cart')),
    staleTime: 30_000,
  });
}

type CartChange =
  | { type: 'add'; itemId: string; quantity: number } // hold flow: POST /v1/cart/lines
  | { type: 'subtract'; itemId: string; quantity: number } // release flow: PUT /v1/cart/lines
  | { type: 'remove'; itemId: string } // DELETE /v1/cart/lines/{itemId}
  | { type: 'clear'; orderId: string }; // DELETE /v1/orders/{orderId}: releases every hold

async function send(change: CartChange): Promise<Cart> {
  switch (change.type) {
    case 'add':
      return cartSchema.parse(await apiClient.post('/v1/cart/lines', { itemId: change.itemId, quantity: change.quantity }));
    case 'subtract':
      return cartSchema.parse(await apiClient.put('/v1/cart/lines', { itemId: change.itemId, quantity: change.quantity }));
    case 'remove':
      return cartSchema.parse(await apiClient.delete(`/v1/cart/lines/${change.itemId}`));
    case 'clear':
      await apiClient.delete(`/v1/orders/${change.orderId}`);
      return { orderId: null, lines: [] };
  }
}

export function useCartMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: send,
    onSuccess: (cart) => qc.setQueryData(queryKeys.cart, cart),
    // 404 = the cart expired or was checked out elsewhere; reload what the server has
    onError: () => qc.invalidateQueries({ queryKey: queryKeys.cart }),
  });
}
