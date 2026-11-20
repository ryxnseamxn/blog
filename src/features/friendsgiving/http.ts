import { API_BASE_URL } from '@/config/env';

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  adminKey?: string;
}

export async function request<T>(path: string, { method = 'GET', body, adminKey }: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (adminKey) headers['X-Admin-Key'] = adminKey;

  const response = await send(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!response.ok) throw new ApiError(response.status, await readError(response));
  return response.status === 204 ? (undefined as T) : ((await response.json()) as T);
}

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Something went wrong.';
}

async function send(url: string, init: RequestInit): Promise<Response> {
  try {
    return await fetch(url, init);
  } catch {
    throw new ApiError(0, `Can't reach the server at ${API_BASE_URL}.`);
  }
}

async function readError(response: Response): Promise<string> {
  const text = await response.text();
  try {
    // Model-binding failures arrive as ASP.NET ProblemDetails JSON; everything else is plain text.
    const problem = JSON.parse(text);
    const firstError = Object.values(problem.errors ?? {}).flat()[0];
    return String(firstError ?? problem.detail ?? problem.title ?? text);
  } catch {
    return text || `Request failed (${response.status}).`;
  }
}
