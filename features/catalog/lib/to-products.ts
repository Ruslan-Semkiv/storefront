import type { Item, Product, ProductColor } from '../schemas/product.schema';
import { colorOf } from './palette';

/**
 * The backend sells items (model + colour + size); the catalog shows products (one card per
 * model, with its colours and sizes). Pure function: no React, unit-testable.
 */
export function toProducts(items: Item[]): Product[] {
  const byModel = new Map<string, Item[]>();
  for (const item of items) {
    const group = byModel.get(item.model);
    if (group) group.push(item);
    else byModel.set(item.model, [item]);
  }

  return [...byModel.entries()].map(([model, group]) => {
    const colors = new Map<string, ProductColor>();
    group.forEach((i) => colors.set(i.colour.toLowerCase(), colorOf(i.colour)));
    const cheapest = group.reduce((a, b) => (b.price < a.price ? b : a));
    return {
      id: model,
      name: group[0].name,
      model,
      priceMinor: cheapest.price,
      currency: cheapest.currency,
      colors: [...colors.values()],
      variants: group
        .map((i) => ({ itemId: i.id, colour: colorOf(i.colour).name, size: i.size, units: i.unitsNumber }))
        .sort((a, b) => a.size - b.size),
      imageUrl: null,
      inStock: group.some((i) => i.unitsNumber > 0),
    };
  });
}
