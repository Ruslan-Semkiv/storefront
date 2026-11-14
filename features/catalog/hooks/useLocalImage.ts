'use client';

import { useSyncExternalStore } from 'react';
import { localImageStore } from '../lib/local-image-store';

/** The browser-only image for a product, if one was added on this device. */
export function useLocalImage(productId: string): string | undefined {
  const images = useSyncExternalStore(
    localImageStore.subscribe,
    localImageStore.getSnapshot,
    localImageStore.getServerSnapshot,
  );
  return images[productId];
}
