import { auth } from "./auth";

const BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:8000";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = auth.getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(init.headers as Record<string, string> | undefined),
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...init, headers });

  // Clear token and send back to login on 401 — session expired or invalid.
  if (res.status === 401) {
    auth.clearToken();
    if (typeof window !== "undefined") {
      window.location.href = "/auth/login";
    }
    throw new ApiError("Session expired. Please sign in again.", 401);
  }

  let json: Record<string, unknown>;
  try {
    json = (await res.json()) as Record<string, unknown>;
  } catch {
    throw new ApiError(`HTTP ${res.status}`, res.status);
  }

  if (!json.success) {
    throw new ApiError((json.error as string | undefined) ?? "Unknown error", res.status);
  }

  return json as T;
}

export const api = {
  get<T>(path: string): Promise<T> {
    return apiFetch<T>(path);
  },

  post<T>(path: string, body?: unknown): Promise<T> {
    return apiFetch<T>(path, {
      method: "POST",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  },

  put<T>(path: string, body?: unknown): Promise<T> {
    return apiFetch<T>(path, {
      method: "PUT",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  },
};
