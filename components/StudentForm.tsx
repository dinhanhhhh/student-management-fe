// components/StudentForm.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Student } from "@/types/student";
import type { ClassDoc } from "@/types/class";
import { apiClientFetch } from "@/lib/api-client";

type Gender = "Male" | "Female" | "Other";

interface Props {
  /** Nếu có => edit; nếu không => create */
  initial?: Pick<
    Student,
    | "_id"
    | "name"
    | "email"
    | "studentId"
    | "gender"
    | "dateOfBirth"
    | "classId"
  > | null;
}

type ClassesListResponse = {
  data: ClassDoc[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export default function StudentForm({ initial }: Props) {
  const router = useRouter();

  // State form
  const [name, setName] = useState<string>(initial?.name ?? "");
  const [email, setEmail] = useState<string>(initial?.email ?? "");
  const [studentId, setStudentId] = useState<string>(initial?.studentId ?? "");
  const [gender, setGender] = useState<Gender | "">(
    (initial?.gender as Gender) ?? ""
  );
  const [dateOfBirth, setDateOfBirth] = useState<string>(() => {
    if (!initial?.dateOfBirth) return "";
    // Ensure yyyy-mm-dd for <input type="date">
    const d = new Date(initial.dateOfBirth);
    if (Number.isNaN(d.getTime())) return "";
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);
  });
  const [classId, setClassId] = useState<string>(() => {
    const c = initial?.classId;
    if (!c) return "";
    return typeof c === "string" ? c : c._id;
  });

  // Lớp để select
  const [classes, setClasses] = useState<ClassDoc[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Tải danh sách lớp
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoadingClasses(true);
      try {
        const res = await apiClientFetch<ClassesListResponse>(
          `/classes?limit=1000&sort=name`
        );
        if (mounted) setClasses(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoadingClasses(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const canSubmit = useMemo(() => {
    return name.trim() && email.trim();
  }, [name, email]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!canSubmit) {
      setError("Vui lòng nhập tối thiểu Họ tên và Email.");
      return;
    }

    setSubmitting(true);
    try {
      // Chuẩn bị payload theo đúng schema BE
      const payload: Record<string, unknown> = {
        name: name.trim(),
        email: email.trim(),
      };
      if (studentId.trim()) payload.studentId = studentId.trim();
      if (gender) payload.gender = gender;
      if (dateOfBirth)
        payload.dateOfBirth = new Date(
          dateOfBirth + "T00:00:00Z"
        ).toISOString();
      if (classId) payload.classId = classId;

      if (initial?._id) {
        // UPDATE
        await apiClientFetch<Student>(`/students/${initial._id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        router.push(`/students/${initial._id}`);
      } else {
        // CREATE
        const created = await apiClientFetch<Student>(`/students`, {
          method: "POST",
          body: JSON.stringify(payload),
        });
        // Check if created has _id property before accessing it
        if ("_id" in created) {
          router.push(`/students/${created._id}`);
        }
      }
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "Không thể gửi dữ liệu. Thử lại sau.";
      setError(msg);
    } finally {
      setSubmitting(false);
      router.refresh();
    }
  }

  async function onDelete() {
    if (!initial?._id) return;
    if (!confirm("Bạn chắc chắn muốn xoá sinh viên này?")) return;
    setSubmitting(true);
    setError(null);
    try {
      await apiClientFetch<{ message: string }>(`/students/${initial._id}`, {
        method: "DELETE",
      });
      router.push("/students");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Xoá thất bại. Thử lại sau.";
      setError(msg);
    } finally {
      setSubmitting(false);
      router.refresh();
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Họ tên</label>
        <input
          className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="VD: Nguyễn Văn A"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="vana@example.com"
          required
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">MSSV (tùy chọn)</label>
          <input
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="VD: SV001"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Giới tính</label>
          <select
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            value={gender}
            onChange={(e) => setGender(e.target.value as Gender | "")}
          >
            <option value="">— Chưa chọn —</option>
            <option value="Male">Nam</option>
            <option value="Female">Nữ</option>
            <option value="Other">Khác</option>
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Ngày sinh</label>
          <input
            type="date"
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Lớp</label>
          <select
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            disabled={loadingClasses}
          >
            <option value="">
              {loadingClasses ? "Đang tải..." : "— Chọn lớp —"}
            </option>
            {classes.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name} • {c.department} • {c.year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting || !canSubmit}
          className="rounded-lg bg-black text-white px-4 py-2 text-sm disabled:opacity-50"
        >
          {submitting ? "Đang lưu..." : initial?._id ? "Cập nhật" : "Tạo mới"}
        </button>

        {initial?._id && (
          <button
            type="button"
            onClick={onDelete}
            disabled={submitting}
            className="rounded-lg border px-4 py-2 text-sm disabled:opacity-50"
          >
            Xoá
          </button>
        )}
      </div>
    </form>
  );
}
