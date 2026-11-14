import { formatMoney } from '@/lib/format';
import { cn } from '@/lib/cn';

type Props = { amountMinor: number; currency: string; className?: string };

export function Price({ amountMinor, currency, className }: Props) {
  return <span className={cn('tabular-nums', className)}>{formatMoney(amountMinor, currency)}</span>;
}
