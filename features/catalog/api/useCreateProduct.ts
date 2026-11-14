import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/config/query-keys';
import { itemSchema } from '../schemas/product.schema';
import type { CreateItemRequest } from '../schemas/create-product.schema';

/** POST /v1/items once per colour and size. Metadata only; the image is saved locally by the caller. */
export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (items: CreateItemRequest[]) =>
      Promise.all(items.map(async (body) => itemSchema.parse(await apiClient.post('/v1/items', body)))),
    onSettled: () => qc.invalidateQueries({ queryKey: queryKeys.products.all }),
  });
}
