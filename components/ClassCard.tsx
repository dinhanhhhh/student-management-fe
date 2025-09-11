// components/ClassCard.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ClassDoc } from "@/types/class";

/**
 * Card lớp, tự fetch sĩ số ở client để tránh chặn SSR khi BE chậm/403.
 * - Hiển thị "…" khi đang tải
 * - Hiển thị "—" khi lỗi/quyền không đủ (401/403)
 */
export default function ClassCard({ c }: { c: ClassDoc }) {
  const [count, setCount] = useState<number | null | "loading">("loading");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // Gọi trực tiếp BE qua rewrite /be (giữ cookie đăng nhập)
        const res = await fetch(
          `/be/classes/${c._id}/students?page=1&limit=1`,
          { credentials: "include", cache: "no-store" }
        );
        if (!mounted) return;

        if (!res.ok) {
          // 401/403/500 → không lộ lỗi, chỉ ẩn số
          setCount(null);
          return;
        }
        const json = await res.json();
        setCount(
          typeof json?.pagination?.total === "number"
            ? json.pagination.total
            : 0
        );
      } catch {
        if (mounted) setCount(null);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [c._id]);

  return (
    <Link
      href={`/classes/${c._id}`}
      className="rounded-xl border p-4 hover:shadow transition block"
    >
      <div className="text-lg font-semibold">{c.name}</div>
      <div className="text-gray-700">Khoa: {c.department}</div>
      <div className="text-gray-700">Khóa: {c.year}</div>
      <div className="text-gray-700">
        Sĩ số: {count === "loading" ? "…" : count === null ? "—" : count}
      </div>
    </Link>
  );
}
