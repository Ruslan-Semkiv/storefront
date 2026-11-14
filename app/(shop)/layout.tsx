import { StoreShell } from '@/components/layouts/StoreShell';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <StoreShell>{children}</StoreShell>;
}
