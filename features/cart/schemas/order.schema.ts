import { z } from 'zod';

/** GET /v1/cart line (Spring's CartLineResponseDto). No price: the client takes it from the catalog. */
export const cartLineSchema = z.object({
  orderLineId: z.string().nullable(),
  itemId: z.string(),
  name: z.string(),
  model: z.string(),
  colour: z.string(),
  size: z.number().int(),
  quantity: z.number().int(),
  currency: z.string().nullable(),
  reservedQuantity: z.number().int(), // < quantity = the rest sold out while the hold had expired
  reservedUntil: z.string().nullable(),
});

export const cartSchema = z.object({
  orderId: z.string().nullable(),
  lines: z.array(cartLineSchema),
});

export const PAYMENT_TYPES = [
  { value: 'VISA', label: 'Visa' },
  { value: 'MASTER_CARD', label: 'Mastercard' },
  { value: 'PAY_PAL', label: 'PayPal' },
  { value: 'APPLE_PAY', label: 'Apple Pay' },
  { value: 'GOOGLE_PAY', label: 'Google Pay' },
] as const;
export type PaymentType = (typeof PAYMENT_TYPES)[number]['value'];

/** POST /v1/cart/checkout response (OrderResponseDto). total in minor units. */
export const orderSchema = z.object({
  id: z.string(),
  status: z.string(),
  total: z.number().int().nullable(),
  paymentType: z.string().nullable(),
  orderLines: z.array(z.string()),
});

/** POST /v1/orders/{id}/payments response (PaymentResponseDto). */
export const paymentSchema = z.object({
  paymentId: z.string(),
  orderId: z.string(),
  status: z.enum(['PROCESSING', 'RETRY_PENDING', 'SUCCEEDED', 'DECLINED', 'FAILED']),
  amount: z.number().int(),
  currency: z.string(),
  nextAttemptAt: z.string().nullable().optional(),
  lastError: z.string().nullable().optional(),
});

export type Cart = z.infer<typeof cartSchema>;
export type Order = z.infer<typeof orderSchema>;
export type Payment = z.infer<typeof paymentSchema>;
