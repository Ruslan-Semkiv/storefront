import type { Product, ProductColor } from '../schemas/product.schema';

export const SORT_OPTIONS = [
  { value: 'default', label: 'Default sorting' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'name', label: 'Name A–Z' },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]['value'];

export type ProductFilters = {
  color: string | null;
  size: string | null;
  sort: SortValue;
};

export const PAGE_SIZE = 8;

/** A product matches when one of its in-stock variants has the colour and size asked for. */
export function filterAndSort(products: Product[], f: ProductFilters): Product[] {
  const result = products.filter((p) =>
    p.variants.some(
      (v) => (!f.color || v.colour === f.color) && (!f.size || (String(v.size) === f.size && v.units > 0)),
    ),
  );
  switch (f.sort) {
    case 'price-asc':
      return result.toSorted((a, b) => a.priceMinor - b.priceMinor);
    case 'price-desc':
      return result.toSorted((a, b) => b.priceMinor - a.priceMinor);
    case 'name':
      return result.toSorted((a, b) => a.name.localeCompare(b.name));
    default:
      return result;
  }
}

/** Distinct facet values present in the current product list. */
export function facets(products: Product[]) {
  const colors = new Map<string, ProductColor>();
  const sizes = new Set<number>();
  products.forEach((p) => {
    p.colors.forEach((c) => colors.set(c.name, c));
    p.variants.forEach((v) => v.units > 0 && sizes.add(v.size));
  });
  return {
    colors: [...colors.values()].sort((a, b) => a.name.localeCompare(b.name)),
    sizes: [...sizes].sort((a, b) => a - b),
  };
}
