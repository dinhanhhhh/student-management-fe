// components/ClassForm.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ClassDoc } from "@/types/class";
import { apiClientFetch } from "@/lib/api-client";
import type { ApiErrorResult } from "@/lib/api-types";

/* ---------- Type guards (loại bỏ any) ---------- */
function hasProp<K extends PropertyKey>(
  obj: object,
  prop: K
): obj is Record<K, unknown> {
  return prop in obj;
}

function isApiErrorResult(v: unknown): v is ApiErrorResult {
  return typeof v === "object" && v !== null && hasProp(v as object, "error");
}

/* -------------------------- Component -------------------------- */
interface Props {
  initial?: Pick<ClassDoc, "_id" | "name" | "department" | "year"> | null;
}

export default function ClassForm({ initial }: Props) {
  const router = useRouter();
  const [name, setName] = useState<string>(initial?.name ?? "");
  const [department, setDepartment] = useState<string>(
    initial?.department ?? ""
  );
  const [year, setYear] = useState<number>(
    initial?.year ?? new Date().getFullYear()
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [err, setErr] = useState<string | null>(null);

  // Trả về boolean rõ ràng, không để chuỗi truthy
  const canSubmit =
    name.trim().length > 0 &&
    department.trim().length > 0 &&
    Number.isFinite(year);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) {
      setErr("Vui lòng nhập đủ Tên lớp, Khoa và Khóa.");
      return;
    }
    setErr(null);
    setLoading(true);

    try {
      const body = JSON.stringify({
        name: name.trim(),
        department: department.trim(),
        year: Number(year),
      });

      if (initial?._id) {
        // UPDATE
        const res = await apiClientFetch<ClassDoc>(
          `/classes/${initial._id}`,
          { method: "PUT", body },
          { skipThrow: true }
        );

        if (isApiErrorResult(res)) {
          const msg =
            (typeof res.data === "string" && res.data) ||
            res.message ||
            "Cập nhật thất bại";
          setErr(msg);
          return;
        }

        // BE có thể trả doc sau update; fallback về id cũ nếu thiếu _id
        const targetId = res._id ?? initial._id;
        router.push(`/classes/${targetId}`);
      } else {
        // CREATE
        const res = await apiClientFetch<ClassDoc>(
          `/classes`,
          { method: "POST", body },
          { skipThrow: true }
        );

        if (isApiErrorResult(res)) {
          const msg =
            (typeof res.data === "string" && res.data) ||
            res.message ||
            "Tạo mới thất bại";
          setErr(msg);
          return;
        }

        router.push(`/classes/${res._id}`);
      }
    } finally {
      setLoading(false);
      router.refresh();
    }
  }

  async function onDelete() {
    if (!initial?._id) return;
    if (!confirm("Bạn chắc chắn muốn xoá lớp này?")) return;
    setLoading(true);
    setErr(null);

    const res = await apiClientFetch<{ message: string }>(
      `/classes/${initial._id}`,
      { method: "DELETE" },
      { skipThrow: true }
    );

    if (isApiErrorResult(res)) {
      const msg =
        (typeof res.data === "string" && res.data) ||
        res.message ||
        "Xoá thất bại";
      setErr(msg);
      setLoading(false);
      return;
    }

    setLoading(false);
    router.push("/classes");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Tên lớp</label>
        <input
          className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="VD: 12A1"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Khoa</label>
        <input
          className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          placeholder="VD: Công nghệ thông tin"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Khóa (năm)</label>
        <input
          type="number"
          className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          min={1900}
          max={3000}
          required
        />
      </div>

      {err && <p className="text-sm text-red-600">{err}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading || !canSubmit}
          className="rounded-lg bg-black text-white px-4 py-2 text-sm disabled:opacity-50"
        >
          {loading ? "Đang lưu..." : initial?._id ? "Cập nhật" : "Tạo mới"}
        </button>
        {initial?._id && (
          <button
            type="button"
            onClick={onDelete}
            disabled={loading}
            className="rounded-lg border px-4 py-2 text-sm disabled:opacity-50"
          >
            Xoá
          </button>
        )}
      </div>
    </form>
  );
}
