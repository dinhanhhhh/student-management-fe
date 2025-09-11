// components/SubjectForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { SubjectDoc } from "@/types/subject";
import { apiClientFetch } from "@/lib/api-client";

interface Props {
  /** nếu có => là edit, nếu không => create */
  initial?: Pick<SubjectDoc, "_id" | "name" | "code" | "credit"> | null;
}

export default function SubjectForm({ initial }: Props) {
  const router = useRouter();

  const [name, setName] = useState<string>(initial?.name ?? "");
  const [code, setCode] = useState<string>(initial?.code ?? "");
  const [credit, setCredit] = useState<number>(initial?.credit ?? 3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const body = JSON.stringify({ name, code, credit });

      if (initial?._id) {
        // PUT /api/subjects/:id → /be/subjects/:id
        await apiClientFetch<SubjectDoc>(`/subjects/${initial._id}`, {
          method: "PUT",
          body,
        });
        router.push(`/subjects/${initial._id}`);
      } else {
        // POST /api/subjects → /be/subjects
        const created = await apiClientFetch<SubjectDoc>(`/subjects`, {
          method: "POST",
          body,
        });
        if ("_id" in (created as SubjectDoc)) {
          router.push(`/subjects/${(created as SubjectDoc)._id}`);
        } else {
          router.push("/subjects");
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Lỗi gửi dữ liệu";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div>
        <label className="block text-sm font-medium">Tên môn</label>
        <input
          className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="VD: Cấu trúc dữ liệu"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Mã môn</label>
        <input
          className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="VD: CTDL"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          BE sẽ tự viết hoa và bỏ khoảng trắng.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium">Tín chỉ</label>
        <input
          className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
          type="number"
          min={0}
          value={credit}
          onChange={(e) => setCredit(Number(e.target.value))}
          required
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-black text-white px-4 py-2 text-sm disabled:opacity-50"
        >
          {loading ? "Đang lưu..." : initial?._id ? "Cập nhật" : "Tạo mới"}
        </button>
      </div>
    </form>
  );
}
