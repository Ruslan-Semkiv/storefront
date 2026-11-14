import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/config/query-keys';
import { itemPageSchema, type Item } from '../schemas/product.schema';
import { toProducts } from '../lib/to-products';

const PAGE = 200;

/** GET /v1/items, every page, grouped into one product per model. */
export function useProducts() {
  return useQuery({
    queryKey: queryKeys.products.list(),
    queryFn: async () => {
      const items: Item[] = [];
      for (let page = 0; ; page++) {
        const res = itemPageSchema.parse(await apiClient.get(`/v1/items?page=${page}&size=${PAGE}&sort=name`));
        items.push(...res.content);
        const totalPages = res.page?.totalPages ?? res.totalPages ?? 1;
        if (page + 1 >= totalPages) break;
      }
      return toProducts(items);
    },
    staleTime: 60_000,
  });
}
