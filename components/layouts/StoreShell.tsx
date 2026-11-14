import { SiteHeader } from './parts/SiteHeader';
import { SiteFooter } from './parts/SiteFooter';

/**
 * The header is fixed and translucent, so <main> has no top padding:
 * the landing hero sits underneath the bar; other pages add `pt-header` themselves.
 */
export function StoreShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
