/**
 * Browser-only image store: productId -> image data URL, kept in localStorage.
 * Images are NEVER sent to the Shop API. They live only in this browser, so another
 * device (or a cleared browser) shows the placeholder silhouette instead.
 *
 * Shaped for React's useSyncExternalStore: subscribe / getSnapshot / getServerSnapshot.
 */

type ImageMap = Readonly<Record<string, string>>;

const STORAGE_KEY = 'verdant.localImages.v1';
const EMPTY: ImageMap = Object.freeze({});
const listeners = new Set<() => void>();
let cache: ImageMap | null = null;

function read(): ImageMap {
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    cache = raw ? (JSON.parse(raw) as ImageMap) : EMPTY;
  } catch {
    cache = EMPTY;
  }
  return cache;
}

function write(next: ImageMap) {
  // Throws QuotaExceededError if the browser's ~5 MB budget is used up; callers handle it.
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  cache = next;
  listeners.forEach((l) => l());
}

export const localImageStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        cache = null; // another tab changed it
        listener();
      }
    };
    window.addEventListener('storage', onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener('storage', onStorage);
    };
  },
  getSnapshot: read,
  getServerSnapshot: (): ImageMap => EMPTY,
  save(productId: string, dataUrl: string) {
    write({ ...read(), [productId]: dataUrl });
  },
  remove(productId: string) {
    const next = { ...read() };
    delete next[productId];
    write(next);
  },
};
