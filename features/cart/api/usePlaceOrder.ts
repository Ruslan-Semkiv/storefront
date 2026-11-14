import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, ApiError } from '@/lib/api-client';
import { queryKeys } from '@/config/query-keys';
import { orderSchema, paymentSchema, type Order, type Payment, type PaymentType } from '../schemas/order.schema';

export type PurchaseResult = { order: Order; payment: Payment | null; paymentError: string | null };

/** POST /v1/orders/{id}/payments. 402 (declined) comes back as a DECLINED payment. */
async function pay(orderId: string, paymentType: PaymentType): Promise<Pick<PurchaseResult, 'payment' | 'paymentError'>> {
  try {
    return { payment: paymentSchema.parse(await apiClient.post(`/v1/orders/${orderId}/payments`, { paymentType })), paymentError: null };
  } catch (e) {
    // 402: the provider declined; the body is the DECLINED payment with the reason in lastError
    const declined = e instanceof ApiError && e.status === 402 ? paymentSchema.safeParse(e.body) : null;
    if (declined?.success) return { payment: declined.data, paymentError: null };
    return { payment: null, paymentError: e instanceof ApiError ? e.message : 'The payment could not be started' };
  }
}

/**
 * "Purchase all": checkout turns the cart into a placed order (the held pairs are sold, the
 * cart cookie is cleared), then the order is paid. A failed payment leaves a placed order that
 * can be paid again with {@link usePayOrder}.
 */
export function usePlaceOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (paymentType: PaymentType): Promise<PurchaseResult> => {
      const order = orderSchema.parse(await apiClient.post('/v1/cart/checkout', { paymentType }));
      return { order, ...(await pay(order.id, paymentType)) };
    },
    onSuccess: () => {
      qc.setQueryData(queryKeys.cart, { orderId: null, lines: [] });
      qc.invalidateQueries({ queryKey: queryKeys.products.all }); // stock changed
    },
  });
}

/** Pays an already placed order again (after a decline, or another payment method). */
export function usePayOrder() {
  return useMutation({
    mutationFn: ({ orderId, paymentType }: { orderId: string; paymentType: PaymentType }) => pay(orderId, paymentType),
  });
}
