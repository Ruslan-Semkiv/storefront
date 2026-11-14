import { z } from 'zod';

/** POST /v1/items body (Spring's ItemRequestDto): one colour + size of a model. */
export type CreateItemRequest = {
  name: string;
  model: string;
  colour: string;
  size: number;
  unitsNumber: number;
  price: number; // minor units (cents)
  currency: string;
};

export const SHOE_SIZES = Array.from({ length: 13 }, (_, i) => 35 + i); // 35..47

/** Form values: price typed in major units (e.g. 129.90), converted to cents on submit. */
export const addProductFormSchema = z.object({
  name: z.string().trim().min(2, 'At least 2 characters').max(60),
  model: z.string().trim().min(1, 'Required').max(40),
  price: z.string().regex(/^\d{1,5}([.,]\d{1,2})?$/, 'Enter a price like 129 or 129.90'),
  units: z.string().regex(/^[1-9]\d{0,3}$/, 'Pairs per size, 1 to 9999'),
  colorNames: z.array(z.string()).min(1, 'Pick at least one colour'),
  sizes: z.array(z.number()).min(1, 'Pick at least one size'),
});

export type AddProductFormValues = z.infer<typeof addProductFormSchema>;
