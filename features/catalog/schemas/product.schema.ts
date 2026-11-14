import { z } from 'zod';

export const productColorSchema = z.object({
  name: z.string().min(1),
  hex: z.string().regex(/^#[0-9a-fA-F]{6}$/),
});

/** One row of GET /v1/items (Spring's ItemResponseDto): one model in one colour and one size. */
export const itemSchema = z.object({
  id: z.string(),
  name: z.string(),
  colour: z.string(),
  model: z.string(),
  unitsNumber: z.number().int(),
  size: z.number().int(),
  price: z.number().int().nonnegative(), // minor units (cents)
  currency: z.string().length(3),
});

/** Spring Data page; only what the client reads. */
export const itemPageSchema = z.object({
  content: z.array(itemSchema),
  page: z.object({ totalPages: z.number().int() }).optional(),
  totalPages: z.number().int().optional(),
});

/** A buyable item of a product: its colour and size, and the backend item id the cart uses. */
export type Variant = { itemId: string; colour: string; size: number; units: number };

export type ProductColor = z.infer<typeof productColorSchema>;
export type Item = z.infer<typeof itemSchema>;

/** What the catalog shows: the backend's items grouped into one card per model. */
export type Product = {
  id: string; // the model code
  name: string;
  model: string;
  priceMinor: number;
  currency: string;
  colors: ProductColor[];
  variants: Variant[];
  imageUrl: string | null;
  inStock: boolean;
};
