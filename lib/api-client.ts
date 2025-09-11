import { ApiError, ApiErrorResult } from "./api-types";

/**
 * Client fetch:
 * - Gọi /be/* (rewrite về BE /api/*), credentials: "include".
 * - Mặc định throw ApiError khi !ok; nếu opts.skipThrow → trả union.
 */
export async function apiClientFetch<T>(
  path: string,
  init: RequestInit = {},
  opts?: { skipThrow?: boolean }
): Promise<T | ApiErrorResult> {
  const normalized = path.startsWith("/") ? path : `/${path}`;

  const res = await fetch(`/be${normalized}`, {
    method: init.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    credentials: "include",
    cache: "no-store",
    ...init,
  });

  if (!res.ok) {
    let data: unknown;
    try {
      data = await res.clone().json();
    } catch {
      try {
        data = await res.text();
      } catch {
        data = undefined;
      }
    }

    if (opts?.skipThrow) {
      return {
        error: true,
        status: res.status,
        data,
        message:
          (typeof data === "string" && data) ||
          res.statusText ||
          `HTTP ${res.status}`,
      };
    }

    throw new ApiError({
      status: res.status,
      data,
      message:
        (typeof data === "string" && data) ||
        res.statusText ||
        `HTTP ${res.status}`,
    });
  }

  if (res.status === 204) return {} as T;
  return (await res.json()) as T;
}
