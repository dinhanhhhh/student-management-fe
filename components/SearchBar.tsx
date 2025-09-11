// components/SearchBar.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchBar({
  placeholder = "Tìm theo tên, mã…",
  param = "q",
}: {
  placeholder?: string;
  /** tên query param dùng để search (mặc định: q) */
  param?: string;
}) {
  const router = useRouter();
  const sp = useSearchParams();
  const [value, setValue] = useState(sp.get(param) ?? "");

  // đồng bộ khi back/forward hoặc URL đổi
  useEffect(() => {
    setValue(sp.get(param) ?? "");
  }, [sp, param]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(sp.toString());

    const trimmed = value.trim();
    if (trimmed) params.set(param, trimmed);
    else params.delete(param);

    // reset về trang 1 khi search
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring"
      />
      <button
        type="submit"
        className="rounded-lg bg-black text-white px-4 py-2 text-sm"
      >
        Tìm
      </button>
    </form>
  );
}
