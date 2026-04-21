import { getStoredToken } from "./auth-storage";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000/api";

type ApiFetchOptions = RequestInit & {
  auth?: boolean;
};

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}) {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  if (options.auth) {
    const token = getStoredToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let message = "Request failed.";

    try {
      const errorData = (await response.json()) as { message?: string };
      message = errorData.message ?? message;
    } catch {
      // Keep the fallback message.
    }

    throw new ApiError(message, response.status);
  }

  return (await response.json()) as T;
}
