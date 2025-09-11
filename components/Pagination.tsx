// components/Pagination.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function Pagination({
  page,
  totalPages,
}: {
  page: number;
  totalPages: number;
}) {
  const router = useRouter();
  const sp = useSearchParams();

  const go = (p: number) => {
    const params = new URLSearchParams(sp.toString());
    params.set("page", String(p));
    router.push(`?${params.toString()}`);
  };

  if (totalPages <= 1) return null;

  return (
    <div className="mt-6 flex items-center justify-center gap-2">
      <button
        className="rounded-lg border px-3 py-1 text-sm disabled:opacity-50"
        onClick={() => go(Math.max(1, page - 1))}
        disabled={page <= 1}
      >
        ← Trước
      </button>
      <span className="text-sm text-gray-700">
        Trang {page} / {totalPages}
      </span>
      <button
        className="rounded-lg border px-3 py-1 text-sm disabled:opacity-50"
        onClick={() => go(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
      >
        Sau →
      </button>
    </div>
  );
}
