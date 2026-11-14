/** Money is always integer minor units (cents) + ISO currency code. Formatting happens only here. */
export function formatMoney(amountMinor: number, currency: string, locale = 'en-IE'): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amountMinor / 100);
}
