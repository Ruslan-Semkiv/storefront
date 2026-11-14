import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Tailwind class merger (same helper shadcn/ui ships). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
