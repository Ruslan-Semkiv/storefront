import { env } from './env';

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    /** The parsed response body, if it was JSON (a ProblemDetail, or e.g. a declined payment). */
    public readonly body: unknown = null,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request(path: string, init?: RequestInit): Promise<unknown> {
  const res = await fetch(`${env.NEXT_PUBLIC_SHOP_API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'X-Request-Id': crypto.randomUUID(), // correlate with backend logs
      ...init?.headers,
    },
    credentials: 'include',
  });
  if (!res.ok) {
    // Spring answers errors with a ProblemDetail; its `detail` says what went wrong.
    const body = (await res.json().catch(() => null)) as { detail?: string } | null;
    throw new ApiError(res.status, body?.detail ?? `Request to ${path} failed with ${res.status}`, body);
  }
  return res.status === 204 ? null : res.json();
}

const withBody = (method: string, body?: unknown): RequestInit => ({
  method,
  body: body === undefined ? undefined : JSON.stringify(body),
});

/** Thin typed fetch wrapper. Callers zod-parse the returned `unknown`. */
export const apiClient = {
  get: (path: string) => request(path),
  post: (path: string, body?: unknown) => request(path, withBody('POST', body)),
  put: (path: string, body?: unknown) => request(path, withBody('PUT', body)),
  delete: (path: string) => request(path, { method: 'DELETE' }),
};
