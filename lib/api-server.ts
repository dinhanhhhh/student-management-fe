import { headers } from "next/headers";
import { ApiError } from "./api-types";

/**
 * Server fetch:
 * - Build absolute URL từ proto/host để giữ cookie SSR sau proxy.
 * - Luôn throw ApiError khi !res.ok → trả T "sạch".
 * - Không dùng any.
 */
export async function apiServerFetch<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const h = await headers(); // Next 15: Promise<ReadonlyHeaders>
  const cookie = h.get("cookie") ?? "";
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("host") ?? "localhost:3000";
  const base = `${proto}://${host}`;

  const normalized = path.startsWith("/") ? path : `/${path}`;

  const res = await fetch(`${base}/be${normalized}`, {
    method: init.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      cookie,
      ...(init.headers ?? {}),
    },
    cache: "no-store",
    ...init,
  });

  if (!res.ok) {
    let data: unknown = undefined;
    try {
      data = await res.clone().json();
    } catch {
      try {
        data = await res.text();
      } catch {
        /* ignore */
      }
    }
    throw new ApiError({
      status: res.status,
      data,
      message:
        (typeof data === "string" && data.trim()) ||
        res.statusText ||
        `HTTP ${res.status}`,
    });
  }

  if (res.status === 204) return {} as T;
  return (await res.json()) as T;
}
