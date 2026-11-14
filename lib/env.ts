import { z } from 'zod';

const schema = z.object({
  NEXT_PUBLIC_SHOP_API_URL: z.url(),
  NEXT_PUBLIC_APP_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  NEXT_PUBLIC_DEFAULT_CURRENCY: z.string().length(3).default('EUR'),
});

// Literal process.env.NEXT_PUBLIC_* references so Next.js inlines them at build time.
const parsed = schema.safeParse({
  NEXT_PUBLIC_SHOP_API_URL: process.env.NEXT_PUBLIC_SHOP_API_URL,
  NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
  NEXT_PUBLIC_DEFAULT_CURRENCY: process.env.NEXT_PUBLIC_DEFAULT_CURRENCY,
});

if (!parsed.success) {
  console.error('Invalid environment variables:', z.flattenError(parsed.error).fieldErrors);
  throw new Error('Invalid environment variables. Check .env.local against .env.example');
}

export const env = parsed.data;
