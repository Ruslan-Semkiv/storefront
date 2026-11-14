import type { ProductColor } from '../schemas/product.schema';

/** Colours a shoe can be listed in. Used by the add-shoe form, the cards and the colour filter. */
export const SHOE_COLORS: ProductColor[] = [
  { name: 'Black', hex: '#111111' },
  { name: 'White', hex: '#f4f4f2' },
  { name: 'Grey', hex: '#7a7a7a' },
  { name: 'Navy', hex: '#1d3557' },
  { name: 'Blue', hex: '#4a4ae8' },
  { name: 'Green', hex: '#1a422f' },
  { name: 'Olive', hex: '#5b6b2f' },
  { name: 'Teal', hex: '#2fb5a6' },
  { name: 'Tan', hex: '#c08457' },
  { name: 'Beige', hex: '#d8c3a5' },
  { name: 'Nude', hex: '#e3bc9a' },
  { name: 'Brown', hex: '#6b4423' },
  { name: 'Red', hex: '#e02424' },
  { name: 'Orange', hex: '#f08a24' },
  { name: 'Burgundy', hex: '#5c1a2b' },
  { name: 'Yellow', hex: '#f5d77a' },
];

/** The backend stores colours as free text ("black"); unknown ones get a neutral swatch. */
export function colorOf(name: string): ProductColor {
  const known = SHOE_COLORS.find((c) => c.name.toLowerCase() === name.trim().toLowerCase());
  return known ?? { name: name.charAt(0).toUpperCase() + name.slice(1), hex: '#9a9a9a' };
}
